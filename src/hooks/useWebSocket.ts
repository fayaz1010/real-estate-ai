// useWebSocket - React hook for subscribing to WebSocket channels
import { useCallback, useEffect, useRef, useState } from "react";

import webSocketService, {
  type WebSocketMessage,
} from "@/services/webSocketService";

interface UseWebSocketOptions {
  channel: string;
  onMessage?: (message: WebSocketMessage) => void;
}

interface UseWebSocketReturn {
  lastMessage: WebSocketMessage | null;
  isConnected: boolean;
}

export function useWebSocket({
  channel,
  onMessage,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(
    webSocketService.getIsConnected(),
  );
  const onMessageRef = useRef(onMessage);

  // Keep onMessage ref up to date without triggering re-subscriptions
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
    onMessageRef.current?.(message);
  }, []);

  useEffect(() => {
    // Ensure connection is active
    webSocketService.connect();

    // Subscribe to channel
    webSocketService.subscribe(channel, handleMessage);

    // Listen for connection state changes
    const unlistenConnection = webSocketService.onConnectionChange(
      (connected) => {
        setIsConnected(connected);
      },
    );

    return () => {
      webSocketService.unsubscribe(channel, handleMessage);
      unlistenConnection();
    };
  }, [channel, handleMessage]);

  return { lastMessage, isConnected };
}

export default useWebSocket;
