import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./css/Sidebar.module.css";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isCandidate = user.role === "candidate" || user.is_staff;
  const isRecruiter = user.role === "recruiter" || user.is_staff;
  const isAdmin = user.is_staff;

  const AnimatedText = ({ text }) => (
    <span className={styles.label}>
      {text.split("").map((c, i) => (
        <span key={i} style={{ "--i": i }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );

  const link = (path) =>
    `${styles.item} ${location.pathname === path ? styles.active : ""}`;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* toggle */}
      <button
        className={styles.toggle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className="fa-solid fa-chevron-left" />
      </button>

      <nav className={styles.nav}>
        {isCandidate && (
          <button
            className={link("/my-applications")}
            onClick={() => navigate("/my-applications")}
          >
            <i className="fa-solid fa-briefcase" />
            <AnimatedText text="My Applications" />
          </button>
        )}

        {isRecruiter && (
          <>
            <button
              className={link("/recruiter/jobs")}
              onClick={() => navigate("/recruiter/jobs")}
            >
              <i className="fa-solid fa-clipboard-list" />
              <AnimatedText text="My Jobs" />
            </button>

            <button
              className={link("/recruiter/applications")}
              onClick={() => navigate("/recruiter/applications")}
            >
              <i className="fa-solid fa-inbox" />
              <AnimatedText text="Applications" />
            </button>
          </>
        )}

        {isAdmin && (
          <button
            className={link("/admin-monitor")}
            onClick={() => navigate("/admin-monitor")}
          >
            <i className="fa-solid fa-shield" />
            <AnimatedText text="Admin Monitor" />
          </button>
        )}
      </nav>

      <footer className={styles.footer}>
        {!collapsed && <p>© {new Date().getFullYear()} CareerMate.</p>}
      </footer>
    </aside>
  );
}
