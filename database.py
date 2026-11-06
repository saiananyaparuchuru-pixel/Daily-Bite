
import sqlite3

DATABASE = "dailybite.db"


# 1. Connect to SQLite database
def get_db_connection():

    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# 2. Create database tables
def create_tables():

    connection = get_db_connection()

    # Meals table
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

    # Weekly meal planner table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS weekly_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day TEXT NOT NULL,
            category TEXT NOT NULL,
            meal_id INTEGER NOT NULL,
            FOREIGN KEY (meal_id) REFERENCES meals(id),
            UNIQUE(day, category)
        )
    """)

    connection.commit()
    connection.close()


# 3. Insert sample meals
def insert_sample_meals():

    connection = get_db_connection()

    meals = [
        ("Veg Fried Rice", "Lunch", "Vegetarian", 60,
         "Rice with fresh vegetables"),

        ("Paneer Biryani", "Lunch", "Vegetarian", 100,
         "Spiced rice with paneer"),

        ("Chicken Biryani", "Lunch", "Non-Vegetarian", 120,
         "Traditional chicken biryani"),

        ("Masala Dosa", "Breakfast", "Vegetarian", 40,
         "Crispy dosa with potato filling"),

        ("Idli Sambar", "Breakfast", "Vegetarian", 30,
         "Soft idlis with sambar"),

        ("Egg Fried Rice", "Dinner", "Non-Vegetarian", 80,
         "Fried rice with eggs")
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


# 4. Retrieve all available meals
def get_all_meals():

    connection = get_db_connection()

    meals = connection.execute("""
        SELECT * FROM meals
        WHERE availability = 1
    """).fetchall()

    connection.close()

    return meals


# 5. Filter meals based on user preferences
def get_filtered_meals(
    food_type=None,
    max_price=None,
    category=None
):

    connection = get_db_connection()

    query = """
        SELECT * FROM meals
        WHERE availability = 1
    """

    parameters = []

    if food_type:
        query += " AND food_type = ?"
        parameters.append(food_type)

    if max_price is not None:
        query += " AND price <= ?"
        parameters.append(max_price)

    if category:
        query += " AND category = ?"
        parameters.append(category)

    meals = connection.execute(
        query, parameters
    ).fetchall()

    connection.close()

    return meals


# 6. Save a meal in the weekly planner
def save_meal_plan(day, category, meal_id):

    connection = get_db_connection()

    connection.execute("""
        INSERT INTO weekly_plans
        (day, category, meal_id)
        VALUES (?, ?, ?)

        ON CONFLICT(day, category)
        DO UPDATE SET meal_id = excluded.meal_id
    """, (day, category, meal_id))

    connection.commit()
    connection.close()


# 7. Retrieve the complete weekly meal plan
def get_weekly_plan():

    connection = get_db_connection()

    plans = connection.execute("""
        SELECT
            weekly_plans.day,
            weekly_plans.category,
            meals.id AS meal_id,
            meals.name,
            meals.price

        FROM weekly_plans

        JOIN meals
        ON weekly_plans.meal_id = meals.id

        ORDER BY
            CASE weekly_plans.day
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
            END,

            CASE weekly_plans.category
                WHEN 'Breakfast' THEN 1
                WHEN 'Lunch' THEN 2
                WHEN 'Dinner' THEN 3
            END
    """).fetchall()

    connection.close()

    return plans
