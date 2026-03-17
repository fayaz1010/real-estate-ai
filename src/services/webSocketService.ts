// WebSocket Client Service - Real-time communication with backend
import { tokenManager } from "@/modules/auth/utils/tokenManager";

export interface WebSocketMessage {
  channel: string;
  event: string;
  data: any;
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
  private isConnected = false;
  private usingSse = false;
  private manuallyDisconnected = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

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

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.usingSse = false;
    this.setConnected(false);
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
   * Register a listener for connection state changes
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    // Immediately notify of current state
    listener(this.isConnected);
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  /**
   * Get current connection status
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // --- Private methods ---

  private setConnected(connected: boolean): void {
    if (this.isConnected !== connected) {
      this.isConnected = connected;
      this.connectionListeners.forEach((listener) => listener(connected));
    }
  }

  private attemptWebSocketConnection(): void {
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
        this.setConnected(true);

        // Re-subscribe to all active channels
        for (const channel of Array.from(this.subscriptions.keys())) {
          this.ws!.send(JSON.stringify({ type: "subscribe", channel }));
        }
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.dispatchMessage(message);
        } catch {
          // Ignore malformed messages
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        this.setConnected(false);
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

    this.reconnectTimer = setTimeout(() => {
      this.attemptWebSocketConnection();
    }, delay);
  }

  private connectSse(): void {
    this.usingSse = true;

    const token = tokenManager.getAccessToken();
    const sseUrl = `${this.getSseUrl()}${token ? `?token=${encodeURIComponent(token)}` : ""}`;

    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.setConnected(true);
      };

      this.eventSource.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.dispatchMessage(message);
        } catch {
          // Ignore malformed messages
        }
      };

      this.eventSource.onerror = () => {
        this.setConnected(false);
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
      this.setConnected(false);
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
