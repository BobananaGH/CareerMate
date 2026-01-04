import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // more readable than 127.0.0.1
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically (supports Remember Me)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access") || sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
