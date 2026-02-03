import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminMonitor from "./admin/AdminMonitor";

import LoginRegister from "./pages/LoginRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/Landing";
import ResultPage from "./pages/Result";
import Analyze from "./pages/Analyze";
import CareerChat from "./pages/CareerChat";
import Profile from "./pages/Profile";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleCreate from "./pages/ArticleCreate";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import MyApplications from "./pages/MyApplications";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterJobs from "./pages/RecruiterJobs";

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
        {/* ===== ADMIN MONITOR ===== */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/careerchat" element={<CareerChat user={user} />} />

          <Route path="/articles" element={<Articles user={user} />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          <Route
            path="/articles/create"
            element={
              user ? <ArticleCreate user={user} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* JOBS */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          <Route
            path="/my-applications"
            element={
              user?.role === "candidate" || user?.is_staff ? (
                <MyApplications />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/recruiter/jobs"
            element={
              user?.role === "recruiter" || user?.is_staff ? (
                <RecruiterJobs />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/recruiter/applications"
            element={
              user?.role === "recruiter" || user?.is_staff ? (
                <RecruiterApplications />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/admin-monitor"
            element={
              user?.is_staff ? (
                <AdminMonitor user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
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
