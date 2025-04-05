from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from scipy.optimize import linprog
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load dataset (Ensure the dataset is in the same directory as `app.py`)
DATA_FILE = os.path.join(os.path.dirname(__file__), "FOOD-DATA-GROUP1.csv")
data = pd.read_csv(DATA_FILE)

# Select necessary columns for recommendations
data = data.rename(columns={
    "Caloric Value": "calories",
    "Protein": "protein",
    "Carbohydrates": "carbs",
    "Fat": "fat"
})

data = data[["food", "calories", "protein", "carbs", "fat"]]

# Calculate Daily Caloric Needs
def calculate_calories(age, gender, weight, height, activity_level):
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "extra active": 1.9,
    }
    return bmr * activity_multipliers.get(activity_level.lower(), 1.2)

# Recommend Meals
def recommend_meals(data, daily_calories, protein_ratio, carb_ratio, fat_ratio):
    protein_calories = daily_calories * protein_ratio
    carb_calories = daily_calories * carb_ratio
    fat_calories = daily_calories * fat_ratio

    protein_grams = protein_calories / 4
    carb_grams = carb_calories / 4
    fat_grams = fat_calories / 9

    nutrients = data[['protein', 'carbs', 'fat']].values
    cost = data['calories'].values

    A_eq = [nutrients[:, 0], nutrients[:, 1], nutrients[:, 2]]
    b_eq = [protein_grams, carb_grams, fat_grams]
    bounds = [(0, None) for _ in range(len(cost))]

    res = linprog(cost, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method='highs')

    if res.success:
        selected_foods = res.x
        recommended_foods = data.iloc[(selected_foods > 0).nonzero()[0]].to_dict(orient='records')
        return recommended_foods
    else:
        return []

@app.route("/recommendations", methods=["POST"])
def get_recommendations():
    user_data = request.json
    daily_calories = calculate_calories(
        age=int(user_data["age"]),
        gender=user_data["gender"],
        weight=float(user_data["weight"]),
        height=float(user_data["height"]),
        activity_level=user_data["activityLevel"]
    )
    protein_ratio = 0.4
    carb_ratio = 0.4
    fat_ratio = 0.2

    recommendations = recommend_meals(
        data,
        daily_calories,
        protein_ratio,
        carb_ratio,
        fat_ratio
    )

    response = {
        "caloric_needs": daily_calories,
        "macronutrient_distribution": {
            "protein": daily_calories * protein_ratio / 4,
            "carbs": daily_calories * carb_ratio / 4,
            "fat": daily_calories * fat_ratio / 9
        },
        "recommended_foods": recommendations
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
