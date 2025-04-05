import React from "react";

const RecommendationList = ({ recommendations }) => {
  if (
    !recommendations ||
    !recommendations.recommended_foods ||
    recommendations.recommended_foods.length === 0
  ) {
    return <p>No recommendations yet. Fill out the form to get started!</p>;
  }

  const {
    caloric_needs,
    macronutrient_distribution,
    recommended_foods,
  } = recommendations;

  return (
    <div>
      <h2>Personalized Nutrition Recommendations</h2>

      <div>
        <h3>Caloric and Macronutrient Needs</h3>
        <p>
          <strong>Daily Caloric Needs:</strong> {caloric_needs.toFixed(2)} kcal
        </p>
        <p><strong>Macronutrient Distribution:</strong></p>
        <ul>
          <li><strong>Protein:</strong> {macronutrient_distribution.protein.toFixed(2)}g</li>
          <li><strong>Carbs:</strong> {macronutrient_distribution.carbs.toFixed(2)}g</li>
          <li><strong>Fat:</strong> {macronutrient_distribution.fat.toFixed(2)}g</li>
        </ul>
      </div>

      <div>
        <h3>Recommended Foods</h3>
        <ul>
          {recommended_foods.map((meal, index) => (
            <li key={index}>
              <strong>{meal.food}</strong>
              <p>Calories: {meal.calories} kcal</p>
              <p>Protein: {meal.protein}g</p>
              <p>Carbs: {meal.carbs}g</p>
              <p>Fat: {meal.fat}g</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationList;
