import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout({ user, onLogout }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;
