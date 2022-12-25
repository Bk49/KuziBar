# autehntication library
from passlib.context import CryptContext
from typing import Union
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.db import DB_handler
from app.schemas import TokenData

# Constants
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "d03854461d5fed07d0a11d3af088ee1b2af083cfa237d14f72fc05532b487e12"
REFRESH_TOKEN_SECRET_KEY = "1562a01a1f4d4ff049643ca43a4ecfbfdc71f3fdea167b8543c28f202f5444d8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = 6000
db_handler = DB_handler()


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
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def create_refresh_token(self, data: dict, expires_delta: Union[timedelta, None] = None):
        """Create refresh token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    async def get_current_user(self, token: str = Depends(oauth2_scheme)):
        """Get current user using token."""
        # define exception
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials from access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

        # check if token is blacklisted
        if db_handler.is_token_blacklisted(token):
            raise credentials_exception

        # decode token and obtain user data
        try:
            payload = jwt.decode(
                token, SECRET_KEY, algorithms=ALGORITHM)
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception

        # retrieve user from db
        user = db_handler.get_user(token_data.email)
        if not user:
            raise credentials_exception

        return user

    async def refresh_current_user(self, refresh_token: str = Depends(oauth2_scheme)):
        """Use refresh token to generate a new access token."""
        # define exception
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials from refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

        # check if token is blacklisted
        if db_handler.is_token_blacklisted(refresh_token):
            raise credentials_exception

        # decode token and obtain user data
        try:
            payload = jwt.decode(
                refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
            if datetime.utcfromtimestamp(payload.get('exp')) > datetime.utcnow():
                email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception

        # validate if user exist
        if not db_handler.user_exist(token_data.email):
            raise credentials_exception

        # regenerate and return new access token
        return self.create_access_token({"sub": token_data.email})

    async def get_current_user_token(self, token: str = Depends(oauth2_scheme)):
        """Validate the token and return it."""
        _ = self.get_current_user(token)
        return token

    def authenticate_user(self, email: str, password: str):
        """Authenticate the user using the email and password.

        Returns:
            bool: status of login
        """
        user = db_handler.get_user(email)
        if not user:
            return False
        if not self.verify_password(password, user["user_password"]):
            return False
        return user
