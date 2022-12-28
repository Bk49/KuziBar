from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.user_db import User_DB_handler
from ..log import Logger
from ..schemas import User
from typing import List

# variables
authenticator = Authenticator()
user_db_handler = User_DB_handler()
logger = Logger("users")

# router definition
router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(authenticator.get_current_user)],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[User])
async def read_users():
    """Read all users."""
    documents = user_db_handler.get_all()
    logger.info(f"Successfully read all Users.")
    return documents


@router.get("/me", response_model=User)
async def read_user_me(current_user: str = Depends(authenticator.get_current_user)):
    """Get user own credentials."""
    logger.info(f"Successfully read current user.")
    return current_user


@router.get("/{email}", response_model=User)
async def read_user(email: str):
    if (user := user_db_handler.get_user(email)) is not None:
        logger.info(f"Successfully read user by email.")
        return user

    logger.error(f"Failed to read user by email.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"User {email} not found")
