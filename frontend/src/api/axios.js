// api/axios.js
import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:8000", // آدرس سرور Django
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // اگر از cookie-based auth استفاده می‌کنی
});
