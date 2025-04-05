import React, { useState } from "react";
import UserInputForm from "./components/UserInputForm";
import WeeklyCharts from "./components/WeeklyCharts";
import MacroPieChart from "./components/MacroPieChart";
import RecommendationList from "./components/RecommendationList";
import "./App.css";

function App() {
  const [recommendationData, setRecommendationData] = useState(null);

  const handleRecommendations = (data) => {
    setRecommendationData(data);
  };

  return (
    <div className="App">
      <h1>Nutrition Planner</h1>
      <UserInputForm onReceiveData={handleRecommendations} />

      {recommendationData && (
        <>
          <MacroPieChart macroData={recommendationData.macronutrient_distribution} />
          <WeeklyCharts data={recommendationData.weekly_charts} />
          <RecommendationList recommendations={recommendationData} />
        </>
      )}
    </div>
  );
}

export default App;
