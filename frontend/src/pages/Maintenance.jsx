// pages/Maintenance.jsx
import React from "react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gray-100" dir="rtl">
      <img
        src="http://jpda.ir/static/app/images/fix.jpg"
        alt="در حال بروزرسانی"
        className="max-w-sm mb-6"
      />
      <h1 className="text-2xl font-bold mb-2">صفحه در حال بروزرسانی است</h1>
      <p className="text-gray-700 text-lg">لطفاً کمی صبر کنید، به زودی باز می‌گردیم.</p>
    </div>
  );
}
