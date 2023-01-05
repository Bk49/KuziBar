from app.databases.db import DB_handler
from ..schemas import SimpleItem
import random


class Item_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.item

    def get_item_by_tier(self, lottery_id: str, item_tier: int):
        """Get possible drops of a lottery."""
        pipeline = [{"$match": {"tier": item_tier, "lottery_id": lottery_id}}, {
            "$sample": {"size": 1}}]

        try:
            cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
            document = cursor.next()
            item = SimpleItem(
                id=document['_id'], image=document['image'], item_name=document['item_name'])
            return item
        except StopIteration:
            return None

    def get_lottery_items(self, lottery_id: str):
        """Get all items of a lottery."""
        filter = {"lottery_id": lottery_id}

        return list(self.collection.find(filter))

    def get_owned_items(self, user_id: str):
        """Get all items of a user."""
        filter = {"owner_id": user_id}

        return list(self.collection.find(filter))

    def get_customizable_items(self, user_id: str):
        """Get customizable items of a user."""
        filter = {
            "owner_id": user_id,
            "skin": {"$ne": []},
            "date_to_finalize": None
        }

        return list(self.collection.find(filter))

    def get_10_items(self, lottery_id: str):
        """Get top 10 items of a lottery."""
        # init item list
        item_list = []

        # get first 7
        for i in range(7):
            tier = i + 1
            pipeline = [{"$match": {"tier": tier, "lottery_id": lottery_id}}, {
                "$sample": {"size": 1}}]

            try:
                cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
                document = cursor.next()
                item_list.append(document)
            except StopIteration:
                pass

        # get the remaining items
        remaining = 10 - len(item_list)
        tier = 8

        # get the remaining items
        cursor = self.collection.find(
            {"tier": tier, "lottery_id": lottery_id})

        # Convert the cursor to a list
        documents = list(cursor)

        # If there are fewer than remaining documents, get all of them
        if len(documents) < remaining:
            random_documents = documents
        else:
            # Otherwise, choose random documents
            random_documents = random.sample(documents, remaining)

        # return the list
        item_list.extend(list(random_documents))
        return item_list


    def get_low_tier(self, lottery_id: str):
        """Get a random item that is not in high tier"""
        condition = [
            {"$match": {"lottery_id": lottery_id, "tier": {"$nin": [1, 2, 3, 4]}}},
            {"$sample": {"size": 1}}
        ]
        try:
            cursor = self.collection.aggregate(condition, allowDiskUse=True)
            document = cursor.next()
        except StopIteration:
            return None
        
        return document
    
    def get_item_by_tier_full(self, lottery_id: str, item_tier: int):
        """Get possible drops of a lottery."""
        pipeline = [{"$match": {"tier": item_tier, "lottery_id": lottery_id}}, {
            "$sample": {"size": 1}}]

        try:
            cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
            document = cursor.next()
            return document
        except StopIteration:
            return None
