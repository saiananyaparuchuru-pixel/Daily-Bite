import sqlite3

DATABASE = "dailybite.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            food_type TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            availability INTEGER DEFAULT 1
        )
    """)


def insert_sample_meals():

    connection = get_db_connection()

    meals = [
        ("Veg Fried Rice", "Lunch", "Vegetarian", 60, "Rice with fresh vegetables"),
        ("Paneer Biryani", "Lunch", "Vegetarian", 100, "Spiced rice with paneer"),
        ("Chicken Biryani", "Lunch", "Non-Vegetarian", 120, "Traditional chicken biryani"),
        ("Masala Dosa", "Breakfast", "Vegetarian", 40, "Crispy dosa with potato filling"),
        ("Idli Sambar", "Breakfast", "Vegetarian", 30, "Soft idlis with sambar"),
        ("Egg Fried Rice", "Dinner", "Non-Vegetarian", 80, "Fried rice with eggs")
    ]

    count = connection.execute(
        "SELECT COUNT(*) FROM meals"
    ).fetchone()[0]

    if count == 0:
        connection.executemany("""
            INSERT INTO meals
            (name, category, food_type, price, description)
            VALUES (?, ?, ?, ?, ?)
        """, meals)

    connection.commit()
    connection.close()