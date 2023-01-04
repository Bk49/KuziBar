# logging
import logging
logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("uvicorn.error")

class Logger:
    def __init__(self, source: str) -> None:
        self.logger = logging.getLogger("uvicorn.error")
        self.source = source.upper()
    
    def info(self, logs: str):
        self.logger.info(f"[{self.source}] : {logs}")
    
    def warning(self, logs: str):
        self.logger.warning(f"[{self.source}] : {logs}")
    
    def error(self, logs: str):
        self.logger.error(f"[{self.source}] : {logs}")
    