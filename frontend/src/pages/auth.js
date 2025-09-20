export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    // logout user or redirect to login
    localStorage.removeItem("access");
    window.location.href = "/login";
    return;
  }

  const res = await fetch("https://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("access", data.access);
    return data.access;
  } else {
    // refresh token هم منقضی شده → لاگ‌اوت
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  }
};
