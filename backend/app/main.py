from fastapi import FastAPI, Query, HTTPException

app = FastAPI()

users = {"john": "123456", "jane": "abcdef"}


async def authenticate_user(username: str, password: str):
    """Authenticate the user using the username and password.

    Returns:
        bool: status of login
    """
    if username not in users:
        raise HTTPException(
            status_code=401, detail="Incorrect username or password")
    if users[username] != password:
        raise HTTPException(
            status_code=401, detail="Incorrect username or password")
    return True


@app.post("/login")
async def login(username: str = Query(..., description="The username of the user"),
                password: str = Query(..., description="The password of the user")):
    """API entry point for login authentication.

    Returns:
        HTTPresponse: API response message
    """
    is_authenticated = await authenticate_user(username, password)
    if is_authenticated:
        return {"message": "Login successful"}
