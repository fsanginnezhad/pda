import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

function Home() {
  const [dropdownValue, setDropdownValue] = useState('1000');
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const inputValueRef = useRef(null);
  const location = useLocation();
  const [msg, setMsg] = useState(location.state?.message || "");

  const isButtonEnabled = inputValue.trim() !== '';

  useEffect(() => {
    const checkAuth = async () => {
      // let res = await fetch(`${API_BASE_URL}/api/check-auth/`, {
      let res = await fetch('/api/check-auth/', {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
      });
      if (res.status === 401) {
        navigate("/login");
      } else {
        inputValueRef.current?.focus();
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/product/?type_=${dropdownValue}&rem=${inputValue}`);
      const data = await response.json();
      navigate('/index', { state: { product: data } });
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleSubmit_logout = async () => {
    try {
      const res = await fetch('/api/logout/', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
      });
      if (res.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          برای ادامه روند یک گزینه را انتخاب کنید
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">نوع سند</label>
          <select
            value={dropdownValue}
            onChange={e => setDropdownValue(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="1000">حواله مستقیم</option>
            <option value="3">رسید انتقال به انبار</option>
            <option value="1">رسید خرید</option>
            <option value="103">حواله انتقال</option>
            <option value="2">رسید برگشت از فروش</option>
            <option value="0">رسید مستقیم</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">شماره سند</label>
          <input
            type="text"
            placeholder="مثلاً ۱۲۳۴۵"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputValueRef}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          {msg && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">
              {msg}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
            isButtonEnabled
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          نمایش
        </button>
        <br /><br />
        <button
          onClick={handleSubmit_logout}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
            'bg-red-600 hover:bg-red-700'
          }`}
        >
          خروج
        </button>
      </div>
    </div>
  );
}

export default Home;