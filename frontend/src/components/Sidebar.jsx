import { useNavigate, useLocation } from "react-router-dom";
import styles from "./css/Sidebar.module.css";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const link = (path) =>
    `${styles.item} ${location.pathname === path ? styles.active : ""}`;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {user.role === "candidate" && (
          <button
            className={link("/my-applications")}
            onClick={() => navigate("/my-applications")}
          >
            <i className="fa-solid fa-briefcase" />
            My Applications
          </button>
        )}

        {user.role === "recruiter" && (
          <>
            <button
              className={link("/recruiter/jobs")}
              onClick={() => navigate("/recruiter/jobs")}
            >
              <i className="fa-solid fa-clipboard-list" />
              My Jobs
            </button>

            <button
              className={link("/recruiter/applications")}
              onClick={() => navigate("/recruiter/applications")}
            >
              <i className="fa-solid fa-inbox" />
              Applications
            </button>
          </>
        )}

        {user.is_staff && (
          <button
            className={link("/admin-monitor")}
            onClick={() => navigate("/admin-monitor")}
          >
            <i className="fa-solid fa-shield" />
            Admin Monitor
          </button>
        )}
      </nav>

      {/* footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CareerMate.</p>
      </footer>
    </aside>
  );
}
