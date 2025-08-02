// pages/InventoryMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function InventoryMenu() {
  const navigate = useNavigate();

  const handleCountClick = (mode) => {
    navigate(`/count?mode=${mode}`);
  };

  return (
    <div className="relative min-h-screen text-right" dir="rtl" style={{
      backgroundImage: 'url("http://jpda.ir/static/app/images/3.jpg")',
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
    }}>
      <div className="absolute inset-0 bg-white bg-opacity-50 -z-10"></div>

      <div className="container mx-auto py-12 px-4">
        {/* بخش شمارش‌ها */}
        <div className="flex flex-col lg:flex-row justify-around gap-6 mb-8">
          {/* شمارش دستی */}
          <div className="bg-white bg-opacity-90 p-6 rounded shadow w-full lg:w-1/2">
            <h4 className="font-bold mb-4 text-lg">شمارش دستی</h4>
            <div className="space-y-2">
              <button onClick={() => handleCountClick("manual1")} className="btn btn-primary w-full">شمارش ۱</button>
              <button onClick={() => handleCountClick("manual2")} className="btn btn-primary w-full">شمارش ۲</button>
              <button onClick={() => handleCountClick("manual3")} className="btn btn-primary w-full">شمارش ۳</button>
            </div>
          </div>

          {/* شمارش اتوماتیک */}
          <div className="bg-white bg-opacity-90 p-6 rounded shadow w-full lg:w-1/2">
            <h4 className="font-bold mb-4 text-lg">اسکن اتومات</h4>
            <div className="space-y-2">
              <button onClick={() => handleCountClick("auto1")} className="btn btn-secondary w-full">شمارش ۱</button>
              <button onClick={() => handleCountClick("auto2")} className="btn btn-secondary w-full">شمارش ۲</button>
              <button onClick={() => handleCountClick("auto3")} className="btn btn-secondary w-full">شمارش ۳</button>
            </div>
          </div>
        </div>

        {/* بخش گزارشات */}
        <div className="bg-white bg-opacity-90 p-4 rounded shadow mb-6">
          <h4 className="font-bold mb-3 text-lg">گزارشات</h4>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/report")} className="btn btn-info">انبارگردانی</button>
            <button onClick={() => navigate("/report/summary")} className="btn btn-info">ورود و خروج کالا</button>
            <button onClick={() => navigate("/report/serials")} className="btn btn-info">گزارش تفکیکی سریال</button>
          </div>
        </div>

        {/* برگشت و خروج */}
        <div className="bg-white bg-opacity-90 p-4 rounded shadow">
          <div className="flex gap-4">
            <button onClick={() => navigate("/index")} className="btn text-white" style={{ backgroundColor: "#537e6c" }}>
              برگشت
            </button>
            <button onClick={() => navigate("/logout")} className="btn text-white" style={{ backgroundColor: "brown" }}>
              خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
