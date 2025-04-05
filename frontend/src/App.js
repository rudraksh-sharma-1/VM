import React, { useState } from "react";
import UserInputForm from "./components/UserInputForm";
import RecommendationList from "./components/RecommendationList";

const App = () => {
  const [recommendations, setRecommendations] = useState(null); // State for recommendations

  // Function to handle recommendations received from the backend
  const handleGenerateRecommendations = (data) => {
    setRecommendations(data);
  };

  return (
    <div>
      <h1>Personalized Nutrition Planner</h1>
      <UserInputForm onGenerate={handleGenerateRecommendations} />
      {recommendations && <RecommendationList recommendations={recommendations} />}
    </div>
  );
};

export default App;
