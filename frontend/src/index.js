import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";

// --- TOKEN CHECK (OK to keep here) ---
const access = localStorage.getItem("access");
if (access) {
  try {
    const payload = JSON.parse(atob(access.split(".")[1]));
    if (Date.now() >= payload.exp * 1000) {
      localStorage.clear();
      console.log("Token expired, cleared from localStorage");
    }
  } catch (err) {
    console.error("Failed to parse token:", err);
    localStorage.clear();
  }
}
// --- END TOKEN CHECK ---

const clientId =
  "376149640618-t1s22d2otnf5t0qh9rd2hg996ularb28.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

reportWebVitals();
