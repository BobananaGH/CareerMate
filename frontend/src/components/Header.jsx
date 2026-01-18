import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/css/Header.module.css";
export default function Header({ user, onLogout, minimal = false }) {
  const navigate = useNavigate();

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
      <div className={styles.headerAction}>
        {user && !minimal && (
          <button className="btn btnPrimary" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        )}

        {!user && !minimal && (
          <button className="btn btnPrimary" onClick={() => navigate("/login")}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
          </button>
        )}
      </div>
    </header>
  );
}
