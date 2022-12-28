from app.databases.db import DB_handler
from ..schemas import SimpleItem

class Item_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.item
    
    def get_item_by_tier(self, lottery_id: str, item_tier: int):
        """Get possible drops of a lottery."""
        pipeline = [{"$match": {"tier": item_tier, "lottery_id": lottery_id}}, {"$sample": {"size": 1}}]

        try:
            cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
            document = cursor.next()
            item = SimpleItem(image=document['image'], item_name=document['item_name'])
            return item
        except StopIteration:
            return None
    
    def get_lottery_items(self, lottery_id: str):
        """Get all items of a lottery."""
        filter = {"lottery_id": lottery_id}

        return list(self.collection.find(filter))

    
    