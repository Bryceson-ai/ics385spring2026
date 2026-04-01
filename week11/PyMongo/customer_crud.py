from pymongo import MongoClient
from pymongo.errors import CollectionInvalid, ConnectionFailure


def main() -> None:
    # Update this if your MongoDB server is not local.
    mongo_uri = "mongodb://localhost:27017/"
    db_name = "ics385_week11"
    collection_name = "Customer"

    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
    except ConnectionFailure as exc:
        print("Could not connect to MongoDB:", exc)
        return

    db = client[db_name]

    # 1) Create collection Customer.
    try:
        db.create_collection(collection_name)
        print("1) Created collection Customer")
    except CollectionInvalid:
        print("1) Collection Customer already exists")

    customer_collection = db[collection_name]

    # 2) Delete all records to clean up.
    delete_result = customer_collection.delete_many({})
    print(f"2) Deleted {delete_result.deleted_count} existing records")

    # 3) Insert 3 customer records.
    customers = [
        {
            "firstName": "Alice",
            "lastName": "Nguyen",
            "email": "alice.nguyen@example.com",
            "phone": "808-555-0101",
        },
        {
            "firstName": "Brian",
            "lastName": "Kaleo",
            "email": "brian.kaleo@example.com",
            "phone": "808-555-0102",
        },
        {
            "firstName": "Carla",
            "lastName": "Matsumoto",
            "email": "carla.matsumoto@example.com",
            "phone": "808-555-0103",
        },
    ]
    insert_result = customer_collection.insert_many(customers)
    print(f"3) Inserted {len(insert_result.inserted_ids)} customer records")

    # 4) Update one email and another phone number.
    email_update = customer_collection.update_one(
        {"firstName": "Alice", "lastName": "Nguyen"},
        {"$set": {"email": "alice.new@example.com"}},
    )
    phone_update = customer_collection.update_one(
        {"firstName": "Brian", "lastName": "Kaleo"},
        {"$set": {"phone": "808-555-9999"}},
    )
    print(
        "4) Updated records:",
        f"email matched={email_update.matched_count}, modified={email_update.modified_count};",
        f"phone matched={phone_update.matched_count}, modified={phone_update.modified_count}",
    )

    # 5) Query by last name and by first name.
    by_last_name = customer_collection.find_one({"lastName": "Matsumoto"}, {"_id": 0})
    by_first_name = customer_collection.find_one({"firstName": "Alice"}, {"_id": 0})
    print("5) Query by lastName='Matsumoto':", by_last_name)
    print("5) Query by firstName='Alice':", by_first_name)

    # 6) Drop Customer collection.
    customer_collection.drop()
    print("6) Dropped collection Customer")

    client.close()


if __name__ == "__main__":
    main()
