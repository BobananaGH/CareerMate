// src/components/LoginRegister.jsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./css/LoginRegister.css";
import api from "../api.js";

const LoginRegister = () => {
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

      console.log("Login success", res.data.user);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  };
  return (
    <div className="container">
      {/* Login Form */}
      <div
        className={`form-box ${activeForm === "login" ? "active" : ""}`}
        id="login-form"
      >
        <form onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <div className="options-row">
            <label>
              <input type="checkbox" name="remember-me" /> Remember me?
            </label>
            <a href="#" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
          <p>
            <button type="submit" name="login" className="btn">
              Login
            </button>
          </p>

          <div className="form-social">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google login success:", credentialResponse);
              }}
              onError={() => {
                console.log("Google login failed");
              }}
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

      {/* Register Form */}
      <div
        className={`form-box ${activeForm === "register" ? "active" : ""}`}
        id="register-form"
      >
        <form>
          <h2>Register</h2>
          <input type="text" name="name" placeholder="FULL NAME" required />
          <input type="email" name="email" placeholder="EMAIL" required />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
          />
          <select name="role" required>
            <option value="">SELECT ROLE</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <p>
            <button type="submit" name="register" className="btn">
              Register
            </button>
          </p>
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
