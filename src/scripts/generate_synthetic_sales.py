# generate_synthetic_sales.py

import os
import random
import uuid
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Constants
MONGODB_URI = os.getenv("DATABASE_URL")
DATABASE_NAME = "WattWallet"  # Replace with your actual database name

# Define admin user ID
ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"  # Replace with your actual admin user ID

# Sender and Receiver IDs
SENDER_ID = "system"

# Generate random user IDs
def generate_user_ids(n):
    return [f"user_{i}" for i in range(1, n + 1)]

RECEIVER_IDS = generate_user_ids(50)  # Generate 50 random users

def main():
    # Connect to MongoDB
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]

    # Fetch all products
    Product = db["Product"]
    products = list(Product.find({}))

    if not products:
        print("No products found in the database. Please ensure products are added first.")
        return

    product_ids = [product["_id"] for product in products]
    product_prices = {str(product["_id"]): product["price"] for product in products}
    product_names = {str(product["_id"]): product["name"] for product in products}

    # Generate 500 synthetic 'Purchase' transactions
    transactions_collection = db["Transaction"]

    synthetic_transactions = []
    for _ in range(500):
        product_id = random.choice(product_ids)
        transaction = {
            "transactionId": str(uuid.uuid4()),
            "senderId": SENDER_ID,
            "receiverId": random.choice(RECEIVER_IDS),
            "productId": product_id,
            "type": "Purchase",
            "amount": product_prices[str(product_id)],
        }
        synthetic_transactions.append(transaction)

    # Insert synthetic transactions into the database
    if synthetic_transactions:
        transactions_collection.insert_many(synthetic_transactions)
        print(f"Inserted {len(synthetic_transactions)} synthetic 'Purchase' transactions.")
    else:
        print("No synthetic transactions to insert.")

    client.close()

if __name__ == "__main__":
    main()
