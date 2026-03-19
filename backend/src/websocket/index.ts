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
  type: "auth" | "subscribe" | "unsubscribe" | "message" | "typing";
  token?: string;
  channel?: string;
  data?: Record<string, unknown>;
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

              // Broadcast user online status
              broadcastPresence(user.userId, "online");
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

              // If subscribing to presence channel, send current online users
              if (message.channel === "presence") {
                const onlineUserIds = new Set<string>();
                clients.forEach((c) => {
                  if (c.user && c.user.userId) {
                    onlineUserIds.add(c.user.userId);
                  }
                });
                onlineUserIds.forEach((userId) => {
                  ws.send(
                    JSON.stringify({
                      channel: "presence",
                      event: "user_online",
                      data: { userId, status: "online" },
                    }),
                  );
                });
              }
            }
            break;
          }

          case "unsubscribe": {
            if (message.channel) {
              client.channels.delete(message.channel);
            }
            break;
          }

          case "message": {
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
            handleDirectMessage(client, message);
            break;
          }

          case "typing": {
            if (!authenticated) return;
            handleTypingIndicator(client, message);
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
      if (authenticated && client.user) {
        broadcastPresence(client.user.userId, "offline");
      }
      clients.delete(ws);
    });

    ws.on("error", () => {
      clearTimeout(authTimeout);
      if (authenticated && client.user) {
        broadcastPresence(client.user.userId, "offline");
      }
      clients.delete(ws);
    });
  });

  // Heartbeat to detect stale connections (every 30 seconds)
  heartbeatInterval = setInterval(() => {
    clients.forEach((client, ws) => {
      if (!client.isAlive) {
        if (client.user) {
          broadcastPresence(client.user.userId, "offline");
        }
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
 * Handle a direct message from a client
 */
function handleDirectMessage(
  sender: AuthenticatedClient,
  message: IncomingMessage,
): void {
  if (!message.data) return;

  const { conversationId, content, messageType, recipientId, attachments } =
    message.data;

  if (!conversationId || !content) return;

  const outgoingPayload = {
    channel: "communication:messages",
    event: "new_message",
    data: {
      conversationId,
      content,
      messageType: messageType || "text",
      senderId: sender.user.userId,
      senderRole: sender.user.role,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
    },
  };

  // If a specific recipient, send only to that user
  if (recipientId) {
    sendToUser(
      recipientId as string,
      "communication:messages",
      "new_message",
      outgoingPayload.data,
    );
    // Also echo back to sender
    sender.ws.send(JSON.stringify(outgoingPayload));
  } else {
    // Broadcast to all subscribers on the channel
    broadcast("communication:messages", "new_message", outgoingPayload.data);
  }
}

/**
 * Handle typing indicator from a client
 */
function handleTypingIndicator(
  sender: AuthenticatedClient,
  message: IncomingMessage,
): void {
  if (!message.data) return;

  const { conversationId, isTyping } = message.data;
  if (!conversationId) return;

  const payload = {
    channel: "communication:messages",
    event: "typing",
    data: {
      conversationId,
      userId: sender.user.userId,
      isTyping: !!isTyping,
    },
  };

  const payloadStr = JSON.stringify(payload);

  // Send to all clients subscribed to the communication channel, except sender
  clients.forEach((client) => {
    if (
      client.ws !== sender.ws &&
      client.channels.has("communication:messages") &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(payloadStr);
    }
  });
}

/**
 * Broadcast presence change to all clients on the presence channel
 */
function broadcastPresence(userId: string, status: "online" | "offline"): void {
  const payload = JSON.stringify({
    channel: "presence",
    event: status === "online" ? "user_online" : "user_offline",
    data: {
      userId,
      status,
      lastSeen: status === "offline" ? new Date().toISOString() : undefined,
    },
  });

  clients.forEach((client) => {
    if (
      client.channels.has("presence") &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(payload);
    }
  });

  // Also broadcast to SSE clients
  broadcastToSse(
    "presence",
    status === "online" ? "user_online" : "user_offline",
    { userId, status },
  );
}

/**
 * Broadcast a message to all clients subscribed to a channel
 */
export function broadcast(channel: string, event: string, data: unknown): void {
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
  data: unknown,
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
function broadcastToSse(channel: string, event: string, data: unknown): void {
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
