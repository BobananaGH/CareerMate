import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginRegister from "./pages/LoginRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/Landing";
import ResultPage from "./pages/Result";
import Analyze from "./pages/Analyze";
import CareerChat from "./pages/CareerChat";

import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token =
        sessionStorage.getItem("access") || localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/users/me/");
        setUser(res.data);
      } catch {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* ===== PAGES WITH LAYOUT ===== */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/careerchat" element={<CareerChat />} />
        </Route>

        {/* ===== AUTH LAYOUT ===== */}
        <Route element={<AuthLayout />}>
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
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
