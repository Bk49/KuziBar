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
    skin_id: Union[str, None] = None
    skin_name: str = Field(...)
    skin_image: str = Field(...)


class NewItem(BaseModel):
    item_name: str = Field(...)
    item_image: str = Field(...)
    tier: int = Field(...)
    drop_rate: float = Field(...)
    skins: Union[List[Skin], None] = []
    lottery_id: PyObjectId = Field(
        default_factory=PyObjectId, alias="lottery_id")


class Item(NewItem):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "1234567890",
                "item_pic": "item_pic_URL",
                "item_name": "item_name",
                "tier": 1,
                "drop_rate": 0.9,
                "lottery_id": "sample_id",
                "skins": [
                    {
                        "skin_id": "12345",
                        "skin_name": "skin_name",
                        "skin_image": "skin_image_URL"
                    },
                    {
                        "skin_id": "123456",
                        "skin_name": "skin_name2",
                        "skin_image": "skin_image_URL2"
                    }
                ]
            }
        }


class NewLottery(BaseModel):
    lottery_name: str = Field(...)
    cover_image: str = Field(...)
    date_created: Union[datetime.date, None] = None
    prize_per_pull: int = Field(...)
    creator_id: PyObjectId = Field(default_factory=PyObjectId, alias="creator_id")
    # creator_name: str = Field(...)
    # creator_prof_pic: str = Field(...)
    remaining_tickets: int = Field(...)
    # possible_drops: Union[List[Item], None] = []
    status: int = Field(..., ge=0, le=1)
    items: Union[List[NewItem], None] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Lottery(NewLottery):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    possible_drops: Union[List[Item], None] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "1234567890",
                "lottery_name": "example",
                "cover_image": "cover_img_URL",
                "date_created": "2008-09-15",
                "prize_per_pull": 10,
                "creator_id": "0987654321",
                "creator_name": "example2",
                "creator_prof_pic": "creator_img_URL",
                "remaining_tickets": 10,
                "possible_drops": [
                    {
                        "item_id": "12345",
                        "item_pic": "item_URL"
                    },
                    {
                        "item_id": "123456",
                        "item_pic": "item_URL2"
                    }
                ]
            }
        }
