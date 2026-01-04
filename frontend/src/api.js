import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access") || sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
