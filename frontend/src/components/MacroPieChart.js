// components/MacroPieChart.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const MacroPieChart = ({ macroData }) => {
  const data = [
    { name: "Protein", value: macroData.protein },
    { name: "Carbs", value: macroData.carbs },
    { name: "Fat", value: macroData.fat },
  ];

  return (
    <div style={{ margin: "2rem auto", width: "60%", height: 300 }}>
      <h2>Daily Macronutrient Distribution</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroPieChart;
