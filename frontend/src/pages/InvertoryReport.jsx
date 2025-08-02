// pages/InventoryReport.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import TableToExcel from "@linways/table-to-excel"; // باید نصب کنی

export default function InventoryReport() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    axios.get("/api/products/").then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  const filterByDate = () => {
    const toNum = (date) => date.replaceAll("/", "");
    const from = toNum(fromDate);
    const to = toNum(toDate);
    const result = products.filter((p) => {
      const d = toNum(p.dateprod);
      return d >= from && d <= to;
    });
    setFiltered(result);
  };

  const handleExcelExport = () => {
    const table = document.getElementById("report-table");
    TableToExcel.convert(table, {
      name: "report.xlsx",
      sheet: { name: "Sheet 1" },
    });
  };

  const applyTextFilters = () => {
    let result = [...products];
    if (codeFilter)
      result = result.filter((p) =>
        String(p.codeKala).toLowerCase().includes(codeFilter.toLowerCase())
      );
    if (nameFilter)
      result = result.filter((p) =>
        p.nameKala.toLowerCase().includes(nameFilter.toLowerCase())
      );
    setFiltered(result);
  };

  useEffect(() => {
    applyTextFilters();
  }, [codeFilter, nameFilter]);

  return (
    <div className="p-6 text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-4 text-center">گزارش انبار گردانی</h1>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label>از:</label>
          <input
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="تاریخ شروع (مثلاً 1403/01/01)"
            className="border rounded px-2 py-1"
          />
          <label>تا:</label>
          <input
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="تاریخ پایان"
            className="border rounded px-2 py-1"
          />
          <button onClick={filterByDate} className="bg-orange-200 px-3 py-1 rounded">
            فیلتر
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
            placeholder="فیلتر کد کالا"
            className="border rounded px-2 py-1"
          />
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="فیلتر نام کالا"
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => (window.location.href = "/submit_barcode")}
            className="bg-yellow-200 px-3 py-1 rounded"
          >
            برگشت
          </button>
          <button onClick={handleExcelExport} className="bg-green-600 text-white px-3 py-1 rounded">
            خروجی Excel
          </button>
        </div>
      </div>

      <table className="w-full border text-sm" id="report-table">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="p-2 border">تاریخ</th>
            <th className="p-2 border">کد کالا</th>
            <th className="p-2 border">نام کالا</th>
            <th className="p-2 border">شمارش 1</th>
            <th className="p-2 border">شمارش 2</th>
            <th className="p-2 border">شمارش 3</th>
            <th className="p-2 border">اختلاف 1-2</th>
            <th className="p-2 border">اختلاف 2-3</th>
            <th className="p-2 border">انباردار</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border px-2 py-1">{p.dateprod}</td>
              <td className="border px-2 py-1">{p.codeKala}</td>
              <td className="border px-2 py-1">{p.nameKala}</td>
              <td className="border px-2 py-1">{p.count1}</td>
              <td className="border px-2 py-1">{p.count2}</td>
              <td className="border px-2 py-1">{p.count3}</td>
              <td className="border px-2 py-1">{p.differ2_1}</td>
              <td className="border px-2 py-1">{p.differ3_2}</td>
              <td className="border px-2 py-1">{p.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
