import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const navigate = useNavigate();
  const uid = query.get("uid");
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/users/password-reset/complete/", {
        uid,
        token,
        new_password: password,
      });

      setMessage(res.data.message || "Password reset successful");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <div className="form-box active">
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>

          <input
            type="password"
            placeholder="NEW PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="CONFIRM PASSWORD"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="btn">
            Reset Password
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
