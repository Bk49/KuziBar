# API related packages
from fastapi import FastAPI, HTTPException, Depends, status

# Database
from bson import ObjectId
from app.db import DB_handler
from app.schemas import User, Customer, Token

# Authetication
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import Authenticator

# logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# variables
newuser = Customer()
db_handler = DB_handler()
authenticator = Authenticator()
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# init FastAPI
app = FastAPI()


@app.get("/")
def zilliqa_mochi():
    return {"message": "Zilliqa mochi down town!"}


@app.post("/signup/", summary="Register new user")
def add_user(user: User):
    """Create a new user."""
    new_user = create_user(user.email, user.name,
                           authenticator.get_password_hash(user.password))

    # check if email exist already
    if db_handler.user_exist(new_user['cust_email']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Customer exists")
    else:
        db_handler.add_user(new_user)
        return {"message": "User created", "email": new_user['cust_email'], "name": new_user['cust_name']}


@app.post("/token", response_model=Token, summary="Create access and refresh tokens for user")
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
        data={"sub": user["cust_email"]})
    refresh_token = authenticator.create_refresh_token(
        data={"sub": user["cust_email"]})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@app.get('/logout', summary="Log out user")
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
    return User(name=current_user['cust_name'], email=current_user['cust_email'], password=current_user['cust_password'])


@app.post('/refresh', summary="Use refresh token to generate a new access token")
async def refresh(new_token: str = Depends(authenticator.refresh_current_user)):
    return {'result': True, 'access_token': new_token}


@app.get("/all_users/", summary="Read all user [should be removed]")
def read_users():
    """Read all users."""
    documents = db_handler.get_all_user()
    return {"messsage": str(documents)}


def create_user(email, username, password):
    """Create new user."""
    newuser.cust_id = ObjectId()
    newuser.cust_email = email
    newuser.cust_name = username
    newuser.cust_password = password
    return dict(newuser)
