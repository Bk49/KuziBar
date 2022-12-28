from pydantic import BaseModel
from typing import Union, List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
import datetime


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Tokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class NewUser(BaseModel):
    user_name: str = Field(..., min_length=1, max_length=50)
    user_email: EmailStr = Field(...)
    user_password: str = Field(..., min_length=1)


class User(BaseModel):
    """User class on FastAPI."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_name: str = Field(..., min_length=1, max_length=50)
    user_email: EmailStr = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "1234567890",
                "user_name": "example",
                "user_email": "123@example.com"
            }
        }


class Skin(BaseModel):
    skin_name: str = Field(...)
    skin_image: str = Field(...)


class LotteryItem(BaseModel):
    item_name: str = Field(...)
    image: str = Field(...)
    tier: int = Field(...)
    skins: Union[List[Skin], None] = []


class NewItem(LotteryItem):
    lottery_id: str = Field(...)


class SimpleItem(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    item_name: str = Field(...)
    image: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Item(NewItem):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "1234567890",
                "image": "item_pic_URL",
                "item_name": "item_name",
                "tier": 1,
                "lottery_id": "sample_id",
                "skins": [
                    {
                        "skin_name": "skin_name",
                        "skin_image": "skin_image_URL"
                    },
                    {
                        "skin_name": "skin_name2",
                        "skin_image": "skin_image_URL2"
                    }
                ]
            }
        }


class BaseLottery(BaseModel):
    lottery_name: str = Field(...)
    image: str = Field(...)
    date_created: Union[datetime.date, None] = None
    price: int = Field(...)
    creator_id: str = Field(...)
    remaining_tickets: int = Field(...)
    status: int = Field(..., ge=0, le=1)

class NewLottery(BaseLottery):
    lottery_items: Union[List[LotteryItem], None] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Lottery(BaseLottery):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    possible_drops: Union[List[SimpleItem], None] = []
    creator_name: str = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
