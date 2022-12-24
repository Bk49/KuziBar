from pydantic import BaseModel
from typing import Union
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from schematics.models import Model
from schematics.types import StringType, EmailType


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class User(BaseModel):
    """User class on FastAPI."""
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)


class Customer(Model):
    """User class on MongoDB."""
    cust_id = ObjectId()
    cust_email = EmailType(required=True)
    cust_name = StringType(required=True)
    cust_password = StringType(required=True)
