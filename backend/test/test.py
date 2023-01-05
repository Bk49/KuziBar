import pymongo


# Connect to the MongoDB client
MONGODB_URL = "mongodb+srv://yungxin:yungxinpassword@mochi.j3njxdv.mongodb.net/mochi?retryWrites=true&w=majority"
client = pymongo.MongoClient(MONGODB_URL)

# Select the database and collection
db = client["mochi"]
coll = db["item"]

# Specify the condition for available prizes (status is null)
lottery_id = "63ac3532c1ad9cfb18b75075"
condition = {"owner": {"$eq": None}, "lottery_id": lottery_id}

# Use the $group operator to group the documents by tier
# and use the $sum operator to count the number of available prizes in each tier
pipeline = [
    {"$match": condition},
    {"$group": {"_id": "$tier", "count": {"$sum": 1}}}
]

# Execute the aggregation pipeline
results = list(coll.aggregate(pipeline))

# Print the results
print(results)