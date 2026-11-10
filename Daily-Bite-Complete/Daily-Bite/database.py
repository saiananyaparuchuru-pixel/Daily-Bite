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
            availability INTEGER DEFAULT 1,
            image_url TEXT
        )
    """)

    # Ensure image_url column exists if table existed previously without it
    cursor = connection.cursor()
    cursor.execute("PRAGMA table_info(meals)")
    columns = [col[1] for col in cursor.fetchall()]
    if "image_url" not in columns:
        connection.execute("ALTER TABLE meals ADD COLUMN image_url TEXT")

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

    # Weekly budget settings table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS budget_settings (
            id INTEGER PRIMARY KEY,
            weekly_limit REAL NOT NULL
        )
    """)

    # User meal preferences table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY,
            food_type TEXT DEFAULT 'Both',
            max_price REAL DEFAULT 200,
            breakfast INTEGER DEFAULT 1,
            lunch INTEGER DEFAULT 1,
            dinner INTEGER DEFAULT 1
        )
    """)

    connection.commit()
    connection.close()


# 3. Insert and update sample meals with high-res graphics and descriptions
def insert_sample_meals():
    connection = get_db_connection()

    sample_meals = [
        # id=1
        ("Veg Fried Rice", "Lunch", "Vegetarian", 60.0,
         "Wok-tossed long-grain basmati rice with crunchy garden vegetables, spring onions, and savory aromatics.",
         "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80"),

        # id=2
        ("Paneer Biryani", "Lunch", "Vegetarian", 100.0,
         "Royal aromatic basmati rice layered with marinated tender cottage cheese, saffron milk, and fried onions.",
         "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80"),

        # id=3
        ("Chicken Biryani", "Lunch", "Non-Vegetarian", 120.0,
         "Authentic slow-cooked dum biryani layered with succulent chicken pieces, caramelized onions, and fresh mint.",
         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"),

        # id=4
        ("Masala Dosa", "Breakfast", "Vegetarian", 40.0,
         "Crispy golden South Indian crepe stuffed with spiced potato masala, served with coconut chutney and sambar.",
         "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"),

        # id=5
        ("Idli Sambar", "Breakfast", "Vegetarian", 30.0,
         "Steamed soft, fluffy rice-lentil cakes served with steaming hot aromatic vegetable sambar and coconut chutney.",
         "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"),

        # id=6
        ("Egg Fried Rice", "Dinner", "Non-Vegetarian", 80.0,
         "Street-style wok-charred fried rice loaded with scrambled eggs, scallions, bell peppers, and mild pepper spices.",
         "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80"),

        # Additional delicious meals for full weekly planning
        ("Poha with Peanuts", "Breakfast", "Vegetarian", 35.0,
         "Light, savory flattened rice tempered with mustard seeds, curry leaves, roasted crunchy peanuts, and lemon.",
         "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80"),

        ("Egg Omelette & Toast", "Breakfast", "Non-Vegetarian", 50.0,
         "Double-egg masala omelette loaded with fresh herbs, bell peppers, and served with golden toasted butter bread.",
         "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80"),

        ("South Indian Thali", "Lunch", "Vegetarian", 90.0,
         "Grand traditional lunch feast with steamed rice, sambar, rasam, curd, veggie kootu, crispy papad, and sweet payasam.",
         "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=700&q=80"),

        ("Fish Curry & Rice", "Lunch", "Non-Vegetarian", 140.0,
         "Authentic coastal style fish simmered in tangy tamarind and spicy coconut gravy, served over steaming rice.",
         "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80"),

        ("Paneer Butter Masala", "Dinner", "Vegetarian", 110.0,
         "Melt-in-mouth cottage cheese cubes simmered in a velvety buttery tomato gravy, served with hot phulkas.",
         "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"),

        ("Dal Tadka & Jeera Rice", "Dinner", "Vegetarian", 70.0,
         "Comforting yellow lentils tempered with golden garlic, cumin seeds, and pure desi ghee with fragrant jeera rice.",
         "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80"),

        ("Butter Chicken & Naan", "Dinner", "Non-Vegetarian", 150.0,
         "Tender tandoori chicken simmered in rich makhani gravy with fenugreek and butter, paired with soft garlic naan.",
         "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80"),

        ("Grilled Chicken Bowl", "Dinner", "Non-Vegetarian", 130.0,
         "Juicy herb-seasoned grilled chicken breast over a bed of spiced brown rice and fresh sautéed garden greens.",
         "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=700&q=80"),
    ]

    for name, category, food_type, price, description, image_url in sample_meals:
        existing = connection.execute("SELECT id FROM meals WHERE name = ?", (name,)).fetchone()
        if existing:
            connection.execute("""
                UPDATE meals
                SET category = ?, food_type = ?, price = ?, description = ?, image_url = ?
                WHERE id = ?
            """, (category, food_type, price, description, image_url, existing["id"]))
        else:
            connection.execute("""
                INSERT INTO meals (name, category, food_type, price, description, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (name, category, food_type, price, description, image_url))

    connection.commit()
    connection.close()


