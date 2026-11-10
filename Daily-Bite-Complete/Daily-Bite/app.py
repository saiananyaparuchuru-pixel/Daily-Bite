
import re
import subprocess

import imageio_ffmpeg
from dotenv import load_dotenv
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    jsonify,
)

from gnani.tts import GnaniTTSClient, AudioConfig

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
    get_user_preferences,
)

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.secret_key = "dailybite-development-key"

# Gnani Timbre client
tts_client = GnaniTTSClient()


# --------------------------------------------------
# 1. Homepage and Personalized Meal Recommendations
# --------------------------------------------------

@app.route("/")
def home():
    browse_all = request.args.get("browse_all")

    if browse_all == "true":
        meals = get_filtered_meals()

        return render_template(
            "home.html",
            meals=meals,
            food_type="",
            category="",
            max_price="",
            recommendation_message="Explore all available meals!",
        )

    preferences = get_user_preferences()

    food_type = request.args.get("food_type", "")
    category = request.args.get("category", "")
    max_price_input = request.args.get("max_price", "")

    if not food_type:
        food_type = preferences["food_type"]

    if not max_price_input:
        max_price_input = preferences["max_price"]

    try:
        max_price = float(max_price_input) if max_price_input else None
    except (ValueError, TypeError):
        max_price = None

    allowed_categories = []

    if preferences["breakfast"]:
        allowed_categories.append("Breakfast")

    if preferences["lunch"]:
        allowed_categories.append("Lunch")

    if preferences["dinner"]:
        allowed_categories.append("Dinner")

    meals = get_filtered_meals(
        food_type=food_type or None,
        max_price=max_price,
        category=category or None,
        allowed_categories=allowed_categories,
    )

    selected_food = food_type if food_type else "All"

    if max_price is not None:
        recommendation_message = (
            f"Showing {selected_food} meals "
            f"within your budget of ₹{max_price:g}."
        )
    else:
        recommendation_message = f"Showing {selected_food} meals."

    return render_template(
        "home.html",
        meals=meals,
        food_type=food_type,
        category=category,
        max_price=max_price_input,
        recommendation_message=recommendation_message,
    )


# --------------------------------------------------
# 2. Weekly Meal Planner
# --------------------------------------------------

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
        daily_summary=daily_summary,
    )


# --------------------------------------------------
# 3. User Meal Preferences Page
# --------------------------------------------------

@app.route("/preferences")
def preferences():
    user_preferences = get_user_preferences()

    return render_template(
        "preferences.html",
        preferences=user_preferences,
    )


# --------------------------------------------------
# 4. Save User Meal Preferences
# --------------------------------------------------

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

        if food_type not in [
            "Vegetarian",
            "Non-Vegetarian",
            "Both",
        ]:
            raise ValueError

        if not any([breakfast, lunch, dinner]):
            flash(
                "Please select at least one meal category.",
                "danger",
            )
            return redirect(url_for("preferences"))

        save_user_preferences(
            food_type,
            max_price,
            breakfast,
            lunch,
            dinner,
        )

        flash(
            "Your meal preferences were saved successfully!",
            "success",
        )

    except (ValueError, TypeError):
        flash(
            "Please enter valid preference details.",
            "danger",
        )

    return redirect(url_for("preferences"))


# --------------------------------------------------
# 5. Save Meals in Weekly Planner
# --------------------------------------------------

@app.route("/save-plan", methods=["POST"])
def save_plan():
    day = request.form.get("day")
    category = request.form.get("category")
    meal_id = request.form.get("meal_id")

    valid_days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]

    valid_categories = [
        "Breakfast",
        "Lunch",
        "Dinner",
    ]

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

    flash(
        "Your meal plan was saved successfully!",
        "success",
    )

    return redirect(url_for("planner"))


# --------------------------------------------------
# 6. Update Weekly Budget
# --------------------------------------------------

@app.route("/save-budget", methods=["POST"])
def save_budget():
    try:
        amount = float(request.form.get("weekly_limit"))

        if amount <= 0:
            raise ValueError

        save_weekly_limit(amount)

        flash(
            "Weekly budget updated successfully!",
            "success",
        )

    except (ValueError, TypeError):
        flash(
            "Please enter a valid budget amount.",
            "danger",
        )

    return redirect(url_for("planner"))


# --------------------------------------------------
# 7. Helper: Extract Spoken or Numeric Budget
# --------------------------------------------------

def extract_budget(command):
    number_match = re.search(
        r"\b(?:under|below|less than|within|maximum|max|budget of)"
        r"\s*(?:₹|rs\.?\s*)?(\d+(?:\.\d+)?)",
        command,
    )

    if number_match:
        return float(number_match.group(1))

    spoken_amounts = {
        "two hundred and fifty": 250,
        "two hundred fifty": 250,
        "one hundred and fifty": 150,
        "one hundred fifty": 150,
        "one fifty": 150,
        "one hundred forty": 140,
        "one forty": 140,
        "one hundred thirty": 130,
        "one thirty": 130,
        "one hundred twenty": 120,
        "one twenty": 120,
        "three hundred": 300,
        "two hundred": 200,
        "one hundred": 100,
        "ninety": 90,
        "eighty": 80,
        "seventy": 70,
        "sixty": 60,
        "fifty": 50,
        "forty": 40,
        "thirty": 30,
        "twenty": 20,
        "ten": 10,
        "hundred": 100,
    }

    budget_keyword = re.search(
        r"\b(?:under|below|less than|within|maximum|max|budget of)\b",
        command,
    )

    if not budget_keyword:
        return None

    budget_text = command[budget_keyword.end():]

    budget_text = re.sub(
        r"\b(?:rupees?|rs\.?)\b",
        "",
        budget_text,
    ).strip()

    for words, amount in sorted(
        spoken_amounts.items(),
        key=lambda item: len(item[0]),
        reverse=True,
    ):
        if re.search(
            r"\b" + re.escape(words) + r"\b",
            budget_text,
        ):
            return float(amount)

    return None


