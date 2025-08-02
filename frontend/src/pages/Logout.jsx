// pages/Signup.jsx
import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register/", form);
      navigate("/login");
    } catch (err) {
      alert("ثبت‌نام ناموفق بود");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-right">
      <h2 className="text-lg font-bold mb-4">ثبت‌نام</h2>
      <form onSubmit={handleSubmit}>
        <label>نام کاربری</label>
        <input
          name="username"
          className="w-full border p-2 rounded mb-2"
          onChange={handleChange}
        />
        <label>رمز عبور</label>
        <input
          name="password"
          type="password"
          className="w-full border p-2 rounded mb-2"
          onChange={handleChange}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          ثبت‌نام
        </button>
      </form>
    </div>
  );
}
