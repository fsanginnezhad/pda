// pages/Index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Index() {
  const [number, setNumber] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/search/", { RemittanceNumber: number });
      setMessages([res.data.message || "با موفقیت دریافت شد."]);
    } catch (err) {
      setMessages(["خطا در ارسال اطلاعات"]);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-center mb-4 font-bold text-lg">نمایش سند</h2>
      <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="شماره"
          className="border rounded px-3 py-2 w-48"
        />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
          نمایش
        </button>
      </form>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => navigate("/")} className="bg-gray-600 text-white px-4 py-2 rounded">
          برگشت
        </button>
        <button onClick={() => navigate("/logout")} className="bg-red-600 text-white px-4 py-2 rounded">
          خروج
        </button>
      </div>

      {messages.length > 0 && (
        <div className="mt-4 text-center text-sm text-blue-700">
          {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
