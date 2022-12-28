from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.user_db import User_DB_handler
from ..log import logger
from ..schemas import User
from typing import List


authenticator = Authenticator()
user_db_handler = User_DB_handler()

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
    logger.info("ALL USERS" + str(documents))
    logger.info("LIST TYPE" + str(type(documents)))
    return documents


@router.get("/me", response_model=User)
async def read_user_me(current_user : str = Depends(authenticator.get_current_user)):
    """Get user own credentials."""
    return current_user


@router.get("/{email}", response_model=User)
async def read_user(email: str):
    if (user := user_db_handler.get_user(email)) is not None:
        return user

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"User {email} not found")
