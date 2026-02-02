import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// ================= REQUEST =================
api.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("access") || localStorage.getItem("access");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE (AUTO REFRESH) =================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh =
          sessionStorage.getItem("refresh") || localStorage.getItem("refresh");

        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(
          "http://localhost:8000/api/users/token/refresh/",
          { refresh },
        );

        const newAccess = res.data.access;

        // Save new access token
        sessionStorage.setItem("access", newAccess);
        localStorage.setItem("access", newAccess);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        console.log("Refresh failed, logging out");

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
