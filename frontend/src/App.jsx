import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Landing from "./components/Landing";
import ResultPage from "./components/Result";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/users/me/");
        setUser(res.data);
      } catch {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={<Landing user={user} onLogout={handleLogout} />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <LoginRegister onLoginSuccess={setUser} />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Temp Public */}
        <Route path="/result" element={<ResultPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;
