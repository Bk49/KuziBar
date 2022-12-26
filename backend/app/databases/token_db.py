from app.databases.db import DB_handler

class Token_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.blacklist_token

    def is_token_blacklisted(self, token):
        """Validate if token is blacklisted."""
        return self.db.blacklist_token.find_one({'token': token}) is not None