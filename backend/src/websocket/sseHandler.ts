// SSE (Server-Sent Events) Fallback Handler
import { randomUUID } from "crypto";

import { Router, type Request, type Response } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { registerSseClient, removeSseClient } from "./index";

const router = Router();

/**
 * GET /api/events - SSE endpoint for real-time event streaming
 * Accepts a ?token= query parameter for authentication
 */
router.get("/api/events", (req: Request, res: Response) => {
  const token = req.query.token as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  let userId: string;
  try {
    const payload = verifyAccessToken(token);
    userId = payload.userId;
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // Disable nginx buffering
  });

  // Send initial connection event
  res.write(
    `data: ${JSON.stringify({ channel: "system", event: "connected", data: { userId } })}\n\n`,
  );

  // Register this SSE client
  const clientId = randomUUID();
  registerSseClient({ id: clientId, res, userId });

  // Keep alive with periodic comments (every 30 seconds)
  const keepAlive = setInterval(() => {
    try {
      res.write(": keepalive\n\n");
    } catch {
      clearInterval(keepAlive);
    }
  }, 30000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    removeSseClient(clientId);
  });
});

export default router;
