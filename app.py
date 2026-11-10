
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
    create_order,
    get_all_orders,
    get_order_by_id,
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

def process_voice_transcript(transcript):
    """
    Core NLP and recommendation engine for voice commands:
    Parses spoken query, extracts dietary preferences and budget,
    retrieves matching meals, and synthesizes a spoken voice reply with Gnani Timbre.
    """
    command = transcript.lower().strip()

    # Identify food preference
    food_type = None
    if (
        'non vegetarian' in command
        or 'non-vegetarian' in command
        or 'non veg' in command
        or 'non-veg' in command
        or 'chicken' in command
        or 'egg' in command
        or 'mutton' in command
        or 'fish' in command
    ):
        food_type = 'Non-Vegetarian'
    elif (
        'vegetarian' in command
        or 'veg ' in command
        or 'pure veg' in command
        or command.startswith('veg')
        or 'paneer' in command
        or 'dosa' in command
        or 'idli' in command
        or 'poha' in command
    ):
        food_type = 'Vegetarian'

    # Identify meal category
    category = None
    if 'breakfast' in command or 'tiffin' in command:
        category = 'Breakfast'
    elif 'lunch' in command or 'thali' in command or 'biryani' in command:
        category = 'Lunch'
    elif 'dinner' in command or 'night' in command:
        category = 'Dinner'

    # Check for direct dish name match
    all_known_meals = get_all_meals()
    specific_dish = None
    for m in all_known_meals:
        if m['name'].lower() in command:
            specific_dish = m['name']
            break

    # Identify maximum price
    max_price = extract_budget(command)

    # Apply saved preferences where details are missing
    preferences = get_user_preferences()

    if food_type is None and not specific_dish:
        food_type = preferences['food_type']

    if max_price is None and not specific_dish:
        max_price = float(preferences['max_price'])

    allowed_categories = None
    if category is None and not specific_dish:
        allowed_categories = []
        if preferences['breakfast']:
            allowed_categories.append('Breakfast')
        if preferences['lunch']:
            allowed_categories.append('Lunch')
        if preferences['dinner']:
            allowed_categories.append('Dinner')

    # If specific dish requested, return that dish first
    if specific_dish:
        meal_list = [dict(m) for m in all_known_meals if specific_dish.lower() in m['name'].lower()]
    else:
        meals = get_filtered_meals(
            food_type=food_type or None,
            max_price=max_price,
            category=category,
            allowed_categories=allowed_categories,
        )
        meal_list = [dict(meal) for meal in meals]

    # Create personalized voice response
    if meal_list:
        meal_details = []
        for meal in meal_list[:3]:
            meal_details.append(f"{meal['name']} for {meal['price']:g} rupees")
        meal_names = ', and '.join(meal_details)

        plural = 's' if len(meal_list) != 1 else ''
        message = (
            f"Great! I found {len(meal_list)} delicious option{plural}. "
            f"Here is {meal_names}. Enjoy your meal!"
        )
    else:
        message = (
            "I could not find meals matching that exact request. "
            "Showing all our popular recommendations instead!"
        )
        meal_list = [dict(m) for m in get_all_meals()[:4]]

    # Generate spoken voice reply using Gnani Timbre
    audio_hex = None
    try:
        audio = tts_client.synthesize(
            message,
            voice='Kaveri',
            model='timbre-v2.5',
            language='en-IN',
            audio_config=AudioConfig(
                container='mp3',
                sample_rate=48000,
                bitrate='128k',
            ),
        )
        audio_hex = audio.hex()
    except Exception:
        app.logger.exception('Gnani Timbre audio generation failed')

    return jsonify({
        'success': True,
        'transcript': transcript,
        'filters': {
            'food_type': food_type,
            'category': category,
            'max_price': max_price,
        },
        'meals': meal_list,
        'message': message,
        'audio': audio_hex,
    })


@app.route('/voice-query', methods=['POST'])
def voice_query():
    """Text-based voice query endpoint (direct speech transcript or quick chips)."""
    data = request.get_json() if request.is_json else request.form.to_dict()
    transcript = (data.get('transcript') or '').strip()
    if not transcript:
        return jsonify({'success': False, 'message': 'Please say or enter a meal query.'}), 400
    return process_voice_transcript(transcript)


