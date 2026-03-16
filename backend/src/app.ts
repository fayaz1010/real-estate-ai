// Express App Configuration
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/env";
import { swaggerDocument } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import routes from "./routes";

const app: Application = express();

// Security Middleware
app.use(helmet());
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

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;
