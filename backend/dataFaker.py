# Adding fake feedbackform data to the database.
from faker import Faker
import random
from pymongo import MongoClient

fake = Faker()
client = MongoClient('mongodb+srv://admin:ipEpayzmlAOB2Fah@maincluster.wx5fayx.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster')
db = client['test']
collection = db['feedbacks']

all_feedbacks = collection.find()
print(all_feedbacks)
feedbacks = []
for feedback in all_feedbacks:
    feedbacks.append(feedback)

print(feedbacks)