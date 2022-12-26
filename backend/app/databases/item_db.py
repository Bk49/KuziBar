from app.databases.db import DB_handler

class Item_DB_handler(DB_handler):
    def __init__(self) -> None:
        super().__init__()
        self.collection = self.db.item
    