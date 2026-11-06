
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


@app.route("/")
def home():

    food_type = request.args.get("food_type", "")
    category = request.args.get("category", "")
    max_price_input = request.args.get("max_price", "")

    try:
        max_price = float(max_price_input) if max_price_input else None
    except ValueError:
        max_price = None

    meals = get_filtered_meals(
        food_type=food_type or None,
        max_price=max_price,
        category=category or None
    )

    return render_template(
        "home.html",
        meals=meals,
        food_type=food_type,
        category=category,
        max_price=max_price_input
    )


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
    
@app.route("/preferences")
def preferences():

    user_preferences = get_user_preferences()

    return render_template(
        "preferences.html",
        preferences=user_preferences
    )
    
    
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
            flash("Please select at least one meal category.", "danger")
            return redirect(url_for("preferences"))

        save_user_preferences(
            food_type,
            max_price,
            breakfast,
            lunch,
            dinner
        )

        flash("Your meal preferences were saved successfully!", "success")

    except (ValueError, TypeError):
        flash("Please enter valid preference details.", "danger")

    return redirect(url_for("preferences"))

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


@app.route("/save-budget", methods=["POST"])
def save_budget():

    try:
        amount = float(request.form.get("weekly_limit"))

        if amount <= 0:
            raise ValueError

        save_weekly_limit(amount)

        flash("Weekly budget updated successfully!", "success")

    except (ValueError, TypeError):
        flash("Please enter a valid budget amount.", "danger")

    return redirect(url_for("planner"))


if __name__ == "__main__":

    create_tables()
    insert_sample_meals()

    app.run(debug=True)
