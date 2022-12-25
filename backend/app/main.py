# API related packages
from fastapi import FastAPI, HTTPException, Depends, status, Body
from typing import List

# Database
from bson import ObjectId
from app.db import DB_handler
from app.schemas import *
from fastapi.encoders import jsonable_encoder

# Authetication
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import Authenticator

# logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# variables
db_handler = DB_handler()
authenticator = Authenticator()
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# init FastAPI
app = FastAPI()


@app.get("/")
def zilliqa_mochi():
    return {"message": "Zilliqa mochi down town!"}


@app.post("/signup/", summary="Register new user", response_model=User)
def add_user(new_user: NewUser = Body(...)):
    """Create a new user."""
    new_user = jsonable_encoder(new_user)

    # check if email exist already
    if db_handler.user_exist(new_user['user_email']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User exists")
    else:
        new_user['user_password'] = authenticator.get_password_hash(new_user['user_password'])
        user = db_handler.add_user(new_user)
        created_user = db_handler.get_user_by_id(user.inserted_id)
        return created_user


@app.post("/token/", response_model=Tokens, summary="Create access and refresh tokens for user")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login for access token."""
    user = authenticator.authenticate_user(
        form_data.username, form_data.password)
    logger.info(f"LOOK HEREEEEE {str(user)}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = authenticator.create_access_token(
        data={"sub": user["user_email"]})
    refresh_token = authenticator.create_refresh_token(
        data={"sub": user["user_email"]})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@app.get('/logout/', summary="Log out user")
def logout(token: str = Depends(authenticator.get_current_user_token)):
    """Logout user and blacklist token."""
    if db_handler.add_blacklist_token(token):
        return {'result': True}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials, logout failed",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.get("/users/me/", response_model=User, summary="Get current user details")
async def read_users_me(current_user: str = Depends(authenticator.get_current_user)):
    """Get user own credentials."""
    return current_user


@app.post('/refresh/', summary="Use refresh token to generate a new access token")
async def refresh(new_token: str = Depends(authenticator.refresh_current_user)):
    return {'result': True, 'access_token': new_token}


@app.get("/all_users/", summary="Read all user [should be removed]", response_model=List[User])
def read_users(current_user: str = Depends(authenticator.get_current_user)):
    """Read all users."""
    documents = db_handler.get_all_user()
    logger.info("ALL USERS" + str(documents))
    logger.info("LIST TYPE" + str(type(documents)))
    return documents


@app.post("/lottery/", response_description="Add new lottery", response_model=Lottery)
async def create_lottery(new_lottery: NewLottery):
    new_lottery = jsonable_encoder(new_lottery)
    new_items = new_lottery["items"]
    del new_lottery['items']

    # create new lottery
    lottery = db_handler.add_lottery(new_lottery)
    created_lottery = db_handler.get_lottery(lottery.inserted_id)

    # create new items
    for new_item in new_items:
        new_item["lottery_id"] = lottery.inserted_id
        db_handler.add_item(new_item)

    return created_lottery


@app.get("/all_lotteries/", response_description="List all lotteries", response_model=List[Lottery])
async def read_lotteries():
    lotteries = db_handler.get_all_lottery()
    return lotteries


@app.get("/lottery/{id}", response_description="Get a single lottery", response_model=Lottery)
async def read_lottery(id: str):
    if (lottery := db_handler.get_lottery(ObjectId(id))) is not None:
        return lottery

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Lottery {id} not found")
                   
