from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.lottery_db import Lottery_DB_handler
from ..databases.item_db import Item_DB_handler
from ..databases.user_db import User_DB_handler
from ..log import Logger
from ..schemas import Lottery, NewLottery, LotteryItem, LotteryData, BaseLottery
from typing import List
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from datetime import date

# variables
authenticator = Authenticator()
lottery_db_handler = Lottery_DB_handler()
item_db_handler = Item_DB_handler()
user_db_handler = User_DB_handler()
logger = Logger("lottery")

# router definition
router = APIRouter(
    prefix="/lottery",
    tags=["lottery"],
    dependencies=[Depends(authenticator.get_current_user)],
    responses={404: {"description": "Not found"}},
)

router_public = APIRouter(
    prefix="/lottery",
    tags=["lottery public"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_description="Add new lottery", response_model=Lottery)
async def create_lottery(new_lottery: NewLottery):
    """Create a new lottery."""
    new_lottery = jsonable_encoder(new_lottery)
    new_items = new_lottery["lottery_items"]
    del new_lottery['lottery_items']

    # append date
    new_lottery['date_created'] = str(date.today())

    # create new lottery
    lottery = lottery_db_handler.add_one(new_lottery)
    created_lottery = lottery_db_handler.get_one(lottery.inserted_id)

    # create new items
    for new_item in new_items:
        new_item["lottery_id"] = str(lottery.inserted_id)
        item_db_handler.add_one(new_item)

    logger.info(
        f"Successfully created new lottery, id: {str(lottery.inserted_id)}")
    return created_lottery


@router_public.get("/", response_description="List all published lotteries", response_model=List[Lottery])
async def read_published_lotteries():
    """Read all published lotteries."""
    lotteries = lottery_db_handler.get_published_lottery()

    for lottery in lotteries:
        lottery = postprocess_lottery(lottery)

    logger.info(f"Successfully read all published lotteries.")
    return lotteries


@router_public.get("/{id}", response_description="Get a single lottery", response_model=Lottery)
async def read_lottery(id: str):
    """Retrieve a lottery using its id."""
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is not None:
        lottery = postprocess_lottery(lottery)
        logger.info(f"Lottery id {id} found.")
        return lottery

    logger.error(f"Lottery id {id} not found.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Lottery {id} not found")


@router_public.get("/{id}/items", response_description="Get the items of a lottery", response_model=List[LotteryItem])
async def read_lottery_items(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is None:
        logger.error(f"Lottery id {id} not found, items not returned.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lottery {id} not found")

    # get all items of the lottery
    items = item_db_handler.get_lottery_items(id)

    logger.info(f"Lottery id {id} found, returned all items.")
    return items


@router.get("/{id}/ten_items", response_description="Get the top 10 items of a lottery", response_model=List[LotteryItem])
async def read_10_lottery_items(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is None:
        logger.error(f"Lottery id {id} not found, items not returned.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lottery {id} not found")

    # get top 10 items of the lottery
    items = item_db_handler.get_top_ten(id)

    logger.info(f"Lottery id {id} found, returned top 10 items.")
    return items


@router.put("/{id}", response_model=LotteryData)
async def update_lottery(lottery_id: str, lottery: NewLottery):
    lottery = jsonable_encoder(lottery)
    items = lottery["lottery_items"]
    del lottery['lottery_items']

    # append date
    lottery['date_created'] = str(date.today())

    # delete old item
    delete_status = item_db_handler.delete_lottery_item(lottery_id)
    if not delete_status:
        logger.error(f"Item with lottery id {id} was not all deleted.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Item with lottery id {id} was not all deleted.")
    logger.info(
        f"Successfully deleted all old items of lottery_id {lottery_id}.")

    # create new items
    for item in items:
        item["lottery_id"] = lottery_id
        item_db_handler.add_one(item)

    # update lottery
    updated_lottery = lottery_db_handler.put_one(ObjectId(lottery_id), lottery)

    if updated_lottery is None:
        logger.error(f"Lottery id {id} was not updated.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lottery {id} was not updated.")

    logger.info(
        f"Successfully updated lottery, id: {lottery_id}")
    return updated_lottery


@router.delete("/{id}", response_description="Delete a draft lottery")
async def delete_draft_lottery(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is None:
        logger.error(f"Lottery id {id} does not exist.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lottery id {id} does not exist.")

    # check draft
    if lottery["status"] == 0:
        # delete items
        result = item_db_handler.delete_lottery_item(ObjectId(id))
        if not result: 
            logger.error(f"Items of lottery id {id} was not properly deleted.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Items of lottery id {id} was not properly deleted.")
        
        # delete lottery
        result = lottery_db_handler.delete_lottery(ObjectId(id))
        if not result:
            logger.error(f"Lottery id {id} was not properly deleted.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Lottery id {id} was not properly deleted.")

    else:
        logger.error(f"Lottery id {id} is not drafted.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Lottery id {id} is not drafted.")
 
    logger.info(f"Successfully deleted lottery id {id} found.")
    return {"message": "Lottery deleted"}

# @router.put("/{id}", response_model=LotteryData)
# async def update_lottery(lottery_id: str, lottery: BaseLottery):
#     update_item_encoded = jsonable_encoder(lottery)

#     updated_lottery = lottery_db_handler.put_one(ObjectId(lottery_id), update_item_encoded)

#     if updated_lottery is None:
#         logger.error(f"Lottery id {id} was not updated.")
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail=f"Lottery {id} was not updated.")

#     logger.info(f"Successfully updated lottery, id: {lottery_id}")
#     return updated_lottery


def postprocess_lottery(lottery):
    """Post process lottery document returned from database to include more info."""
    # possible_drops = []
    # for i in range(3):
    #     drop = item_db_handler.get_item_by_tier(str(lottery['_id']), i+1)
    #     if drop is not None:
    #         possible_drops.append(drop)
    lottery['possible_drops'] = item_db_handler.get_top_three(
        str(lottery['_id']))

    # add creator name
    user = user_db_handler.get_one(ObjectId(lottery['creator_id']))
    lottery['creator_name'] = user['user_name']

    return lottery
