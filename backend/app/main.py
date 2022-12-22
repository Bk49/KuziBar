# API related packages
from fastapi import FastAPI, Query, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from datetime import timedelta

# Database
from bson import ObjectId
from app.db import DB_handler, Customer

# Authetication
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import Authenticator, Token

# logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# variables
newuser = Customer()
db_handler = DB_handler()
authenticator = Authenticator()
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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
    user = await authenticator.authenticate_user(email, password)
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

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login for access token."""
    user = authenticator.authenticate_user(form_data.username, form_data.password)
    logger.info(f"LOOK HEREEEEE {str(user)}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = authenticator.create_access_token(
        data={"sub": user["cust_email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: str = Depends(authenticator.get_current_user)):
    """Get user own credentials."""
    return User(name=current_user['cust_name'], email=current_user['cust_email'], password=current_user['cust_password'])


def create_user(email, username, password):
    """Create new user."""
    newuser.cust_id = ObjectId()
    newuser.cust_email = email
    newuser.cust_name = username
    newuser.cust_password = password
    return dict(newuser)
