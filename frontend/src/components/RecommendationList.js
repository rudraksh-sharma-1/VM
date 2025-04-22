import React from "react";

const RecommendationList = ({ recommendations }) => {
  if (!recommendations || !recommendations.recommended_foods) {
    return <p>No recommendations yet. Fill out the form to get started!</p>;
  }

  const { caloric_needs, macronutrient_distribution, recommended_foods } = recommendations;

  return (
    <div>
      <h2>Personalized Nutrition Recommendations</h2>

      <div>
        <h3>Caloric and Macronutrient Needs</h3>
        <p><strong>Daily Caloric Needs:</strong> {caloric_needs.toFixed(2)} kcal</p>
        <ul>
          <li><strong>Protein:</strong> {macronutrient_distribution.protein.toFixed(2)}g</li>
          <li><strong>Carbs:</strong> {macronutrient_distribution.carbs.toFixed(2)}g</li>
          <li><strong>Fat:</strong> {macronutrient_distribution.fat.toFixed(2)}g</li>
        </ul>
      </div>

      <div>
        <h3>Meal Plan</h3>
        {Object.entries(recommended_foods).map(([meal, foods]) => (
          <div key={meal}>
            <h4 style={{ textTransform: "capitalize" }}>{meal}</h4>
            <ul>
              {foods.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.food}</strong> — 
                  {item.calories?.toFixed(2)} kcal, 
                  Protein: {item.protein}g, 
                  Carbs: {item.carbs}g, 
                  Fat: {item.fat}g
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
