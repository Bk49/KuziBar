from pymongo import MongoClient
from app.schemas import Customer

# MongoDB attributes
MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
PORT = 80


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

    def add_blacklist_token(self, token):
        """Insert a blacklisted token."""
        self.db.blacklist_token.insert_one({"token": token})
        return True

    def is_token_blacklisted(self, token):
        """Validate if token is blacklisted."""
        return self.db.blacklist_token.find_one({'token': token}) is not None
