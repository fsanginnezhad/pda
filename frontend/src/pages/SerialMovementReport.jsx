// pages/SerialMovementReport.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import TableToExcel from "@linways/table-to-excel";

export default function SerialMovementReport() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  useEffect(() => {
    axios.get("/api/serial-report/").then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  // 🔍 فیلتر بر اساس کد، نام، شماره
  useEffect(() => {
    let result = [...products];

    if (codeFilter)
      result = result.filter((item) =>
        item.code?.toString().includes(codeFilter)
      );

    if (nameFilter)
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );

    if (userFilter)
      result = result.filter((item) =>
        item.remArr?.toString().includes(userFilter)
      );

    if (showDiffOnly)
      result = result.filter((item) => Number(item.differ) !== 0);

    setFiltered(result);
  }, [codeFilter, nameFilter, userFilter, showDiffOnly, products]);

  // 📆 فیلتر تاریخ
  const filterByDate = () => {
    const toNum = (date) => date?.replaceAll("/", "");
    const from = toNum(fromDate);
    const to = toNum(toDate);

    const result = products.filter((item) => {
      const itemDate = toNum(item.dateProduct);
      return itemDate >= from && itemDate <= to;
    });

    setFiltered(result);
  };

  // 📤 اکسل
  const exportToExcel = () => {
    const table = document.getElementById("serial-report-table");
    TableToExcel.convert(table, {
      name: "serial_report.xlsx",
      sheet: { name: "Sheet 1" },
    });
  };

  return (
    <div className="p-6 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-center mb-6">
        گزارش ورود و خروج به تفکیک سریال
      </h1>

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label>از:</label>
          <input
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="مثلاً 1403/01/01"
            className="border rounded px-2 py-1"
          />
          <label>تا:</label>
          <input
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="مثلاً 1403/01/30"
            className="border rounded px-2 py-1"
          />
          <button onClick={filterByDate} className="bg-orange-300 px-3 py-1 rounded">
            فیلتر
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="کد کالا"
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="نام کالا"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="شماره"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label htmlFor="showDiff">فقط اختلاف</label>
          <input
            type="checkbox"
            id="showDiff"
            checked={showDiffOnly}
            onChange={(e) => setShowDiffOnly(e.target.checked)}
          />
          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded">
            خروجی Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border" id="serial-report-table">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-2 border">شماره</th>
              <th className="p-2 border">نوع سند</th>
              <th className="p-2 border">تاریخ سند</th>
              <th className="p-2 border">کد کالا</th>
              <th className="p-2 border">نام کالا</th>
              <th className="p-2 border">صادر کننده</th>
              <th className="p-2 border">انباردار</th>
              <th className="p-2 border">تعداد کالا</th>
              <th className="p-2 border">تاریخ تحویل</th>
              <th className="p-2 border">ساعت</th>
              <th className="p-2 border">اسکن شده</th>
              <th className="p-2 border">اختلاف</th>
              <th className="p-2 border">سریال</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr
                key={index}
                className={Number(item.differ) !== 0 ? "bg-red-200" : ""}
              >
                <td className="border p-1">{item.remArr}</td>
                <td className="border p-1">{item.type_id}</td>
                <td className="border p-1">{item.dateProduct}</td>
                <td className="border p-1">{item.code}</td>
                <td className="border p-1">{item.name}</td>
                <td className="border p-1">{item.export}</td>
                <td className="border p-1">{item.user}</td>
                <td className="border p-1">{item.amount}</td>
                <td className="border p-1">{item.date}</td>
                <td className="border p-1">{item.clock}</td>
                <td className="border p-1">{item.des}</td>
                <td className="border p-1">{item.differ}</td>
                <td className="border p-1">{item.serial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