# --------------------------------------------------
# 8. Gnani Prisma Voice Command + Timbre Voice Reply
# --------------------------------------------------

@app.route("/voice-command", methods=["POST"])
def voice_command():
    audio_file = request.files.get("audio")

    if not audio_file or not audio_file.filename:
        return jsonify({
            "success": False,
            "message": "No audio recording received.",
        }), 400

    try:
        from gnani.stt import GnaniSTTClient

        audio_bytes = audio_file.read()

        if not audio_bytes:
            return jsonify({
                "success": False,
                "message": "The audio recording is empty.",
            }), 400

        if len(audio_bytes) > 10 * 1024 * 1024:
            return jsonify({
                "success": False,
                "message": (
                    "Recording is too large. "
                    "Please record a shorter command."
                ),
            }), 413

        # Convert browser WebM audio into WAV.

        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

        conversion = subprocess.run(
            [
                ffmpeg_path,
                "-i", "pipe:0",
                "-vn",
                "-ac", "1",
                "-ar", "16000",
                "-f", "wav",
                "pipe:1",
            ],
            input=audio_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30,
        )

        if conversion.returncode != 0:
            raise RuntimeError(
                "Audio conversion failed: "
                + conversion.stderr.decode(
                    "utf-8",
                    errors="replace",
                )[-1000:]
            )

        wav_audio = conversion.stdout

        if not wav_audio:
            raise RuntimeError(
                "Audio conversion produced an empty WAV file."
            )

        # Send WAV audio to Gnani Prisma.

        stt_client = GnaniSTTClient()

        result = stt_client.transcribe_bytes(
            wav_audio,
            filename="voice-command.wav",
            language_code="en-IN",
            model="prisma-v3.0",
        )

        app.logger.info(
            "GNANI STT RESPONSE: %s",
            result,
        )

        transcript = result.get("transcript", "").strip()

        if not transcript:
            return jsonify({
                "success": False,
                "message": (
                    "I could not understand the recording. "
                    "Please try again."
                ),
            }), 400

        command = transcript.lower()

        # Identify food preference.

        food_type = None

        if (
            "non vegetarian" in command
            or "non-vegetarian" in command
            or "non veg" in command
        ):
            food_type = "Non-Vegetarian"

        elif (
            "vegetarian" in command
            or "veg " in command
            or command.startswith("veg")
        ):
            food_type = "Vegetarian"

        # Identify meal category.

        category = None

        if "breakfast" in command:
            category = "Breakfast"

        elif "lunch" in command:
            category = "Lunch"

        elif "dinner" in command:
            category = "Dinner"

        # Identify maximum price.

        max_price = extract_budget(command)

        # Apply saved preferences where details are missing.

        preferences = get_user_preferences()

        if food_type is None:
            food_type = preferences["food_type"]

        if max_price is None:
            max_price = float(preferences["max_price"])

        allowed_categories = None

        if category is None:
            allowed_categories = []

            if preferences["breakfast"]:
                allowed_categories.append("Breakfast")

            if preferences["lunch"]:
                allowed_categories.append("Lunch")

            if preferences["dinner"]:
                allowed_categories.append("Dinner")

        # Retrieve matching meals from SQLite.

        meals = get_filtered_meals(
            food_type=food_type or None,
            max_price=max_price,
            category=category,
            allowed_categories=allowed_categories,
        )

        meal_list = [
            dict(meal)
            for meal in meals
        ]

        # Create personalized voice response.

        if meal_list:
            meal_details = []

            for meal in meal_list:
                meal_details.append(
                    f"{meal['name']} costs {meal['price']:g} rupees"
                )

            meal_names = ", and ".join(meal_details)

            message = (
                f"Great! I found {len(meal_list)} "
                f"meals matching your request. "
                f"Here are your options: {meal_names}. "
                "Enjoy your meal!"
            )

        else:
            message = (
                "Sorry! I could not find meals matching "
                "your request. Try changing your food "
                "preference or budget."
            )

        # Generate spoken response using Gnani Timbre.

        audio_hex = None

        try:
            audio = tts_client.synthesize(
                message,
                voice="Kaveri",
                model="timbre-v2.5",
                language="en-IN",
                audio_config=AudioConfig(
                    container="mp3",
                    sample_rate=48000,
                    bitrate="128k",
                ),
            )

            audio_hex = audio.hex()

        except Exception:
            app.logger.exception(
                "Gnani Timbre audio generation failed"
            )

        # Send results and optional audio to browser.

        return jsonify({
            "success": True,
            "transcript": transcript,
            "filters": {
                "food_type": food_type,
                "category": category,
                "max_price": max_price,
            },
            "meals": meal_list,
            "message": message,
            "audio": audio_hex,
        })

    except Exception:
        app.logger.exception(
            "Gnani voice command failed"
        )

        return jsonify({
            "success": False,
            "message": (
                "Voice processing failed. "
                "Please try again."
            ),
        }), 500


# --------------------------------------------------
# 9. Start Flask Application
# --------------------------------------------------

if __name__ == "__main__":
    create_tables()
    insert_sample_meals()
    app.run(debug=True)
