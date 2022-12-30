from app.databases.db import DB_handler
from bson import ObjectId


class Lottery_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.lottery

    def get_remaining_tickets(self, id: str):
        lottery = self.get_one(ObjectId(id))
        return lottery['remaining_tickets']

    def update_remaining_tickets(self, id: str, quantity: int):
        # Define the query and update
        query = {'_id': ObjectId(id)}
        update = {'$inc': {'remaining_tickets': -quantity}}

        # Update the document
        return self.collection.update_one(query, update)
    
    
