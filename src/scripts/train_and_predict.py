# train_and_predict_sales.py

import os
import random
from collections import Counter
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Constants
MONGODB_URI = os.getenv("DATABASE_URL")
DATABASE_NAME = "WattWallet"  # Replace with your actual database name

# Define admin user ID
ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"  # Replace with your actual admin user ID

def main():
    # Connect to MongoDB
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]

    # Fetch last 100 'Purchase' transactions
    transactions_collection = db["Transaction"]
    last_100_transactions = list(
        transactions_collection.find({"type": "Purchase"})
        .sort("_id", -1)
        .limit(100)
    )

    if not last_100_transactions:
        print("No 'Purchase' transactions found.")
        return

    # Count sales per product
    product_sales = [str(tx["productId"]) for tx in last_100_transactions]
    sales_counter = Counter(product_sales)

    # Calculate total sales
    total_sales = sum(sales_counter.values())

    # Calculate probability distribution
    product_probabilities = {
        product_id: count / total_sales for product_id, count in sales_counter.items()
    }

    # Predict next 100 sales based on historical distribution
    predicted_sales = Counter()
    product_ids = list(product_probabilities.keys())
    probabilities = list(product_probabilities.values())

    for _ in range(100):
        chosen_product = random.choices(product_ids, weights=probabilities, k=1)[0]
        predicted_sales[chosen_product] += 1

    # Fetch product names
    products_collection = db["Product"]
    products = list(products_collection.find({"_id": {"$in": list(predicted_sales.keys())}}))
    product_names = {str(product["_id"]): product["name"] for product in products}

    # Prepare predictions
    predictions_collection = db["SalesPrediction"]
    predictions = []
    for product_id, sales_count in predicted_sales.items():
        prediction = {
            "productId": product_id,
            "productName": product_names.get(product_id, "Unknown Product"),
            "predictedSales": sales_count,
        }
        predictions.append(prediction)

    # Insert predictions into the database
    if predictions:
        # Optionally, clear existing predictions before inserting new ones
        predictions_collection.delete_many({})
        predictions_collection.insert_many(predictions)
        print(f"Inserted {len(predictions)} sales predictions.")
    else:
        print("No predictions to insert.")

    client.close()

if __name__ == "__main__":
    main()
