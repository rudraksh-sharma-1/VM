import React, { useState } from "react";
import "./UserInputForm.css";

const UserInputForm = ({ onReceiveData }) => {
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activityLevel: "moderately active",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const validateForm = () => {
    const { age, weight, height } = form;
    if (!age || !weight || !height) return "All fields are required.";
    if (age <= 0 || weight <= 0 || height <= 0)
      return "Age, weight, and height must be positive numbers.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      onReceiveData(data); // <== this is the correct prop to call
    } catch (err) {
      setError("Failed to fetch recommendations. Make sure backend is running.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
      />
      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={form.weight}
        onChange={handleChange}
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={form.height}
        onChange={handleChange}
      />
      <select
        name="activityLevel"
        value={form.activityLevel}
        onChange={handleChange}
      >
        <option value="sedentary">Sedentary</option>
        <option value="lightly active">Lightly Active</option>
        <option value="moderately active">Moderately Active</option>
        <option value="very active">Very Active</option>
        <option value="extra active">Extra Active</option>
      </select>

      {error && <p className="error">{error}</p>}
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default UserInputForm;
