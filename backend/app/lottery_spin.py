import random
import pymongo

def lottery(dr1=2, dr2=5, dr3=10, dr4=10) -> int:
    """
    Spin the lottery and output the prize.

    Args:
        dr1 (int, optional): drop rate of tier 1. Defaults to 2.
        dr2 (int, optional): drop rate of tier 2. Defaults to 5.
        dr3 (int, optional): drop rate of tier 3. Defaults to 10.
        dr4 (int, optional): drop rate of tier 4. Defaults to 10.

    Returns:
        int: the tier of the prize
    """
    num = random.random()
    num *= 100

    if num < dr1:
        return 1
    elif num < (dr1 + dr2):
        return 2
    elif num < (dr1 + dr2 + dr3):
        return 3
    elif num < (dr1 + dr2 + dr3 + dr4):
        return 4
    else:
        return 5


# testing
# while True:
#     ans = lottery()
#     print(ans)
#     if ans == 1:
#         break

# Connect to the MongoDB client
MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
client = pymongo.MongoClient(MONGODB_URL)

# Select the database and collection
db = client["mochi"]
coll = db["item"]

def get_low_tier(lottery_id: str):
    """Get a random item that is not in high tier"""
    condition = [
        {"$match": {"lottery_id": lottery_id, "tier": {"$nin": [1, 2, 3, 4]}}},
        {"$sample": {"size": 1}}
    ]
    try:
        cursor = coll.aggregate(condition, allowDiskUse=True)
        document = cursor.next()
    except StopIteration:
        return None
    
    return document

def get_item_by_tier(lottery_id: str, item_tier: int):
        """Get possible drops of a lottery."""
        pipeline = [{"$match": {"tier": item_tier, "lottery_id": lottery_id}}, {
            "$sample": {"size": 1}}]

        try:
            cursor = coll.aggregate(pipeline, allowDiskUse=True)
            document = cursor.next()
            return document
        except StopIteration:
            return None

def spin_lottery(lottery_id, user_id = None):
    while True:
        # spin lottery
        tier = lottery()

        if tier < 5:
            # check if can get from database
            prize = get_item_by_tier(lottery_id, tier)
            if prize:
                # TODO: change the owner
                print(prize)
                return prize
        else:
            # random get some other tier
            prize = get_low_tier(lottery_id)
            print(prize)
            return prize


lottery_id = "63ac3532c1ad9cfb18b75075"
spin_lottery(lottery_id)