# 4. Retrieve all available meals
def get_all_meals():
    connection = get_db_connection()
    meals = connection.execute("""
        SELECT * FROM meals
        WHERE availability = 1
        ORDER BY id ASC
    """).fetchall()
    connection.close()
    return meals


# 5. Filter meals based on user preferences
def get_filtered_meals(
    food_type=None,
    max_price=None,
    category=None,
    allowed_categories=None
):
    connection = get_db_connection()

    query = """
        SELECT * FROM meals
        WHERE availability = 1
    """
    parameters = []

    if food_type and food_type != "Both":
        query += " AND food_type = ?"
        parameters.append(food_type)

    if max_price is not None:
        query += " AND price <= ?"
        parameters.append(max_price)

    if category:
        query += " AND category = ?"
        parameters.append(category)

    if allowed_categories is not None:
        if not allowed_categories:
            connection.close()
            return []

        placeholders = ",".join(["?"] * len(allowed_categories))
        query += f" AND category IN ({placeholders})"
        parameters.extend(allowed_categories)

    query += " ORDER BY price ASC"

    meals = connection.execute(query, parameters).fetchall()
    connection.close()
    return meals


# 6. Save a meal in the weekly planner
def save_meal_plan(day, category, meal_id):
    connection = get_db_connection()
    connection.execute("""
        INSERT INTO weekly_plans (day, category, meal_id)
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
            meals.price,
            meals.food_type,
            meals.image_url
        FROM weekly_plans
        JOIN meals ON weekly_plans.meal_id = meals.id
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


def get_weekly_budget():
    connection = get_db_connection()
    result = connection.execute("""
        SELECT COALESCE(SUM(meals.price), 0) AS total
        FROM weekly_plans
        JOIN meals ON weekly_plans.meal_id = meals.id
    """).fetchone()
    connection.close()
    return result["total"]


# Save or update the user's weekly budget limit
def save_weekly_limit(amount):
    connection = get_db_connection()
    connection.execute("""
        INSERT INTO budget_settings (id, weekly_limit)
        VALUES (1, ?)
        ON CONFLICT(id)
        DO UPDATE SET weekly_limit = excluded.weekly_limit
    """, (amount,))
    connection.commit()
    connection.close()


# Retrieve the user's weekly budget limit
def get_weekly_limit():
    connection = get_db_connection()
    result = connection.execute("""
        SELECT weekly_limit
        FROM budget_settings
        WHERE id = 1
    """).fetchone()
    connection.close()
    if result:
        return result["weekly_limit"]
    return 2000.0


def get_daily_summary():
    connection = get_db_connection()
    summary = connection.execute("""
        SELECT
            day,
            COUNT(*) AS meal_count,
            SUM(meals.price) AS daily_total
        FROM weekly_plans
        JOIN meals ON weekly_plans.meal_id = meals.id
        GROUP BY day
        ORDER BY
            CASE day
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
            END
    """).fetchall()
    connection.close()
    return summary


# Save or update user meal preferences
def save_user_preferences(
    food_type,
    max_price,
    breakfast,
    lunch,
    dinner
):
    connection = get_db_connection()
    connection.execute("""
        INSERT INTO user_preferences
        (id, food_type, max_price, breakfast, lunch, dinner)
        VALUES (1, ?, ?, ?, ?, ?)
        ON CONFLICT(id)
        DO UPDATE SET
            food_type = excluded.food_type,
            max_price = excluded.max_price,
            breakfast = excluded.breakfast,
            lunch = excluded.lunch,
            dinner = excluded.dinner
    """, (
        food_type,
        max_price,
        breakfast,
        lunch,
        dinner
    ))
    connection.commit()
    connection.close()


# Retrieve user meal preferences
def get_user_preferences():
    connection = get_db_connection()
    preferences = connection.execute("""
        SELECT *
        FROM user_preferences
        WHERE id = 1
    """).fetchone()
    connection.close()

    if preferences:
        return preferences

    return {
        "food_type": "Both",
        "max_price": 200,
        "breakfast": 1,
        "lunch": 1,
        "dinner": 1
    }
