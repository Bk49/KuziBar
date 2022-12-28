from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from ..auth import Authenticator
from ..databases.user_db import User_DB_handler
from ..databases.ticket_db import Ticket_DB_handler
from ..databases.lottery_db import Lottery_DB_handler
from ..log import Logger
from ..schemas import User, NewTicket, Ticket
from typing import List
from datetime import date

# variables
authenticator = Authenticator()
user_db_handler = User_DB_handler()
ticket_db_handler = Ticket_DB_handler()
lottery_db_handler = Lottery_DB_handler()
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


@router.post("/{id}/buy", response_model=Ticket)
def create_ticket(new_ticket: NewTicket):
    """Create a ticket."""
    new_ticket = jsonable_encoder(new_ticket)

    # check if tickets are available
    if lottery_db_handler.get_remaining_tickets(new_ticket['lottery_id']) < new_ticket['entry_quantity']:
        logger.error("Number of tickets purchased is larger than remaining tickets.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Number of tickets purchased is larger than remaining tickets!")


    if (ticket := ticket_db_handler.get_one(new_ticket['lottery_id'], new_ticket['user_id'])) is not None:
        # increase quantity of existing ticket
        logger.info(f"Ticket exists, increase entry quantity.")
        updated_ticket = ticket_db_handler.update_quantity(new_ticket['lottery_id'], new_ticket['user_id'], new_ticket['entry_quantity'])
        logger.info("Successfully updated existing ticket.")
    else:
        # create new ticket
        logger.info(f"Ticket does not exists, create new ticket.")
        new_ticket['date_created'] = str(date.today())
        ticket = ticket_db_handler.add_one(new_ticket)
        updated_ticket = ticket_db_handler.get_one(new_ticket['lottery_id'], new_ticket['user_id'])

        logger.info(f"Successfully created new ticket, id: {str(ticket.inserted_id)}")
    
    # decrease number of remaining tickets in lottery
    lottery_db_handler.update_remaining_tickets(new_ticket['lottery_id'], new_ticket['entry_quantity'])
    logger.info(f"Successfully updated remaining tickets in lottery, id: {new_ticket['lottery_id']}")
    
    return updated_ticket