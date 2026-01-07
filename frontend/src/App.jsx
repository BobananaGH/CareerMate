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

  return (
    <Router>
      {/* ALWAYS render Routes, no hooks skipped */}
      <Routes>
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
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/" /> : <ResetPassword />}
        />
        <Route
          path="/"
          element={
            loading ? (
              <p>Loading...</p>
            ) : user ? (
              <div>
                <h1>Welcome, {user.email}</h1>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
