# API related packages
from fastapi import FastAPI, Query, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field

# Database
from bson import ObjectId
from app.db import DB_handler, Customer

# Authetication
from app.auth import Authenticator

# logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")


# variables
newuser = Customer()
db_handler = DB_handler()
authenticator = Authenticator()


class User(BaseModel):
    """User class on FastAPI."""
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)


# init FastAPI
app = FastAPI()


@app.get("/")
def zilliqa_mochi():
    return {"message": "Zilliqa mochi down town!"}


@app.post("/login")
async def login(email: str = Query(..., description="The email of the user"),
                password: str = Query(..., description="The password of the user")):
    """API entry point for login authentication.

    Returns:
        HTTPresponse: API response message
    """
    user = await authenticate_user(email, password)
    if user:
        return {"message": "Login successful"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")


@app.post("/signup/")
def add_user(user: User):
    """Create a new user.

    Args:
        user (User): user instance with name, password and email.

    Raises:
        HTTPException: 400, if user already exist

    Returns:
        HTTPResponse: user created with corresponding details
    """
    new_user = create_user(user.email, user.name,
                           authenticator.get_password_hash(user.password))

    # check if email exist already
    if db_handler.user_exist(new_user['cust_email']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Customer exists")
    else:
        db_handler.add_user(new_user)
        return {"message": "User created", "email": new_user['cust_email'], "name": new_user['cust_name']}


@app.get("/all_users/")
def read_users():
    """Read all users."""
    documents = db_handler.get_all_user()
    return {"messsage": str(documents)}


async def authenticate_user(email: str, password: str):
    """Authenticate the user using the email and password.

    Returns:
        bool: status of login
    """
    user = db_handler.get_user(email)
    if not user:
        return False
    if not authenticator.verify_password(password, user["cust_password"]):
        return False
    return user


def create_user(email, username, password):
    """Create new user."""
    newuser.cust_id = ObjectId()
    newuser.cust_email = email
    newuser.cust_name = username
    newuser.cust_password = password
    return dict(newuser)
