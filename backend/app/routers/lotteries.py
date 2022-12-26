from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.lottery_db import Lottery_DB_handler
from ..databases.item_db import Item_DB_handler 
from ..log import logger
from ..schemas import Lottery, NewLottery
from typing import List
from fastapi.encoders import jsonable_encoder
from bson import ObjectId


authenticator = Authenticator()
lottery_db_handler = Lottery_DB_handler()
item_db_handler = Item_DB_handler()

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
        new_item["lottery_id"] = lottery.inserted_id
        item_db_handler.add_one(new_item)

    return created_lottery


@router.get("/", response_description="List all lotteries", response_model=List[Lottery])
async def read_lotteries():
    lotteries = lottery_db_handler.get_all()
    return lotteries


@router.get("/{id}", response_description="Get a single lottery", response_model=Lottery)
async def read_lottery(id: str):
    if (lottery := lottery_db_handler.get_one(ObjectId(id))) is not None:
        return lottery

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Lottery {id} not found")