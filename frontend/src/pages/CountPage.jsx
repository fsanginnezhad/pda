// pages/CountPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function CountPage() {
  const [params] = useSearchParams();
  const [barcode, setBarcode] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [manualCode, setManualCode] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const counted = params.get("mode"); // 'auto1', 'manual1' ...

  const isAuto = counted?.startsWith("auto");
  const isManual = counted?.startsWith("manual");

  // ------------------ حالت شمارش خودکار ------------------
  useEffect(() => {
    if (!isAuto) return;

    const interval = setInterval(() => document.getElementById("barcode")?.focus(), 500);
    return () => clearInterval(interval);
  }, [isAuto]);

  const handleAutoScan = (e) => {
    const now = new Date().getTime();
    const threshold = 100; // برای تشخیص PDA vs Keyboard

    if (now - lastScanTime > threshold) {
      e.preventDefault();
      setBarcode("");
      setMessage("ورودی مجاز نیست. فقط اسکنر.");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (barcode) {
        axios
          .post("/submit_barcode_auto/", { serial: barcode })
          .then((res) => {
            setMessage(res.data.message || "ثبت شد");
            setBarcode("");
          })
          .catch(() => setMessage("خطا در ثبت"));
      }
    }

    setLastScanTime(now);
  };

  // ------------------ حالت شمارش دستی ------------------

  const fetchProduct = () => {
    if (!manualCode || isNaN(manualCode)) {
      setMessage("کد کالا نامعتبر است");
      return;
    }

    axios
      .get("/get-product-details/", { params: { product_code: manualCode } })
      .then((res) => {
        if (res.data.error) {
          setMessage(res.data.error);
          setProductInfo(null);
        } else {
          setProductInfo(res.data);
          setMessage("");
        }
      })
      .catch(() => setMessage("خطا در دریافت اطلاعات"));
  };

  const submitManualCount = () => {
    if (!quantity || isNaN(quantity)) {
      setMessage("تعداد نامعتبر است");
      return;
    }

    axios
      .post("/submit-order/", {
        product_code: manualCode,
        quantity,
      })
      .then((res) => {
        if (res.data.success) {
          setMessage(`کالا با کد ${manualCode} ثبت شد`);
          setProductInfo(null);
          setManualCode("");
          setQuantity("");
        }
      })
      .catch(() => setMessage("خطا در ثبت اطلاعات"));
  };

  return (
    <div className="p-4 text-right" dir="rtl">
      <h1 className="text-xl font-bold mb-4">
        {counted?.includes("1") && "شمارش اول"}
        {counted?.includes("2") && "شمارش دوم"}
        {counted?.includes("3") && "شمارش سوم"}
      </h1>

      {isAuto && (
        <div className="bg-white shadow p-4 rounded max-w-md mx-auto">
          <label>سریال:</label>
          <input
            id="barcode"
            type="number"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleAutoScan}
            className="border w-full px-3 py-2 rounded mt-2"
            placeholder="سریال را با دستگاه اسکن کنید"
            autoFocus
          />
        </div>
      )}

      {isManual && (
        <div className="bg-white shadow p-4 rounded max-w-md mx-auto">
          <label>کد کالا:</label>
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProduct()}
            className="border w-full px-3 py-2 rounded mt-2"
            placeholder="کد کالا را وارد کنید"
          />

          {productInfo && (
            <div className="mt-4 border rounded bg-gray-50 p-3">
              <p>نام کالا: <b>{productInfo.name}</b></p>
              <p>کد کالا: {productInfo.code}</p>
              <p>تعداد اسکن شده: {productInfo.scan}</p>
              <label>تعداد جدید:</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
              <button
                onClick={submitManualCount}
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
              >
                ثبت
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center text-red-600 font-medium">{message}</div>

      <div className="mt-8 text-center">
        <button
          className="bg-yellow-400 px-4 py-2 rounded"
          onClick={() => navigate("/submit_barcode")}
        >
          برگشت
        </button>
      </div>
    </div>
  );
}
