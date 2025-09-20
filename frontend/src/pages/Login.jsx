import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login/',{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (res.ok) {
        setError("");
        navigate("/");
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است");
      }
    } catch {
      setError("مشکل در ارتباط با سرور");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">ورود</h2>
        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameRef}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          ورود
        </button>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
}



// // pages/Login.jsx
// import React, { useState } from "react";
// import axios from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/token/", {
//         username,
//         password,
//       });
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       navigate("/"); // بعد از ورود موفق برو صفحه اصلی
//     } catch (err) {
//       setError("نام کاربری یا رمز اشتباه است");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-cover" style={{ backgroundImage: 'url("http://jpda.ir/static/app/images/3.jpg")' }}>
//       <div className="bg-white p-6 rounded shadow max-w-sm w-full text-right">
//         <img
//           src="http://jpda.ir/static/account/images/client.jpg"
//           alt="Profile"
//           className="w-full h-40 object-cover rounded mb-4"
//         />
//         <form onSubmit={handleSubmit}>
//           <label>نام کاربری</label>
//           <input
//             type="text"
//             className="w-full border p-2 rounded mb-2"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <label>کلمه عبور</label>
//           <input
//             type="password"
//             className="w-full border p-2 rounded mb-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-2 rounded"
//           >
//             ورود به سامانه
//           </button>
//           {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// }
