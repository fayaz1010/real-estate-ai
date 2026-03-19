// Server Entry Point
import http from "http";

import app from "./app";
import prisma from "./config/database";
import { config } from "./config/env";
import { verifyEmailConnection } from "./utils/emailService";
import { initWebSocket } from "./websocket";
import sseRouter from "./websocket/sseHandler";

const PORT = config.port;

// Create HTTP server from Express app so WebSocket can attach to it
const server = http.createServer(app);

// Mount SSE fallback route
app.use(sseRouter);

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected");

    // Verify email (SendGrid SMTP) connection
    const emailOk = await verifyEmailConnection();
    console.log(emailOk ? "✅ Email service connected (SendGrid)" : "⚠️ Email service not verified (check SENDGRID_API_KEY)");

    // Initialize WebSocket server
    initWebSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
