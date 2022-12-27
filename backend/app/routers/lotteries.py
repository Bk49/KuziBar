from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.lottery_db import Lottery_DB_handler
from ..databases.item_db import Item_DB_handler 
from ..databases.user_db import User_DB_handler
from ..log import logger
from ..schemas import Lottery, NewLottery, Item
from typing import List
from fastapi.encoders import jsonable_encoder
from bson import ObjectId


authenticator = Authenticator()
lottery_db_handler = Lottery_DB_handler()
item_db_handler = Item_DB_handler()
user_db_handler = User_DB_handler()


router = APIRouter(
    prefix="/lottery",
    tags=["lottery"],
    dependencies=[Depends(authenticator.get_current_user)],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_description="Add new lottery", response_model=Lottery)
async def create_lottery(new_lottery: NewLottery):
    new_lottery = jsonable_encoder(new_lottery)
    new_items = new_lottery["items"]
    del new_lottery['items']

    # create new lottery
    lottery = lottery_db_handler.add_one(new_lottery)
    created_lottery = lottery_db_handler.get_one(lottery.inserted_id)

    # create new items
    for new_item in new_items:
        new_item["lottery_id"] = str(lottery.inserted_id)
        item_db_handler.add_one(new_item)

    return created_lottery


@router.get("/", response_description="List all lotteries", response_model=List[Lottery])
async def read_lotteries():
    lotteries = lottery_db_handler.get_all()

    for lottery in lotteries:
        lottery = postprocess_lottery(lottery)

    return lotteries


@router.get("/{id}", response_description="Get a single lottery", response_model=Lottery)
async def read_lottery(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is not None:
        lottery = postprocess_lottery(lottery)
        return lottery

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Lottery {id} not found")

@router.get("/{id}/items", response_description="Get the items of a lottery", response_model=List[Item])
async def read_lottery(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Lottery {id} not found")
    
    items = item_db_handler.get_lottery_items(id)

    return items

def postprocess_lottery(lottery):
    """Post process lottery document returned from database to include more info."""
    possible_drops = []
    for i in range(3):
        drop = item_db_handler.get_item_by_tier(str(lottery['_id']), i+1)
        if drop is not None:
            possible_drops.append(drop)
    lottery['possible_drops'] = possible_drops

    # add creator name and pp
    user = user_db_handler.get_one(ObjectId(lottery['creator_id']))
    lottery['creator_name'] = user['user_name']
    lottery['creator_prof_pic'] = user['user_pp']

    return lottery