from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.item_db import Item_DB_handler
from ..log import Logger
from ..schemas import NewItem, Item, OwnedItem
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

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
async def create_item(new_item: NewItem):
    new_item = jsonable_encoder(new_item)
    item = item_db_handler.add_one(new_item)

    created_item = item_db_handler.get_one(item.inserted_id)

    logger.info(f"Successfully created new item, id: {str(item.inserted_id)}")
    return created_item

@router.put("/", response_model=Item)
async def update_item(item_id: str, item: NewItem):
    update_item_encoded = jsonable_encoder(item)
    
    updated_item = item_db_handler.put_one(ObjectId(item_id), update_item_encoded)

    if updated_item is None:
        logger.error(f"Item id {id} was not updated.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Item {id} was not updated.")
    
    logger.info(f"Successfully updated item, id: {item_id}")
    return updated_item


@router.put("/customisation", response_model=OwnedItem)
async def select_skin(item_id: str, skin_image: str):
    if (item := item_db_handler.get_one(ObjectId(item_id))) is None:
        logger.error(f"Item id {item_id} does not exist.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Item id {item_id} does not exist.") 

    if len(item["skins"]) == 0 or item["owner_id"] is None or item["owner_id"] == "" or item["confirm_skin"]:
        logger.error(f"Item id {item_id} is not customizable.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Item id {item_id} is not customizable.") 
    
    result = item_db_handler.select_skin(ObjectId(item_id), skin_image)
    if result:
        return item_db_handler.get_one(ObjectId(item_id))
    else:
        logger.error(f"Item id {item_id} failed to customised.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Item id {item_id} failed to customised.") 

