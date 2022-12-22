from bson import ObjectId
from schematics.models import Model
from schematics.types import StringType, EmailType
from pymongo import MongoClient

# MongoDB attributes
MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
PORT = 80


class Customer(Model):
    """User class on MongoDB."""
    cust_id = ObjectId()
    cust_email = EmailType(required=True)
    cust_name = StringType(required=True)
    cust_password = StringType(required=True)


class DB_handler:
    def __init__(self) -> None:
        self.client = MongoClient(MONGODB_URL, PORT)
        self.db = self.client.mochi

    def user_exist(self, email: str) -> bool:
        """Validate if user exist."""
        return self.db.users.find_one({'cust_email': email}) is not None

    def add_user(self, user: dict):
        """Insert a new user."""
        self.db.users.insert_one(user)
    
    def get_user(self, email: str):
        """Get the user."""
        return self.db.users.find_one({'cust_email': email})

    def get_all_user(self):
        """Read all user."""
        list_of_users = []
        for user in self.db.users.find():
            list_of_users.append(user)
        return list_of_users
