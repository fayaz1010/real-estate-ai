// useWebSocket - React hook for subscribing to WebSocket channels
import { useCallback, useEffect, useRef, useState } from "react";

import webSocketService, {
  type WebSocketMessage,
  type ConnectionState,
} from "@/services/webSocketService";

interface UseWebSocketOptions {
  channel: string;
  onMessage?: (message: WebSocketMessage) => void;
}

interface UseWebSocketReturn {
  lastMessage: WebSocketMessage | null;
  isConnected: boolean;
  connectionState: ConnectionState;
}

export function useWebSocket({
  channel,
  onMessage,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(
    webSocketService.getIsConnected(),
  );
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    webSocketService.getConnectionState(),
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

    const unlistenState = webSocketService.onConnectionStateChange((state) => {
      setConnectionState(state);
    });

    return () => {
      webSocketService.unsubscribe(channel, handleMessage);
      unlistenConnection();
      unlistenState();
    };
  }, [channel, handleMessage]);

  return { lastMessage, isConnected, connectionState };
}

export default useWebSocket;