@app.route('/voice-command', methods=['POST'])
def voice_command():
    """Audio recording upload endpoint (with JSON transcript fallback)."""
    # 1. Handle JSON transcript if submitted
    if request.is_json:
        data = request.get_json() or {}
        transcript = data.get('transcript', '').strip()
        if transcript:
            return process_voice_transcript(transcript)

    # 2. Handle audio file
    audio_file = request.files.get('audio')
    if not audio_file or not audio_file.filename:
        text_query = request.form.get('transcript', '').strip()
        if text_query:
            return process_voice_transcript(text_query)
        return jsonify({
            'success': False,
            'message': 'No audio recording or speech text received.',
        }), 400

    try:
        from gnani.stt import GnaniSTTClient

        audio_bytes = audio_file.read()
        if not audio_bytes:
            return jsonify({
                'success': False,
                'message': 'The audio recording is empty.',
            }), 400

        if len(audio_bytes) > 10 * 1024 * 1024:
            return jsonify({
                'success': False,
                'message': 'Recording is too large. Please record a shorter command.',
            }), 413

        # Convert browser WebM audio into WAV
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        conversion = subprocess.run(
            [
                ffmpeg_path,
                '-i', 'pipe:0',
                '-vn',
                '-ac', '1',
                '-ar', '16000',
                '-f', 'wav',
                'pipe:1',
            ],
            input=audio_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30,
        )

        if conversion.returncode != 0:
            raise RuntimeError(
                'Audio conversion failed: '
                + conversion.stderr.decode('utf-8', errors='replace')[-1000:]
            )

        wav_audio = conversion.stdout
        if not wav_audio:
            raise RuntimeError('Audio conversion produced an empty WAV file.')

        # Send WAV audio to Gnani Prisma STT
        stt_client = GnaniSTTClient()
        result = stt_client.transcribe_bytes(
            wav_audio,
            filename='voice-command.wav',
            language_code='en-IN',
            model='prisma-v3.0',
        )

        app.logger.info('GNANI STT RESPONSE: %s', result)
        transcript = result.get('transcript', '').strip()

        if not transcript:
            return jsonify({
                'success': False,
                'message': 'I could not understand the recording. Please try speaking again.',
            }), 400

        return process_voice_transcript(transcript)

    except Exception:
        app.logger.exception('Gnani voice command failed')
        return jsonify({
            'success': False,
            'message': 'Voice processing encountered an issue. Please try again.',
        }), 500


# --------------------------------------------------
# 9. Start Flask Application
# --------------------------------------------------


# --------------------------------------------------
# 10. Place Food Order (Instant, Tomorrow, or Multi-Day Plan)
# --------------------------------------------------

@app.route("/place-order", methods=["POST"])
def place_order():
    try:
        import json, random
        data = request.get_json() if request.is_json else request.form.to_dict()
        items = data.get("items", [])
        if isinstance(items, str):
            items = json.loads(items)

        if not items:
            return jsonify({"success": False, "message": "Your cart is empty."}), 400

        order_number = f"DB-{random.randint(10000, 99999)}"
        subtotal = sum(float(item.get("price", 0)) * int(item.get("quantity", 1)) for item in items)
        order_type = data.get("order_type", "instant")
        plan_duration = int(data.get("plan_duration", 1))

        # Delivery fee: Free for multi-day plans or orders >= Rs 200, else Rs 25
        delivery_fee = 0.0 if (plan_duration > 1 or subtotal >= 200) else 25.0
        taxes = round(subtotal * 0.05, 2)
        total_amount = round(subtotal + delivery_fee + taxes, 2)

        if order_type == "instant":
            delivery_schedule = "Instant Delivery (in 25-35 mins)"
        elif order_type == "tomorrow":
            slot = data.get("slot", "Lunch 1:00 PM")
            delivery_schedule = f"Tomorrow ({slot})"
        else:
            days_str = data.get("days_selected", f"{plan_duration} Days Plan")
            delivery_schedule = f"{plan_duration}-Day Plan ({days_str})"

        order_data = {
            "order_number": order_number,
            "order_type": order_type,
            "plan_duration": plan_duration,
            "delivery_schedule": delivery_schedule,
            "customer_name": data.get("customer_name", "Valued Customer"),
            "customer_phone": data.get("customer_phone", "9876543210"),
            "delivery_address": data.get("delivery_address", "Flat 402, Green Valley Apartments, Hyderabad"),
            "payment_method": data.get("payment_method", "UPI"),
            "subtotal": subtotal,
            "delivery_fee": delivery_fee,
            "taxes": taxes,
            "total_amount": total_amount
        }

        order_id = create_order(order_data, items)

        return jsonify({
            "success": True,
            "order_id": order_id,
            "order_number": order_number,
            "order_type": order_type,
            "delivery_schedule": delivery_schedule,
            "total_amount": total_amount,
            "message": "Order confirmed! Chef is preparing your delicious meal."
        })
    except Exception as e:
        app.logger.exception("Place order error")
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/orders")
def orders_page():
    orders = get_all_orders()
    return render_template("orders.html", orders=orders)


@app.route("/api/order/<int:order_id>")
def api_order(order_id):
    order = get_order_by_id(order_id)
    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404
    return jsonify({"success": True, "order": order})


if __name__ == "__main__":
    create_tables()
    insert_sample_meals()
    app.run(debug=True)
