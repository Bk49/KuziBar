from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.item_db import Item_DB_handler
from ..log import Logger
from ..schemas import NewItem
from fastapi.encoders import jsonable_encoder

# variables
authenticator = Authenticator()
item_db_handler = Item_DB_handler()
logger = Logger("lottery")

# router definition
router = APIRouter(
    prefix="/item",
    tags=["item"],
    dependencies=[Depends(authenticator.get_current_user)],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_description="Add new item", response_model=NewItem)
async def create_lottery(new_item: NewItem):
    new_item = jsonable_encoder(new_item)
    item = item_db_handler.add_one(new_item)

    created_item = item_db_handler.get_one(item.inserted_id)

    logger.info(f"Successfully created new item, id: {str(item.inserted_id)}")
    return created_item
