// pages/Login.jsx
import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/token/", {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/"); // بعد از ورود موفق برو صفحه اصلی
    } catch (err) {
      setError("نام کاربری یا رمز اشتباه است");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover" style={{ backgroundImage: 'url("http://jpda.ir/static/app/images/3.jpg")' }}>
      <div className="bg-white p-6 rounded shadow max-w-sm w-full text-right">
        <img
          src="http://jpda.ir/static/account/images/client.jpg"
          alt="Profile"
          className="w-full h-40 object-cover rounded mb-4"
        />
        <form onSubmit={handleSubmit}>
          <label>نام کاربری</label>
          <input
            type="text"
            className="w-full border p-2 rounded mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>کلمه عبور</label>
          <input
            type="password"
            className="w-full border p-2 rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            ورود به سامانه
          </button>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
