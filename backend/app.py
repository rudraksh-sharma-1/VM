from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from scipy.optimize import linprog
import os
import random

app = Flask(__name__)
CORS(app)

# USDA File Combination Starts Here
foundation = pd.read_csv("foundation_food.csv")
food = pd.read_csv("food.csv")
nutrients = pd.read_csv("nutrient.csv")
food_nutrients = pd.read_csv("food_nutrient.csv")

# Get only macro nutrients
required_nutrients = ['Energy', 'Protein', 'Carbohydrate, by difference', 'Total lipid (fat)']
nutrient_ids = nutrients[nutrients['name'].isin(required_nutrients)][['id', 'name']]

# Merge nutrient names with values
merged = pd.merge(food_nutrients, nutrient_ids, left_on='nutrient_id', right_on='id')

# Pivot nutrients to columns
pivot = merged.pivot_table(index='fdc_id', columns='name', values='amount').reset_index()

# Add food descriptions
merged_food = pd.merge(pivot, food[['fdc_id', 'description']], on='fdc_id')

# Rename and clean
merged_food.rename(columns={
    'Energy': 'calories',
    'Protein': 'protein',
    'Carbohydrate, by difference': 'carbs',
    'Total lipid (fat)': 'fat',
    'description': 'food'
}, inplace=True)

# Drop missing and reset index
merged_food.dropna(subset=['calories', 'protein', 'carbs', 'fat'], inplace=True)
merged_food.reset_index(drop=True, inplace=True)

# Final data for recommendations
data = merged_food[["food", "calories", "protein", "carbs", "fat"]]
data.to_csv("usda_cleaned_food_data.csv", index=False)
# USDA File Combination Ends Here

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

    # Adaptive macro ratios based on activity level
    activity = user_data["activityLevel"].lower()
    if activity == "extra active":
        protein_ratio = 0.45
        carb_ratio = 0.35
    elif activity == "sedentary":
        protein_ratio = 0.35
        carb_ratio = 0.45
    else:
        protein_ratio = 0.4
        carb_ratio = 0.4
    fat_ratio = 1.0 - protein_ratio - carb_ratio

    meal_ratios = {
        "breakfast": 0.25,
        "lunch": 0.4,
        "dinner": 0.35
    }

    used_indices = set()
    meals = {}

    for meal, ratio in meal_ratios.items():
        # Sample a random subset of food items to inject variability
        sample_size = 100 if daily_calories > 2200 else 80
        subset = data.sample(n=sample_size, random_state=random.randint(1, 9999)).reset_index(drop=True)

        protein_target = daily_calories * protein_ratio * ratio
        carb_target = daily_calories * carb_ratio * ratio
        fat_target = daily_calories * fat_ratio * ratio

        nutrients = subset[['protein', 'carbs', 'fat']].values
        cost = subset['calories'].values

        A_eq = [
            nutrients[:, 0],
            nutrients[:, 1],
            nutrients[:, 2],
        ]
        b_eq = [protein_target / 4, carb_target / 4, fat_target / 9]
        bounds = [(0, None) for _ in range(len(cost))]

        res = linprog(cost, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method='highs')

        if res.success:
            selected = res.x
            chosen_indices = [i for i, qty in enumerate(selected) if qty > 0]
            meals[meal] = subset.iloc[chosen_indices].to_dict(orient='records')
        else:
            meals[meal] = []

    weekly_distribution = [
        {
            "day": day,
            "protein": round((daily_calories * protein_ratio) / 4 + random.uniform(-5, 5), 2),
            "carbs": round((daily_calories * carb_ratio) / 4 + random.uniform(-5, 5), 2),
            "fat": round((daily_calories * fat_ratio) / 9 + random.uniform(-2, 2), 2)
        }
        for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    ]

    response = {
        "caloric_needs": round(daily_calories, 2),
        "macronutrient_distribution": {
            "protein": round(daily_calories * protein_ratio / 4, 2),
            "carbs": round(daily_calories * carb_ratio / 4, 2),
            "fat": round(daily_calories * fat_ratio / 9, 2)
        },
        "weekly_charts": weekly_distribution,
        "recommended_foods": meals
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)