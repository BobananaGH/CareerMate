// src/components/LoginRegister.jsx
import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./css/LoginRegister.css";

const LoginRegister = () => {
  const [activeForm, setActiveForm] = useState("login");

  useEffect(() => {
    console.log("Active form:", activeForm);
  }, [activeForm]);

  const handleFormSwitch = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="container">
      {/* Login Form */}
      <div
        className={`form-box ${activeForm === "login" ? "active" : ""}`}
        id="login-form"
      >
        <form>
          <h2>Sign In</h2>
          <input type="email" name="email" placeholder="EMAIL" required />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
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
