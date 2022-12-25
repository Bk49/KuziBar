from pymongo import MongoClient

# MongoDB attributes
MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
PORT = 80


class DB_handler:
    def __init__(self) -> None:
        self.client = MongoClient(MONGODB_URL)
        self.db = self.client.mochi

    def user_exist(self, email: str) -> bool:
        """Validate if user exist."""
        return self.db.users.find_one({'user_email': email}) is not None

    def add_user(self, user: dict):
        """Insert a new user."""
        return self.db.users.insert_one(user)

    def get_user(self, email: str):
        """Get the user."""
        return self.db.users.find_one({'user_email': email})
    
    def get_user_by_id(self, id: str):
        """Get the user by id."""
        return self.db.users.find_one({"_id": id})

    def get_all_user(self):
        """Read all user."""
        return list(self.db["users"].find())

    def add_blacklist_token(self, token):
        """Insert a blacklisted token."""
        self.db.blacklist_token.insert_one({"token": token})
        return True

    def is_token_blacklisted(self, token):
        """Validate if token is blacklisted."""
        return self.db.blacklist_token.find_one({'token': token}) is not None

    def add_lottery(self, lottery: dict):
        """Insert a new lottery."""
        return self.db.lottery.insert_one(lottery)

    def get_lottery(self, id):
        """Get the lottery from id."""
        return self.db.lottery.find_one({"_id": id})

    def get_all_lottery(self):
        """Read all lottery."""
        return list(self.db.lottery.find())
    
    def add_item(self, item: dict):
        """Insert a new item."""
        return self.db.item.insert_one(item)
