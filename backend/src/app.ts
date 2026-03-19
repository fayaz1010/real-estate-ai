// Express App Configuration
import path from "path";

import * as Sentry from "@sentry/node";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/env";
import { swaggerDocument } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { securityMiddleware } from "./middleware/security";
import routes from "./routes";

const app: Application = express();

// Trust first proxy (Nginx) for correct client IP in rate limiting & secure cookies
app.set("trust proxy", 1);

// Initialize Sentry for error tracking (must be early, before routes)
if (config.sentryDsn && config.sentryDsn !== "REPLACE_WITH_SENTRY_DSN") {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.nodeEnv,
    release: `real-estate-ai@${process.env.npm_package_version || "1.0.0"}`,
    tracesSampleRate: 0.1,
  });
}

// Security Middleware - base helmet (CSP, HSTS, XSS are toggled separately via env vars)
app.use(
  helmet({
    contentSecurityPolicy: false, // Toggled via CSP_ENABLED
    hsts: false, // Toggled via HSTS_ENABLED
    xssFilter: false, // Toggled via XSS_PROTECTION_ENABLED
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self)",
  );
  next();
});

// Cookie parser (required for CSRF double-submit cookie pattern)
app.use(cookieParser());

// Toggleable security middleware (CSRF, CSP, HSTS, XSS via env vars)
app.use(securityMiddleware());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);

// Rate Limiting Middleware
app.use(rateLimiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression Middleware
app.use(compression());

// Logging Middleware
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger/API Documentation
if (config.swaggerEnabled) {
  app.get("/api-docs/swagger.json", (_req, res) => {
    res.json(swaggerDocument);
  });
  app.get("/api-docs", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>API Documentation - Real Estate Platform</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>SwaggerUIBundle({ url: '/api-docs/swagger.json', dom_id: '#swagger-ui' });</script>
</body>
</html>`);
  });
  console.log(
    `📚 API Docs available at http://localhost:${config.port}/api-docs`,
  );
}

// Sentry debug/test route
app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api", routes);

// Serve frontend static files in production
if (config.nodeEnv === "production") {
  const frontendPath = path.resolve(__dirname, "../../dist");
  app.use(express.static(frontendPath));

  // SPA fallback - serve index.html for any non-API route
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // 404 Handler (dev only - frontend runs on separate port)
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });
}

// Sentry error handler (must be before other error middleware)
Sentry.setupExpressErrorHandler(app);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
