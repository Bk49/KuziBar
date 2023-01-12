from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from ..auth import Authenticator
from ..databases.ticket_db import Ticket_DB_handler
from ..databases.lottery_db import Lottery_DB_handler
from ..databases.item_db import Item_DB_handler
from ..log import Logger
from ..schemas import NewTicket, Ticket, OwnedItem
from ..lottery_spin import lottery
from datetime import date
from typing import List
from bson import ObjectId

# variables
authenticator = Authenticator()
ticket_db_handler = Ticket_DB_handler()
lottery_db_handler = Lottery_DB_handler()
item_db_handler = Item_DB_handler()

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


@router.get("/use_ticket", response_description="Use one ticket", response_model=OwnedItem)
async def use_ticket(lottery_id: str, user_id: str):
    if (ticket := ticket_db_handler.get_one(lottery_id, user_id)) is not None:
        logger.info(
            f"Successfully read ticket by lottery id and user id, proceed to use ticket.")
        prize = spin_lottery(lottery_id, user_id)
        logger.info(f"PRIZE IS {str(prize)}")
        item = item_db_handler.get_one(prize["_id"])

        # ticket - 1
        ticket_db_handler.use_ticket(lottery_id, user_id)

        logger.info(f"Successfully used ticket.")
        return item

    logger.error(f"Failed to get ticket.")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to use ticket of {user_id} on lottery {lottery_id}.")


def spin_lottery(lottery_id, user_id=None):
    while True:
        # spin lottery
        tier = lottery()

        if tier < 5:
            # check if can get from database
            prize = item_db_handler.get_item_by_tier_not_owned(lottery_id, tier)
        else:
            # random get some other tier
            prize = item_db_handler.get_low_tier(lottery_id)

        if prize:
            # update the prize
            item_id = prize["_id"]
            result = item_db_handler.update_prize(ObjectId(item_id), user_id)
            if not result:
                logger.error("Failed to update won prize.")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="Failed to update won prize.")
            
            # get the prize
            new_prize = item_db_handler.get_one(ObjectId(item_id))

            print(new_prize)
            return new_prize


def process_prize(item_id: str, user_id: str):
    """Post process prize."""
    # set owner_id
    return item_db_handler.update_prize(ObjectId(item_id), user_id)
