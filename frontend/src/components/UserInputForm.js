import React, { useState } from "react";
import axios from "axios";
import "./UserInputForm.css";
const UserInputForm = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activityLevel: "moderately active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/recommendations", formData);
      onGenerate(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <label>
        Gender:
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <label>
        Weight (kg):
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
      </label>
      <label>
        Height (cm):
        <input type="number" name="height" value={formData.height} onChange={handleChange} required />
      </label>
      <label>
        Activity Level:
        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
          <option value="sedentary">Sedentary</option>
          <option value="lightly active">Lightly Active</option>
          <option value="moderately active">Moderately Active</option>
          <option value="very active">Very Active</option>
          <option value="extra active">Extra Active</option>
        </select>
      </label>
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default UserInputForm;
