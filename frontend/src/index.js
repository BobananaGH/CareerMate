import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";

// --- TOKEN CHECK ---
const access = localStorage.getItem("access");
if (access) {
  try {
    const payload = JSON.parse(atob(access.split(".")[1])); // decode JWT
    if (Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      console.log("Token expired, cleared from localStorage");
    }
  } catch (err) {
    console.error("Failed to parse token:", err);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
}
// --- END TOKEN CHECK ---

const clientId =
  "376149640618-t1s22d2otnf5t0qh9rd2hg996ularb28.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
