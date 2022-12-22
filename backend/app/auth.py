# autehntication library
from passlib.context import CryptContext


class Authenticator:
    def __init__(self) -> None:
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_pw: str, hashed_pw: str):
        """Verify password."""
        return self.pwd_context.verify(plain_pw, hashed_pw)


    def get_password_hash(self, pw: str):
        """Get hashed password."""
        return self.pwd_context.hash(pw)
