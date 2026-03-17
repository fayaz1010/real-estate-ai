// useRealtimeMessages - Real-time message updates via WebSocket
import { useCallback, useState } from "react";

import useWebSocket from "@/hooks/useWebSocket";
import type { WebSocketMessage } from "@/services/webSocketService";
import type { Message } from "@/types/communication";

interface UseRealtimeMessagesReturn {
  newMessage: Message | null;
  isConnected: boolean;
}

export function useRealtimeMessages(): UseRealtimeMessagesReturn {
  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.data) {
      setNewMessage(message.data as Message);
    }
  }, []);

  const { isConnected } = useWebSocket({
    channel: "communication:messages",
    onMessage: handleMessage,
  });

  return { newMessage, isConnected };
}

export default useRealtimeMessages;
