from app.databases.db import DB_handler

class User_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.users
    
    def get_user(self, email: str):
        """Get the user."""
        return self.collection.find_one({'user_email': email})
    
    def user_exist(self, email: str) -> bool:
        """Validate if user exist."""
        return self.db.users.find_one({'user_email': email}) is not None
    
    def get_creator_name(self, user_id: str):
        """Get the creator name of a lottery."""
        result = self.collection.find_one({'_id': user_id})
        return result["user_name"]