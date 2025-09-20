import { useLocation, Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export default function Index() {
  const location = useLocation();
  const products = location.state?.product || [];

  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scannedCount, setScannedCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null);
  const lastKeypressRef = useRef(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch('/api/check-auth/', {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", },
        });
        if (res.status === 401) navigate("/login");
      } catch (err) {
        console.error("خطا در بررسی احراز هویت", err);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!selected || selected.allow || scannedCount >= selected.amount) return;

    // تلاش فوری
    if (inputRef.current) {
      inputRef.current.focus();
      return; // اگر موفق شدیم دیگه نیازی به interval نیست
    }

    // در غیر اینصورت، تا زمانی که المان mount نشه چند بار تلاش کن
    let intervalId = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        clearInterval(intervalId);
        intervalId = null;
      }
    }, 200);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selected, scannedCount]);

  const handleSelect = (prod) => {
    setSelected(prod);
    setScannedCount(prod.serial_count || 0);
    setError("");
    setSuccess("");
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    const now = Date.now();
    const scanSpeedThreshold = 100;
    const isKeyboard = now - lastKeypressRef.current > scanSpeedThreshold;
    lastKeypressRef.current = now;

    if (e.key === "Enter") {
      e.preventDefault();
      if (isKeyboard) {
        setError("کیبورد مجاز نیست، فقط با دستگاه اسکن کنید.");
        setSuccess("");
        setInputValue("");
        return;
      }

      const serial = inputValue.trim();
      if (!serial || isNaN(serial)) {
        setError("فقط مقادیر عددی مجاز هستند");
        return;
      }

      if (String(serial) !== String(selected.code)) {
        setError("سریال وارد شده با کد کالا مطابقت ندارد.");
        return;
      }

      sendSerial(serial, selected.id);
    }
  };

  const sendSerial = async (serial, productId) => {
    try {
      const res = await fetch('/api/update-product/', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ product_id: productId, serial }),
      });
      const data = await res.json();
      if (data.success) {
        setScannedCount(data.description);
        setSuccess(data.message);
        setError("");
        setInputValue("");
      } else {
        setError(data.error || "خطا در ثبت سریال");
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد");
    }
  };

  const submitAuto = async () => {
  try {
    const res = await fetch('/api/update-product-auto/', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selected.id,
        product_code: selected.code,
        count_of_scan: selected.amount,
      }),
    });

    if (!res.ok) {
      // اگر سرور وضعیت خطا داد، پیام مناسب نمایش بده
      const errorText = await res.text();
      setError(`خطا از سرور: ${res.status} ${res.statusText} - ${errorText}`);
      setSuccess("");
      return;
    }

    const data = await res.json();

    if (data.success) {
      setScannedCount(data.description);
      setSuccess(data.message);
      setError("");
    } else {
      setError(data.error || data.message || "خطا در ثبت خودکار");
      setSuccess("");
    }
  } catch (err) {
    // خطای fetch یا خطاهای شبکه
    setError("خطایی در ارتباط با سرور رخ داد: " + err.message);
    setSuccess("");
  }
};

  if (!products.length) {
    return <Navigate to="/" replace state={{ message: "محصولی یافت نشد" }} />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">لیست کالاها</h2>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`px-4 py-2 rounded border ${
                selected?.id === p.id
                  ? "bg-blue-200"
                  : p.description === p.amount
                  ? "bg-green-200"
                  : "bg-gray-200"
              } hover:bg-gray-300 transition`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-4 text-sm sm:text-base">
            <Detail label="نام" value={selected.name} />
            <Detail label="کد" value={selected.code} />
            <Detail label="تعداد کل" value={selected.amount} />
            <Detail label="اسکن شده" value={scannedCount} />
            {!selected.allow && scannedCount < selected.amount && (
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-2 p-2 border rounded w-full"
                placeholder="سریال را با دستگاه اسکن کنید"
              />
            )}
            {selected.allow && scannedCount < selected.amount && (
              <button
                onClick={submitAuto}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                ثبت خودکار سریال‌ها
              </button>
            )}

            {error && <p className="text-red-600 mt-2">{error}</p>}
            {success && <p className="text-green-600 mt-2">{success}</p>}
          </div>
        )}
      </div>
      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p>
      <span className="font-semibold text-gray-700">{label}: </span>
      <span className="text-gray-600 break-words">{value || "—"}</span>
    </p>
  );
}
