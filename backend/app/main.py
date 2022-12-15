from fastapi import FastAPI, Query, HTTPException
from bson import ObjectId
from schematics.models import Model
from schematics.types import StringType, EmailType
from pymongo import MongoClient
import app.settings as settings

client = MongoClient(settings.mongodb_uri, settings.port)
db = client.testingdata

class Customer(Model):
    cust_id = ObjectId()
    cust_email = EmailType(required=True)
    cust_name = StringType(required=True)

# an instance of User
newuser = Customer()

# function to create user
def create_user(email, username):
    newuser.custid = ObjectId()
    newuser.cust_email = email
    newuser.cust_name = username
    return dict(newuser)

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


@app.get("/")
def hello_world():
    return {"message": "Hello, world!"}


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


@app.post("/signup/{email}/{username}")
def add_user(email, username: str):
    user_exist = False
    data = create_user(email, username)

    # convert data to dict
    dict(data)

    # check if email exist already
    if len(list(db.users.find(
        {'email': data['cust_email']}
        ))) > 0:
        user_exist = True
        print("Customer exists")
        return {"message" : "Customer exists"}
    elif user_exist == False:
        db.users.insert_one(data)
        return {"message" : "User created", "email" : data['cust_email'], "name" : data['cust_name']}