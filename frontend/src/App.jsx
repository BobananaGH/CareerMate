import React, { useEffect, useState } from "react";
import LoginRegister from "./components/LoginRegister";
import api from "./api";

function App() {
  console.log("App.jsx mounted");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth on refresh
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
        console.log("Auto-login success:", res.data);
      } catch (err) {
        console.log("Invalid or expired token");
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
    <>
      {user ? (
        <>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <LoginRegister onLoginSuccess={setUser} />
      )}
    </>
  );
}

export default App;
