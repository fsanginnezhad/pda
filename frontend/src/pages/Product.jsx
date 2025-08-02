// pages/Product.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [inputData, setInputData] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/products/").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleSelect = (prod) => {
    setSelected(prod);
    setMessage("");
    setInputData("");
  };

  const handleSubmit = () => {
    axios
      .post("/update-product/", {
        product_id: selected.id,
        serial: inputData,
      })
      .then((res) => {
        setMessage(res.data.message || "ثبت شد.");
      })
      .catch(() => {
        setMessage("خطا در ثبت سریال");
      });
  };

  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-xl mb-4">لیست اقلام</h3>

      <div className="mb-4">
        <label className="block mb-2">انتخاب کالا:</label>
        <select
          onChange={(e) => handleSelect(JSON.parse(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- انتخاب --</option>
          {products.map((prod) => (
            <option key={prod.id} value={JSON.stringify(prod)}>
              {prod.name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="p-3 border rounded bg-white shadow">
          <p><b>کد کالا:</b> {selected.code}</p>
          <p><b>تعداد:</b> {selected.amount}</p>
          <p><b>اسکن شده:</b> {selected.description}</p>

          <input
            type="text"
            className="border mt-3 px-2 py-1 w-full rounded"
            placeholder="سریال را وارد کنید یا اسکن نمایید"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            ثبت
          </button>

          {message && <p className="text-red-600 mt-2">{message}</p>}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">برگشت</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">خروج</button>
      </div>
    </div>
  );
}
