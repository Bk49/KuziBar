from app.databases.db import DB_handler
from bson import ObjectId


class Lottery_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.lottery
    
    def get_published_lottery(self):
        """Get all published lotteries."""
        return list(self.collection.find({'status': 1}))

    def get_remaining_tickets(self, id: str):
        lottery = self.get_one(ObjectId(id))
        return lottery['remaining_tickets']

    def update_remaining_tickets(self, id: str, quantity: int):
        # Define the query and update
        query = {'_id': ObjectId(id)}
        update = {'$inc': {'remaining_tickets': -quantity}}

        # Update the document
        return self.collection.update_one(query, update)
    
    def get_user_lottery(self, user_id: str):
        """Get the lotteries by user_id."""
        return self.collection.find({'creator_id': user_id})
    
    def get_user_lottery_published(self, user_id: str):
        """Get the published lotteries by user_id."""
        return self.collection.find({'creator_id': user_id, 'status': 1})
    
    def get_user_lottery_drafts(self, user_id: str):
        """Get the drafted lotteries by user_id."""
        return self.collection.find({'creator_id': user_id, 'status': 0})

    def delete_lottery(self, lottery_id: str):
        """Delete a lottery."""
        result = self.collection.delete_one({'_id': lottery_id})
        if result.deleted_count == 0:
            return False
        else:
            return True

    def get_creator_id(self, lottery_id: str):
        """Get the creator id of a lottery."""
        result = self.collection.find_one({'_id': lottery_id})
        return result["creator_id"]
    
    
