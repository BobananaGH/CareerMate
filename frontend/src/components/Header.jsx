import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/css/Header.module.css";

export default function Header({ user, onLogout, minimal = false }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={styles.headerCheckHome}>
      <nav className={styles.headerMainNav}>
        <ul className={styles.headerNavList}>
          <li className={styles.headerNavItem} onClick={() => navigate("/")}>
            Home
          </li>

          {!minimal && (
            <li
              className={styles.headerNavItem}
              onClick={() => navigate("/analyze")}
            >
              Resume Check
            </li>
          )}

          {!minimal && (
            <li
              className={styles.headerNavItem}
              onClick={() => navigate("/careerchat")}
            >
              CareerChat
            </li>
          )}
        </ul>
      </nav>

      {/* ===== RIGHT ACTION ===== */}

      <div className={styles.headerAction} ref={dropdownRef}>
        {user && !minimal && (
          <div className={styles.profileWrap}>
            <div className={styles.profileBtn} onClick={() => setOpen(!open)}>
              <div className={styles.avatar}>
                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
              </div>

              <span>
                {[user.first_name, user.last_name].filter(Boolean).join(" ") ||
                  user.email}
              </span>

              <i
                className={`fa-solid fa-chevron-down ${open ? styles.arrowOpen : ""}`}
              />
            </div>

            <div
              className={`${styles.dropdown} ${open ? styles.dropdownOpen : ""}`}
            >
              <button
                className="btn"
                style={{ width: "100%", textAlign: "left" }}
                onClick={() => navigate("/profile")}
              >
                <i className="fa-regular fa-user"></i>Profile
              </button>

              <button
                className={`btn ${styles.logout}`}
                style={{ width: "100%", textAlign: "left" }}
                onClick={onLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Logout
              </button>
            </div>
          </div>
        )}

        {!user && !minimal && (
          <button className="btn btnPrimary" onClick={() => navigate("/login")}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
