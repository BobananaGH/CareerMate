import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./css/Layout.module.css";

function Layout({ user, onLogout }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className={styles.layout}>
        <Sidebar user={user} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
