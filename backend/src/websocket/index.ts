// WebSocket Server - Real-time communication hub
import http from "http";

import { WebSocket, WebSocketServer } from "ws";

import { verifyAccessToken, type JwtPayload } from "../utils/jwt";

interface AuthenticatedClient {
  ws: WebSocket;
  user: JwtPayload;
  channels: Set<string>;
  isAlive: boolean;
}

interface IncomingMessage {
  type: "auth" | "subscribe" | "unsubscribe";
  token?: string;
  channel?: string;
}

const clients: Map<WebSocket, AuthenticatedClient> = new Map();

let wss: WebSocketServer;
let heartbeatInterval: ReturnType<typeof setInterval>;

/**
 * Initialize the WebSocket server attached to an existing HTTP server
 */
export function initWebSocket(server: http.Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    // Start unauthenticated - client must send auth message first
    const client: AuthenticatedClient = {
      ws,
      user: null as unknown as JwtPayload,
      channels: new Set(),
      isAlive: true,
    };

    let authenticated = false;

    // Set a timeout for authentication (10 seconds)
    const authTimeout = setTimeout(() => {
      if (!authenticated) {
        ws.close(4001, "Authentication timeout");
      }
    }, 10000);

    ws.on("pong", () => {
      if (clients.has(ws)) {
        clients.get(ws)!.isAlive = true;
      }
    });

    ws.on("message", (raw: Buffer | string) => {
      try {
        const message: IncomingMessage = JSON.parse(raw.toString());

        switch (message.type) {
          case "auth": {
            if (!message.token) {
              ws.close(4002, "No token provided");
              return;
            }
            try {
              const user = verifyAccessToken(message.token);
              client.user = user;
              authenticated = true;
              clearTimeout(authTimeout);
              clients.set(ws, client);
              ws.send(
                JSON.stringify({
                  channel: "system",
                  event: "authenticated",
                  data: { userId: user.userId },
                }),
              );
            } catch {
              ws.close(4003, "Invalid token");
            }
            break;
          }

          case "subscribe": {
            if (!authenticated) {
              ws.send(
                JSON.stringify({
                  channel: "system",
                  event: "error",
                  data: { message: "Not authenticated" },
                }),
              );
              return;
            }
            if (message.channel) {
              client.channels.add(message.channel);
            }
            break;
          }

          case "unsubscribe": {
            if (message.channel) {
              client.channels.delete(message.channel);
            }
            break;
          }

          default:
            break;
        }
      } catch {
        // Ignore malformed messages
      }
    });

    ws.on("close", () => {
      clearTimeout(authTimeout);
      clients.delete(ws);
    });

    ws.on("error", () => {
      clearTimeout(authTimeout);
      clients.delete(ws);
    });
  });

  // Heartbeat to detect stale connections (every 30 seconds)
  heartbeatInterval = setInterval(() => {
    clients.forEach((client, ws) => {
      if (!client.isAlive) {
        clients.delete(ws);
        ws.terminate();
        return;
      }
      client.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  console.log("WebSocket server initialized on /ws");
  return wss;
}

/**
 * Broadcast a message to all clients subscribed to a channel
 */
export function broadcast(channel: string, event: string, data: any): void {
  const payload = JSON.stringify({ channel, event, data });

  clients.forEach((client) => {
    if (
      client.channels.has(channel) &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(payload);
    }
  });

  // Also broadcast to SSE clients
  broadcastToSse(channel, event, data);
}

/**
 * Send a message to a specific user on a channel
 */
export function sendToUser(
  userId: string,
  channel: string,
  event: string,
  data: any,
): void {
  const payload = JSON.stringify({ channel, event, data });

  clients.forEach((client) => {
    if (
      client.user.userId === userId &&
      client.channels.has(channel) &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(payload);
    }
  });
}

// --- SSE support ---

interface SseClient {
  id: string;
  res: import("express").Response;
  userId: string;
}

const sseClients: Map<string, SseClient> = new Map();

/**
 * Register an SSE client (called from sseHandler)
 */
export function registerSseClient(client: SseClient): void {
  sseClients.set(client.id, client);
}

/**
 * Remove an SSE client (called from sseHandler)
 */
export function removeSseClient(id: string): void {
  sseClients.delete(id);
}

/**
 * Broadcast to all SSE clients
 */
function broadcastToSse(channel: string, event: string, data: any): void {
  const payload = JSON.stringify({ channel, event, data });

  sseClients.forEach((client) => {
    try {
      client.res.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client.id);
    }
  });
}

export { clients, sseClients };
