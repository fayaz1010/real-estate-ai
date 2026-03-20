import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./app.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: import.meta.env.MODE,
  release: `real-estate-ai@${import.meta.env.VITE_APP_VERSION || "1.0.0"}`,
  // Performance Monitoring — capture 10% of transactions
  tracesSampleRate: 0.1,
  // Session Replay — 10% of sessions, 100% on error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled:
    !!import.meta.env.VITE_SENTRY_DSN &&
    import.meta.env.VITE_SENTRY_DSN !== "REPLACE_WITH_SENTRY_DSN",
});

function FallbackUI() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        color: "#1A1A2E",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: "1rem", maxWidth: "28rem", lineHeight: 1.6 }}>
        We encountered an unexpected error. Please try refreshing the page. If
        the problem persists, contact our support team.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "1.5rem",
          padding: "0.625rem 1.5rem",
          backgroundColor: "#008080",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Refresh Page
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<FallbackUI />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
