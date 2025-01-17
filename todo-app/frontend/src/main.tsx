import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/browser";
import App from "./App";
import "./index.css";

if (import.meta.env.VITE_GLITCHTIP_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_GLITCHTIP_DSN,
    environment: import.meta.env.VITE_APP_ENV,
    enabled: import.meta.env.PROD,
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Nicht senden wenn wir in development sind
      if (import.meta.env.DEV) {
        console.log("Sentry Event:", event);
        return null;
      }
      return event;
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
