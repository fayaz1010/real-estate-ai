// WebSocket Client Service - Real-time communication with backend
import { tokenManager } from "@/modules/auth/utils/tokenManager";

export interface WebSocketMessage {
  channel: string;
  event: string;
  data: unknown;
}

export type ConnectionState = "disconnected" | "connecting" | "connected";

export type MessageType = "text" | "image" | "file";

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  recipientId?: string;
  attachments?: { filename: string; url: string; contentType: string }[];
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface UserPresence {
  userId: string;
  status: "online" | "offline";
  lastSeen?: string;
}

type MessageCallback = (message: WebSocketMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private subscriptions: Map<string, Set<MessageCallback>> = new Map();
  private retryCount = 0;
  private maxRetries = 5;
  private reconnectTimeouts = [1000, 2000, 4000, 8000, 16000];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionState: ConnectionState = "disconnected";
  private usingSse = false;
  private manuallyDisconnected = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private connectionStateListeners: Set<(state: ConnectionState) => void> =
    new Set();

  // Typing indicator state
  private typingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private localTypingTimer: ReturnType<typeof setTimeout> | null = null;
  private typingListeners: Set<(indicator: TypingIndicator) => void> =
    new Set();

  // Presence state
  private onlineUsers: Map<string, UserPresence> = new Map();
  private presenceListeners: Set<(presence: UserPresence) => void> = new Set();

  /**
   * Derive the WebSocket URL from VITE_API_URL or use default
   */
  private getWsUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      const url = new URL(apiUrl);
      const protocol = url.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${url.host}/ws`;
    }
    return "ws://localhost:4041/ws";
  }

  /**
   * Derive the SSE URL from VITE_API_URL or use default
   */
  private getSseUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      return `${apiUrl.replace(/\/$/, "")}/api/events`;
    }
    return "http://localhost:4041/api/events";
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): void {
    this.manuallyDisconnected = false;
    this.retryCount = 0;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.attemptWebSocketConnection();
  }

  /**
   * Disconnect from WebSocket or SSE
   */
  disconnect(): void {
    this.manuallyDisconnected = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Clear all typing timers
    this.typingTimers.forEach((timer) => clearTimeout(timer));
    this.typingTimers.clear();
    if (this.localTypingTimer) {
      clearTimeout(this.localTypingTimer);
      this.localTypingTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.usingSse = false;
    this.onlineUsers.clear();
    this.setConnectionState("disconnected");
  }

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, callback: MessageCallback): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(callback);

    // If connected via WebSocket, send subscription message
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "subscribe", channel }));
    }
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string, callback: MessageCallback): void {
    const subs = this.subscriptions.get(channel);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.subscriptions.delete(channel);
        // Notify server of unsubscription
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "unsubscribe", channel }));
        }
      }
    }
  }

  /**
   * Send a message to a conversation via WebSocket
   */
  sendMessage(payload: SendMessagePayload): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot send message");
      return;
    }

    this.ws.send(
      JSON.stringify({
        type: "message",
        channel: `communication:${payload.conversationId}`,
        data: {
          conversationId: payload.conversationId,
          content: payload.content,
          messageType: payload.messageType || "text",
          recipientId: payload.recipientId,
          attachments: payload.attachments,
        },
      }),
    );

    // Stop typing indicator when message is sent
    this.stopTyping(payload.conversationId);
  }

  /**
   * Send typing indicator for a conversation
   */
  startTyping(conversationId: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Debounce: only send if we haven't sent recently
    if (this.localTypingTimer) return;

    this.ws.send(
      JSON.stringify({
        type: "typing",
        data: { conversationId, isTyping: true },
      }),
    );

    // Auto-stop typing after 3 seconds of inactivity
    this.localTypingTimer = setTimeout(() => {
      this.stopTyping(conversationId);
    }, 3000);
  }

  /**
   * Stop typing indicator for a conversation
   */
  stopTyping(conversationId: string): void {
    if (this.localTypingTimer) {
      clearTimeout(this.localTypingTimer);
      this.localTypingTimer = null;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(
      JSON.stringify({
        type: "typing",
        data: { conversationId, isTyping: false },
      }),
    );
  }

  /**
   * Register a listener for typing indicator changes
   */
  onTypingChange(listener: (indicator: TypingIndicator) => void): () => void {
    this.typingListeners.add(listener);
    return () => {
      this.typingListeners.delete(listener);
    };
  }

  /**
   * Register a listener for user presence changes
   */
  onPresenceChange(listener: (presence: UserPresence) => void): () => void {
    this.presenceListeners.add(listener);
    return () => {
      this.presenceListeners.delete(listener);
    };
  }

  /**
   * Get current online status for a user
   */
  getUserPresence(userId: string): UserPresence | undefined {
    return this.onlineUsers.get(userId);
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    const presence = this.onlineUsers.get(userId);
    return presence?.status === "online";
  }

  /**
   * Get all online users
   */
  getOnlineUsers(): UserPresence[] {
    return Array.from(this.onlineUsers.values()).filter(
      (p) => p.status === "online",
    );
  }

  /**
   * Register a listener for connection state changes
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    // Immediately notify of current state
    listener(this.connectionState === "connected");
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  /**
   * Register a listener for detailed connection state changes
   */
  onConnectionStateChange(
    listener: (state: ConnectionState) => void,
  ): () => void {
    this.connectionStateListeners.add(listener);
    listener(this.connectionState);
    return () => {
      this.connectionStateListeners.delete(listener);
    };
  }

  /**
   * Get current connection status
   */
  getIsConnected(): boolean {
    return this.connectionState === "connected";
  }

  /**
   * Get detailed connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  // --- Private methods ---

  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      const connected = state === "connected";
      this.connectionListeners.forEach((listener) => listener(connected));
      this.connectionStateListeners.forEach((listener) => listener(state));
    }
  }

  private attemptWebSocketConnection(): void {
    this.setConnectionState("connecting");

    try {
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        // Send auth token as first message
        const token = tokenManager.getAccessToken();
        if (token) {
          this.ws!.send(JSON.stringify({ type: "auth", token }));
        }

        this.retryCount = 0;
        this.setConnectionState("connected");

        // Re-subscribe to all active channels
        for (const channel of Array.from(this.subscriptions.keys())) {
          this.ws!.send(JSON.stringify({ type: "subscribe", channel }));
        }

        // Subscribe to presence channel
        this.ws!.send(
          JSON.stringify({ type: "subscribe", channel: "presence" }),
        );
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleIncomingMessage(message);
        } catch {
          // Ignore malformed messages
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        this.setConnectionState("disconnected");
        this.ws = null;

        if (!this.manuallyDisconnected && event.code !== 1000) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // onerror is always followed by onclose, so reconnect logic is there
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private handleIncomingMessage(message: WebSocketMessage): void {
    // Handle typing indicators
    if (message.event === "typing") {
      const indicator = message.data as TypingIndicator;
      this.handleTypingIndicator(indicator);
      return;
    }

    // Handle presence updates
    if (
      message.channel === "presence" ||
      message.event === "presence" ||
      message.event === "user_online" ||
      message.event === "user_offline"
    ) {
      this.handlePresenceUpdate(message);
      return;
    }

    // Dispatch to channel subscribers
    this.dispatchMessage(message);
  }

  private handleTypingIndicator(indicator: TypingIndicator): void {
    const key = `${indicator.conversationId}:${indicator.userId}`;

    // Clear existing timer for this user/conversation
    const existingTimer = this.typingTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.typingTimers.delete(key);
    }

    if (indicator.isTyping) {
      // Auto-expire typing indicator after 4 seconds
      const timer = setTimeout(() => {
        this.typingTimers.delete(key);
        this.typingListeners.forEach((listener) =>
          listener({ ...indicator, isTyping: false }),
        );
      }, 4000);
      this.typingTimers.set(key, timer);
    }

    // Notify listeners
    this.typingListeners.forEach((listener) => listener(indicator));
  }

  private handlePresenceUpdate(message: WebSocketMessage): void {
    const data = message.data as {
      userId: string;
      status?: string;
      lastSeen?: string;
    };
    const presence: UserPresence = {
      userId: data.userId,
      status:
        message.event === "user_offline"
          ? "offline"
          : (data.status as "online" | "offline") || "online",
      lastSeen: data.lastSeen,
    };

    if (presence.status === "online") {
      this.onlineUsers.set(presence.userId, presence);
    } else {
      this.onlineUsers.set(presence.userId, {
        ...presence,
        lastSeen: presence.lastSeen || new Date().toISOString(),
      });
    }

    // Notify listeners
    this.presenceListeners.forEach((listener) => listener(presence));
  }

  private scheduleReconnect(): void {
    if (this.manuallyDisconnected) return;

    if (this.retryCount >= this.maxRetries) {
      // Fall back to SSE
      console.warn(
        "WebSocket connection failed after max retries, falling back to SSE",
      );
      this.connectSse();
      return;
    }

    const delay = this.reconnectTimeouts[this.retryCount] || 16000;
    this.retryCount++;

    this.setConnectionState("connecting");

    this.reconnectTimer = setTimeout(() => {
      this.attemptWebSocketConnection();
    }, delay);
  }

  private connectSse(): void {
    this.usingSse = true;
    this.setConnectionState("connecting");

    const token = tokenManager.getAccessToken();
    const sseUrl = `${this.getSseUrl()}${token ? `?token=${encodeURIComponent(token)}` : ""}`;

    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.setConnectionState("connected");
      };

      this.eventSource.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleIncomingMessage(message);
        } catch {
          // Ignore malformed messages
        }
      };

      this.eventSource.onerror = () => {
        this.setConnectionState("disconnected");
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Retry SSE after a delay if not manually disconnected
        if (!this.manuallyDisconnected) {
          this.reconnectTimer = setTimeout(() => {
            this.connectSse();
          }, 5000);
        }
      };
    } catch {
      this.setConnectionState("disconnected");
    }
  }

  private dispatchMessage(message: WebSocketMessage): void {
    const subs = this.subscriptions.get(message.channel);
    if (subs) {
      subs.forEach((callback) => callback(message));
    }
  }
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
