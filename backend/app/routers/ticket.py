from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from ..auth import Authenticator
from ..databases.ticket_db import Ticket_DB_handler
from ..databases.lottery_db import Lottery_DB_handler
from ..log import Logger
from ..schemas import NewTicket, Ticket
from datetime import date
from typing import List

# variables
authenticator = Authenticator()
ticket_db_handler = Ticket_DB_handler()
lottery_db_handler = Lottery_DB_handler()
logger = Logger("ticket")

# router definition
router = APIRouter(
    prefix="/ticket",
    tags=["ticket"],
    dependencies=[Depends(authenticator.get_current_user)],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_description="Create a ticket", response_model=Ticket)
def create_ticket(new_ticket: NewTicket):
    """Create a ticket."""
    new_ticket = jsonable_encoder(new_ticket)

    # check if tickets are available
    if lottery_db_handler.get_remaining_tickets(new_ticket['lottery_id']) < new_ticket['entry_quantity']:
        logger.error(
            "Number of tickets purchased is larger than remaining tickets.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Number of tickets purchased is larger than remaining tickets!")

    if (ticket := ticket_db_handler.get_one(new_ticket['lottery_id'], new_ticket['user_id'])) is not None:
        # increase quantity of existing ticket
        logger.info(f"Ticket exists, increase entry quantity.")
        ticket_db_handler.update_quantity(
            new_ticket['lottery_id'], new_ticket['user_id'], new_ticket['entry_quantity'])
        updated_ticket = ticket_db_handler.get_one(
            new_ticket['lottery_id'], new_ticket['user_id'])
        logger.info("Successfully updated existing ticket.")
    else:
        # create new ticket
        logger.info(f"Ticket does not exists, create new ticket.")
        new_ticket['date_created'] = str(date.today())
        ticket = ticket_db_handler.add_one(new_ticket)
        updated_ticket = ticket_db_handler.get_one(
            new_ticket['lottery_id'], new_ticket['user_id'])

        logger.info(
            f"Successfully created new ticket, id: {str(ticket.inserted_id)}")

    # decrease number of remaining tickets in lottery
    lottery_db_handler.update_remaining_tickets(
        new_ticket['lottery_id'], new_ticket['entry_quantity'])
    logger.info(
        f"Successfully updated remaining tickets in lottery, id: {new_ticket['lottery_id']}")

    return updated_ticket


@router.get("/", response_description="List all tickets", response_model=List[Ticket])
async def read_tickets():
    """Read all tickets."""
    tickets = ticket_db_handler.get_all()
    logger.info(f"Successfully read all tickets.")
    return tickets
