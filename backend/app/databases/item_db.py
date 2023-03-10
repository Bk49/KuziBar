from app.databases.db import DB_handler
from datetime import date, timedelta
from bson import ObjectId
# from ..schemas import SimpleItem
# import random


class Item_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.item

    # def get_item_by_tier(self, lottery_id: str, item_tier: int):
    #     """Get possible drops of a lottery."""
    #     item = self.get_item_by_tier_full(lottery_id, item_tier)
    #     if item:
    #         item = SimpleItem(
    #             id=item['_id'], image=item['image'], item_name=item['item_name'])
    #         return item
    #     else:
    #         return item

    def get_lottery_items(self, lottery_id: str):
        """Get all items of a lottery."""
        filter = {"lottery_id": lottery_id, "owner_id": None}

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
            "confirm_skin": False
        }

        return list(self.collection.find(filter))

    # def get_10_items(self, lottery_id: str):
    #     """Get top 10 items of a lottery."""
    #     # init item list
    #     item_list = []

    #     # get first 7
    #     for i in range(7):
    #         tier = i + 1
    #         pipeline = [{"$match": {"tier": tier, "lottery_id": lottery_id}}, {
    #             "$sample": {"size": 1}}]

    #         try:
    #             cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
    #             document = cursor.next()
    #             item_list.append(document)
    #         except StopIteration:
    #             pass

    #     # get the remaining items
    #     remaining = 10 - len(item_list)
    #     tier = 8

    #     # get the remaining items
    #     cursor = self.collection.find(
    #         {"tier": tier, "lottery_id": lottery_id})

    #     # Convert the cursor to a list
    #     documents = list(cursor)

    #     # If there are fewer than remaining documents, get all of them
    #     if len(documents) < remaining:
    #         random_documents = documents
    #     else:
    #         # Otherwise, choose random documents
    #         random_documents = random.sample(documents, remaining)

    #     # return the list
    #     item_list.extend(list(random_documents))
    #     return item_list

    def get_low_tier(self, lottery_id: str):
        """Get a random item that is not in high tier"""
        condition = [
            {"$match": {"lottery_id": lottery_id,
                        "$or": [{"owner_id": None}, {"owner_id": ""}],
                        "tier": {"$nin": [1, 2, 3, 4]}}},
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

    def get_item_by_tier_not_owned(self, lottery_id: str, item_tier: int):
        """Get high tier drop."""
        pipeline = [{"$match": {"tier": item_tier, "$or": [{"owner_id": None}, {"owner_id": ""}], "lottery_id": lottery_id}}, {
            "$sample": {"size": 1}}]

        try:
            cursor = self.collection.aggregate(pipeline, allowDiskUse=True)
            document = cursor.next()
            return document
        except StopIteration:
            return None

    def get_top_three(self, lottery_id: str):
        """Get top 3 items from a lottery."""
        filter = {"lottery_id": lottery_id}
        items = self.collection.find(filter).sort('tier').limit(3)
        return list(items)

    def get_top_ten(self, lottery_id: str):
        """Get top 10 items from a lottery."""
        filter = {"lottery_id": lottery_id}

        count = self.collection.count_documents(filter)
        limit = min(10, count)

        items = self.collection.find(filter).sort('tier').limit(limit)
        return list(items)

    def delete_lottery_item(self, lottery_id: str):
        """Delete all lottery item."""
        filter = {"lottery_id": lottery_id}

        self.collection.delete_many(filter)

        count = self.collection.count_documents(filter)
        if count == 0:
            return True
        else:
            raise False

    def update_prize(self, item_id: str, user_id: str):
        """Update won prize."""
        filter = {'_id': item_id}
        update = {'$set': {"confirm_skin": False, 'owner_id': user_id,
                           "date_to_finalize": str(date.today() + timedelta(days=30))}}

        result = self.collection.update_one(filter, update)
        if result.acknowledged:
            return True
        else:
            return False

    def select_skin(self, item_id: ObjectId, image_url: str):
        """Update selected skin."""
        document = self.collection.find_one({"_id": item_id,"skins.skin_image": image_url})
        try:
            ori_name = document["item_name"]
            for item in document["skins"]:
                if item["skin_image"] == image_url:
                    skin_name = item["skin_name"]
                    break
        except Exception:
            return False

        query = {'_id': item_id}
        update = {"$set": {"confirm_skin": True, "image": image_url, "item_name": ori_name + f" ({skin_name})"}}

        result = self.collection.update_one(query, update)
        if result.acknowledged:
            return True
        else:
            return False
