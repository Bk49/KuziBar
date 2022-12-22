# autehntication library
from passlib.context import CryptContext
from typing import Union
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.db import DB_handler

# Constants
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "d03854461d5fed07d0a11d3af088ee1b2af083cfa237d14f72fc05532b487e12"
ALGORITHM = "HS256"
db_handler = DB_handler()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class Authenticator:
    def __init__(self) -> None:
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_pw: str, hashed_pw: str):
        """Verify password."""
        return self.pwd_context.verify(plain_pw, hashed_pw)

    def get_password_hash(self, pw: str):
        """Get hashed password."""
        return self.pwd_context.hash(pw)

    def create_access_token(self, data: dict, expires_delta: Union[timedelta, None] = None):
        """Create access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    async def get_current_user(self, token: str = Depends(oauth2_scheme)):
        """Get current user using token."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception
        user = db_handler.get_user(token_data.email)
        if not user:
            raise credentials_exception
        return user

    
    def authenticate_user(self, email: str, password: str):
        """Authenticate the user using the email and password.

        Returns:
            bool: status of login
        """
        user = db_handler.get_user(email)
        if not user:
            return False
        if not self.verify_password(password, user["cust_password"]):
            return False
        return user
