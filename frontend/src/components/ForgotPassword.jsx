import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/password-reset/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-box active">
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>

          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn">
            Send Reset Link
          </button>

          {message && <p>{message}</p>}

          <div className="links">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
