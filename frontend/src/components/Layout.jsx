import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

function Layout({ user, onLogout }) {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/career-chat");

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
