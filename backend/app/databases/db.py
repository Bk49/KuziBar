from pymongo import MongoClient


class DB_handler:
    MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
    PORT = 80

    def __init__(self) -> None:
        self.client = MongoClient(self.MONGODB_URL)
        self.db = self.client.mochi
        self.collection = None

    def add_one(self, new_entry: dict):
        """Insert a new entry."""
        return self.collection.insert_one(new_entry)

    def get_one(self, id: str):
        """Get the entry by id."""
        return self.collection.find_one({"_id": id})

    def get_all(self):
        """Read all entries."""
        return list(self.collection.find())
