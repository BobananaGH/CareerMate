import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./css/LoginRegister.css";
import api from "../api";

const LoginRegister = ({ onLoginSuccess }) => {
  const [activeForm, setActiveForm] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleFormSwitch = (formName) => {
    setActiveForm(formName);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login/", {
        email: loginEmail,
        password: loginPassword,
      });

      const { access, refresh } = res.data.tokens;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // ✅ notify App.jsx
      onLoginSuccess(res.data.user);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container">
      {/* Login Form */}
      <div className={`form-box ${activeForm === "login" ? "active" : ""}`}>
        <form onSubmit={handleLogin}>
          <h2>Sign In</h2>

          <input
            type="email"
            placeholder="EMAIL"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="PASSWORD"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button type="submit" className="btn">
            Login
          </button>

          <div className="form-social">
            <GoogleLogin
              onSuccess={(cred) => console.log("Google login success:", cred)}
              onError={() => console.log("Google login failed")}
            />
          </div>

          <p>
            Don't have an account?{" "}
            <button type="button" onClick={() => handleFormSwitch("register")}>
              Register
            </button>
          </p>
        </form>
      </div>

      {/* Register Form (UI only for now) */}
      <div className={`form-box ${activeForm === "register" ? "active" : ""}`}>
        <form>
          <h2>Register</h2>
          <input type="text" placeholder="FULL NAME" required />
          <input type="email" placeholder="EMAIL" required />
          <input type="password" placeholder="PASSWORD" required />

          <button type="submit" className="btn">
            Register
          </button>

          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => handleFormSwitch("login")}>
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
