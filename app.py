
from flask import Flask, render_template, request, redirect, url_for, flash

from database import (
    get_all_meals,
    get_filtered_meals,
    create_tables,
    insert_sample_meals,
    save_meal_plan,
    get_weekly_plan,
    get_weekly_budget,
    save_weekly_limit,
    get_weekly_limit,
    get_daily_summary,
    save_user_preferences,
    get_user_preferences
)

app = Flask(__name__)
app.secret_key = "dailybite-development-key"


# 1. Homepage and Personalized Meal Recommendations
@app.route("/")
def home():

    browse_all = request.args.get("browse_all")

    # Browse all available meals
    if browse_all == "true":

        meals = get_filtered_meals()

        return render_template(
            "home.html",
            meals=meals,
            food_type="",
            category="",
            max_price="",
            recommendation_message="Explore all available meals!"
        )

    # Get saved user preferences
    preferences = get_user_preferences()

    # Get manually selected filters
    food_type = request.args.get("food_type", "")
    category = request.args.get("category", "")
    max_price_input = request.args.get("max_price", "")

    # Apply saved preferences when filters are not selected
    if not food_type:
        food_type = preferences["food_type"]

    if not max_price_input:
        max_price_input = preferences["max_price"]

    try:
        max_price = float(max_price_input) if max_price_input else None
    except (ValueError, TypeError):
        max_price = None

    # Get allowed meal categories
    allowed_categories = []

    if preferences["breakfast"]:
        allowed_categories.append("Breakfast")

    if preferences["lunch"]:
        allowed_categories.append("Lunch")

    if preferences["dinner"]:
        allowed_categories.append("Dinner")

    # Retrieve personalized meals
    meals = get_filtered_meals(
        food_type=food_type or None,
        max_price=max_price,
        category=category or None,
        allowed_categories=allowed_categories
    )

    # Create recommendation message
    selected_food = food_type if food_type else "All"

    recommendation_message = (
        f"Showing {selected_food} meals "
        f"within your budget of ₹{max_price}."
    )

    return render_template(
        "home.html",
        meals=meals,
        food_type=food_type,
        category=category,
        max_price=max_price_input,
        recommendation_message=recommendation_message
    )


# 2. Weekly Meal Planner
@app.route("/planner")
def planner():

    meals = get_all_meals()
    plans = get_weekly_plan()

    weekly_budget = get_weekly_budget()
    weekly_limit = get_weekly_limit()

    daily_summary = get_daily_summary()

    remaining_budget = weekly_limit - weekly_budget

    return render_template(
        "planner.html",
        meals=meals,
        plans=plans,
        weekly_budget=weekly_budget,
        weekly_limit=weekly_limit,
        remaining_budget=remaining_budget,
        daily_summary=daily_summary
    )


# 3. User Meal Preferences Page
@app.route("/preferences")
def preferences():

    user_preferences = get_user_preferences()

    return render_template(
        "preferences.html",
        preferences=user_preferences
    )


# 4. Save User Meal Preferences
@app.route("/save-preferences", methods=["POST"])
def save_preferences():

    food_type = request.form.get("food_type")
    max_price = request.form.get("max_price")

    breakfast = 1 if request.form.get("breakfast") else 0
    lunch = 1 if request.form.get("lunch") else 0
    dinner = 1 if request.form.get("dinner") else 0

    try:
        max_price = float(max_price)

        if max_price <= 0:
            raise ValueError

        if food_type not in ["Vegetarian", "Non-Vegetarian", "Both"]:
            raise ValueError

        if not any([breakfast, lunch, dinner]):
            flash(
                "Please select at least one meal category.",
                "danger"
            )
            return redirect(url_for("preferences"))

        save_user_preferences(
            food_type,
            max_price,
            breakfast,
            lunch,
            dinner
        )

        flash(
            "Your meal preferences were saved successfully!",
            "success"
        )

    except (ValueError, TypeError):
        flash(
            "Please enter valid preference details.",
            "danger"
        )

    return redirect(url_for("preferences"))


# 5. Save Meals in Weekly Planner
@app.route("/save-plan", methods=["POST"])
def save_plan():

    day = request.form.get("day")
    category = request.form.get("category")
    meal_id = request.form.get("meal_id")

    valid_days = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    ]

    valid_categories = ["Breakfast", "Lunch", "Dinner"]

    try:
        meal_id = int(meal_id)

    except (ValueError, TypeError):
        flash("Please select a valid meal.", "danger")
        return redirect(url_for("planner"))

    if day not in valid_days or category not in valid_categories:
        flash("Invalid day or meal category.", "danger")
        return redirect(url_for("planner"))

    meals = get_all_meals()

    if not any(meal["id"] == meal_id for meal in meals):
        flash("Selected meal is unavailable.", "danger")
        return redirect(url_for("planner"))

    save_meal_plan(day, category, meal_id)

    flash("Your meal plan was saved successfully!", "success")

    return redirect(url_for("planner"))


# 6. Update Weekly Budget
@app.route("/save-budget", methods=["POST"])
def save_budget():

    try:
        amount = float(request.form.get("weekly_limit"))

        if amount <= 0:
            raise ValueError

        save_weekly_limit(amount)

        flash(
            "Weekly budget updated successfully!",
            "success"
        )

    except (ValueError, TypeError):
        flash(
            "Please enter a valid budget amount.",
            "danger"
        )

    return redirect(url_for("planner"))


# 7. Start Flask Application
if __name__ == "__main__":

    create_tables()
    insert_sample_meals()

    app.run(debug=True)

