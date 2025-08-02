// pages/Home.jsx
import React from "react";
import axios from "../api/axios";

export default function Home() {
  const handleClick = (type) => {
    axios
      .post("/api/receipts/", { type })
      .then((res) => {
        console.log("Success:", res.data);
        // مثلاً به صفحه جزئیات برو
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-center font-bold mb-4">
        برای ادامه روند یک گزینه را انتخاب کنید
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button onClick={() => handleClick(3)} className="btn bg-green-500 text-white">
          رسید انتقال به انبار
        </button>
        <button onClick={() => handleClick(1)} className="btn bg-green-500 text-white">
          رسید خرید
        </button>
        <button onClick={() => handleClick(103)} className="btn bg-blue-500 text-white">
          حواله انتقال
        </button>
        <button onClick={() => handleClick(1000)} className="btn bg-blue-500 text-white">
          حواله مستقیم
        </button>
        <button onClick={() => handleClick(2)} className="btn bg-cyan-500 text-white">
          رسید برگشت از فروش
        </button>
        <button onClick={() => handleClick(0)} className="btn bg-cyan-500 text-white">
          رسید مستقیم
        </button>
      </div>
    </div>
  );
}
