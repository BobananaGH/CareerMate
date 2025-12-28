import React, { useEffect, useState } from "react";
import LoginRegister from "./components/LoginRegister";
import api from "./api";

function App() {
  console.log("App.jsx mounted"); // ✅ HERE

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/me/");
        setUser(res.data);
        console.log("Auto-login success:", res.data);
      } catch (err) {
        console.log("No valid token, not logged in");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <>{user ? <h1>Welcome, {user.email}</h1> : <LoginRegister />}</>;
}

export default App;
