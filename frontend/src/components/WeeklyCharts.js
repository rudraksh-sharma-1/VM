import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeeklyCharts = ({ data }) => {
  return (
    <div style={{ margin: "2rem auto", width: "80%", height: 300 }}>
      <h2>Weekly Macronutrient Intake</h2>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="protein" stackId="a" fill="#8884d8" />
          <Bar dataKey="carbs" stackId="a" fill="#82ca9d" />
          <Bar dataKey="fat" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyCharts;