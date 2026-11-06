
from flask import Flask, render_template, request
from database import (
    get_all_meals,
    get_filtered_meals,
    create_tables,
    insert_sample_meals
)

app = Flask(__name__)


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


if __name__ == "__main__":

    create_tables()
    insert_sample_meals()

    app.run(debug=True)
