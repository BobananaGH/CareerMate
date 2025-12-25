import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoginRegister from "./components/LoginRegister";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";

const clientId =
  "376149640618-t1s22d2otnf5t0qh9rd2hg996ularb28.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <LoginRegister />
  </GoogleOAuthProvider>
);
reportWebVitals();
