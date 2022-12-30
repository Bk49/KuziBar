from fastapi import APIRouter, Depends, HTTPException, status
from ..auth import Authenticator
from ..databases.user_db import User_DB_handler
from ..databases.item_db import Item_DB_handler
from ..databases.lottery_db import Lottery_DB_handler
from ..databases.ticket_db import Ticket_DB_handler
from ..log import Logger
from ..schemas import User, Item, LotteryTicket, Lottery
from typing import List
from bson import ObjectId
from app.routers.lotteries import postprocess_lottery

# variables
authenticator = Authenticator()
user_db_handler = User_DB_handler()
lottery_db_handler = Lottery_DB_handler()
item_db_handler = Item_DB_handler()
ticket_db_handler = Ticket_DB_handler()
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


@router.get("/{id}/owned_items", response_model=List[Item])
async def read_user_items(id: str):
    """Read owned items of a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve owned items.")
        items = item_db_handler.get_owned_items(id)

        logger.info(f"Successfully get owned items.")
        return items

    logger.error(f"Failed to read owned items.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read owned items of user {id}.")


@router.get("/{id}/customizable_items", response_model=List[Item])
async def read_user_customizable_items(id: str):
    """Read customizable items of a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve customizable items.")
        custom_items = item_db_handler.get_customizable_items(id)

        logger.info(f"Successfully get customizable items.")
        return custom_items

    logger.error(f"Failed to read customizable items.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read customizable items of user {id}.")


@router.get("/{id}/lottery_tickets", response_model=List[LotteryTicket])
async def read_user_lottery_tickets(id: str):
    """Read lottery tickets of a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve lottery tickets.")
        tickets = ticket_db_handler.get_user_tickets(id)
        lottery_ticket_list = []

        for ticket in tickets:
            lottery = lottery_db_handler.get_one(
                ObjectId(ticket["lottery_id"]))
            lottery = postprocess_lottery(lottery)
            lottery_ticket = LotteryTicket(**lottery)
            lottery_ticket.ticket_quantity = ticket["entry_quantity"]
            lottery_ticket_list.append(lottery_ticket)

        logger.info(f"Successfully get lottery tickets.")
        return lottery_ticket_list

    logger.error(f"Failed to read lottery tickets .")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read lottery tickets of user {id}.")


@router.get("/{id}/lottery", response_model=List[Lottery])
async def read_user_lottery(id: str):
    """Read lotteries created by a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve lotteries.")
        lotteries = lottery_db_handler.get_user_lottery(id)
        lotteries = [postprocess_lottery(lottery) for lottery in lotteries]

        logger.info(f"Successfully get lotteries.")
        return lotteries

    logger.error(f"Failed to read lotteries.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read lotteries of user {id}.")


@router.get("/{id}/lottery_drafts", response_model=List[Lottery])
async def read_user_lottery_drafts(id: str):
    """Read drafted lotteries created by a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve drafted lotteries.")
        lotteries = lottery_db_handler.get_user_lottery_drafts(id)
        lotteries = [postprocess_lottery(lottery) for lottery in lotteries]

        logger.info(f"Successfully get drafted lotteries.")
        return lotteries

    logger.error(f"Failed to read drafted lotteries.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read drafted lotteries of user {id}.")


@router.get("/{id}/lottery_published", response_model=List[Lottery])
async def read_user_lottery_published(id: str):
    """Read published lotteries created by a user."""

    if (user := user_db_handler.get_one(ObjectId(id))) is not None:
        logger.info(
            f"Successfully read user by id, proceed to retrieve published lotteries.")
        lotteries = lottery_db_handler.get_user_lottery_published(id)
        lotteries = [postprocess_lottery(lottery) for lottery in lotteries]

        logger.info(f"Successfully get published lotteries.")
        return lotteries

    logger.error(f"Failed to read published lotteries.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to read published lotteries of user {id}.")
