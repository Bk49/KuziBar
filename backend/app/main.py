# API related packages
from fastapi import FastAPI, Query, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field

# MongoDB related packages
from bson import ObjectId
from schematics.models import Model
from schematics.types import StringType, EmailType
from pymongo import MongoClient

# autehntication library
from passlib.context import CryptContext

# logging library
import logging
import app.settings as settings

# logging handler
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

#  password handler
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# mongoDB instance
client = MongoClient(settings.mongodb_uri, settings.port)
db = client.testingdata

# user class on MongoDB


class Customer(Model):
    cust_id = ObjectId()
    cust_email = EmailType(required=True)
    cust_name = StringType(required=True)
    cust_password = StringType(required=True)


# an instance of User
newuser = Customer()

# function to create user


def create_user(email, username, password):
    newuser.custid = ObjectId()
    newuser.cust_email = email
    newuser.cust_name = username
    newuser.cust_password = password
    return dict(newuser)

# user class on fastAPI


class User(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)


# init fasrAPI
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
            status_code=400, detail="Incorrect username or password")


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
    user_exist = False
    data = create_user(user.email, user.name, get_password_hash(user.password))

    # check if email exist already
    if db.users.find_one({'cust_email': data['cust_email']}) is not None:
        user_exist = True
        raise HTTPException(status_code=400, detail="Customer exists")
    elif user_exist == False:
        db.users.insert_one(data)
        return {"message": "User created", "email": data['cust_email'], "name": data['cust_name']}


@app.get("/all_users/")
def read_users():
    """Read all users."""
    documents = get_all_documents()
    return {"messsage": str(documents)}


def get_all_documents():
    """Helper function to read all user."""
    list_of_users = []
    for user in db.users.find():
        list_of_users.append(user)
    return list_of_users


def verify_password(plain_pw: str, hashed_pw: str):
    """Verify password."""
    return pwd_context.verify(plain_pw, hashed_pw)


def get_password_hash(pw: str):
    """Get hashed password."""
    return pwd_context.hash(pw)


async def authenticate_user(email: str, password: str):
    """Authenticate the user using the email and password.

    Returns:
        bool: status of login
    """
    user = db.users.find_one({'cust_email': email})
    if not user:
        return False
    if not verify_password(password, user["cust_password"]):
        return False
    return user
