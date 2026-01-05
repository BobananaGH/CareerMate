// src/components/LoginRegister.jsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./css/LoginRegister.css";
import api from "../api";

const LoginRegister = ({ onLoginSuccess }) => {
  const [activeForm, setActiveForm] = useState("login");

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // REGISTER STATE
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [role, setRole] = useState("");

  const handleFormSwitch = (form) => setActiveForm(form);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login/", {
        email: loginEmail,
        password: loginPassword,
      });

      const { access, refresh } = res.data.tokens;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("access", access);
      storage.setItem("refresh", refresh);

      onLoginSuccess(res.data.user);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/register/", {
        name: fullName,
        email: registerEmail,
        password: registerPassword,
        role,
      });

      // After successful register → go to login
      setActiveForm("login");
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container">
      {/* ================= LOGIN FORM ================= */}
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

          <div className="options-row">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me?
            </label>

            <a href="#" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn">
            Login
          </button>

          <div className="form-social">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/users/google-login/", {
                    credential: credentialResponse.credential,
                  });

                  const { access, refresh } = res.data.tokens;
                  localStorage.setItem("access", access);
                  localStorage.setItem("refresh", refresh);

                  // Notify App.jsx that user is logged in
                  onLoginSuccess(res.data.user);
                  console.log("Google login successful:", res.data.user);
                } catch (err) {
                  console.error(
                    "Google login failed:",
                    err.response?.data || err.message
                  );
                }
              }}
              onError={() => console.log("Google login failed")}
            />
          </div>

          <div className="links">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="switch-link"
                onClick={() => handleFormSwitch("register")}
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* ================= REGISTER FORM ================= */}
      <div className={`form-box ${activeForm === "register" ? "active" : ""}`}>
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          <input
            type="text"
            placeholder="FULL NAME"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="EMAIL"
            required
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="PASSWORD"
            required
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />

          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">SELECT ROLE</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button type="submit" className="btn">
            Register
          </button>

          <div className="links">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="switch-link"
                onClick={() => handleFormSwitch("login")}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
