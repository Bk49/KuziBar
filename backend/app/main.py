# API related packages
from .routers import lotteries
from .routers import users
from .routers import ticket
from fastapi import FastAPI, HTTPException, Depends, status, Body

#CORS 
from fastapi.middleware.cors import CORSMiddleware
# Database
from .databases.user_db import User_DB_handler
from .databases.token_db import Token_DB_handler
from app.schemas import *
from fastapi.encoders import jsonable_encoder

# Authetication
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import Authenticator

# logging
from app.log import Logger

# variables
user_db_handler = User_DB_handler()
token_db_handler = Token_DB_handler()
authenticator = Authenticator()
logger = Logger("main")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# init FastAPI
app = FastAPI()

# declare origins 
origins = [
    "http://localhost",
    "http://localhost:3000"
]

# add origin to CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods= ["*"],
    allow_headers = ["*"]
)
# routers
app.include_router(users.router)
app.include_router(lotteries.router)
app.include_router(ticket.router)


@app.get("/")
def zilliqa_mochi():
    return {"message": "Zilliqa mochi down town!"}


@app.post("/signup/", summary="Register new user", response_model=User)
def add_user(new_user: NewUser = Body(...)):
    """Create a new user."""
    new_user = jsonable_encoder(new_user)

    # check if email exist already
    if user_db_handler.user_exist(new_user['user_email']):
        logger.error(f"User {new_user['user_email']} exists.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User exists")

    # create new user
    else:
        new_user['user_password'] = authenticator.get_password_hash(
            new_user['user_password'])
        user = user_db_handler.add_one(new_user)
        created_user = user_db_handler.get_one(user.inserted_id)
        logger.info(f"User {new_user['user_email']} created.")
        return created_user


@app.post("/token/", response_model=Tokens, summary="Create access and refresh tokens for user")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login for access token."""
    # authenticate user
    user = authenticator.authenticate_user(
        form_data.username, form_data.password)
    if not user:
        logger.error(f"Authentication failed while calling /token/.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # create tokens
    access_token = authenticator.create_access_token(
        data={"sub": user["user_email"]})
    refresh_token = authenticator.create_refresh_token(
        data={"sub": user["user_email"]})
    logger.info(f"Authenticated user {user['user_email']}.")
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@app.get('/logout/', summary="Log out user")
def logout(token: str = Depends(authenticator.get_current_user_token)):
    """Logout user and blacklist token."""
    if token_db_handler.add_one({"token": token}):
        logger.info(f"Blacklisted token and logout user.")
        return {'result': True}

    logger.error(f"Authentication failed while calling /logout/.")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials, logout failed",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.post('/refresh/', summary="Use refresh token to generate a new access token")
async def refresh(new_token: str = Depends(authenticator.refresh_current_user)):
    logger.info(f"New access token generated.")
    return {'result': True, 'access_token': new_token}
