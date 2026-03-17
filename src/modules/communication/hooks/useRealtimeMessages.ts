// useRealtimeMessages - Real-time message updates via WebSocket
import { useCallback, useEffect, useState } from "react";

import useWebSocket from "@/hooks/useWebSocket";
import webSocketService, {
  type WebSocketMessage,
  type TypingIndicator,
  type UserPresence,
  type ConnectionState,
} from "@/services/webSocketService";
import type { Message } from "@/types/communication";

interface UseRealtimeMessagesReturn {
  newMessage: Message | null;
  isConnected: boolean;
  connectionState: ConnectionState;
  typingUsers: Map<string, Set<string>>;
  onlineUsers: Map<string, UserPresence>;
  sendTypingIndicator: (conversationId: string) => void;
  stopTypingIndicator: (conversationId: string) => void;
  isUserOnline: (userId: string) => boolean;
}

export function useRealtimeMessages(): UseRealtimeMessagesReturn {
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  // Map<conversationId, Set<userId>>
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(
    new Map(),
  );
  const [onlineUsers, setOnlineUsers] = useState<Map<string, UserPresence>>(
    new Map(),
  );

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.event === "new_message" && message.data) {
      setNewMessage(message.data as Message);
    }
  }, []);

  const { isConnected } = useWebSocket({
    channel: "communication:messages",
    onMessage: handleMessage,
  });

  // Listen for typing indicators
  useEffect(() => {
    const unsubscribe = webSocketService.onTypingChange(
      (indicator: TypingIndicator) => {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          const users = new Set(next.get(indicator.conversationId) || []);

          if (indicator.isTyping) {
            users.add(indicator.userId);
          } else {
            users.delete(indicator.userId);
          }

          if (users.size === 0) {
            next.delete(indicator.conversationId);
          } else {
            next.set(indicator.conversationId, users);
          }

          return next;
        });
      },
    );

    return unsubscribe;
  }, []);

  // Listen for presence changes
  useEffect(() => {
    const unsubscribe = webSocketService.onPresenceChange(
      (presence: UserPresence) => {
        setOnlineUsers((prev) => {
          const next = new Map(prev);
          next.set(presence.userId, presence);
          return next;
        });
      },
    );

    return unsubscribe;
  }, []);

  // Listen for connection state changes
  useEffect(() => {
    const unsubscribe = webSocketService.onConnectionStateChange(
      (state: ConnectionState) => {
        setConnectionState(state);
      },
    );

    return unsubscribe;
  }, []);

  const sendTypingIndicator = useCallback((conversationId: string) => {
    webSocketService.startTyping(conversationId);
  }, []);

  const stopTypingIndicator = useCallback((conversationId: string) => {
    webSocketService.stopTyping(conversationId);
  }, []);

  const isUserOnline = useCallback(
    (userId: string) => {
      const presence = onlineUsers.get(userId);
      return presence?.status === "online";
    },
    [onlineUsers],
  );

  return {
    newMessage,
    isConnected,
    connectionState,
    typingUsers,
    onlineUsers,
    sendTypingIndicator,
    stopTypingIndicator,
    isUserOnline,
  };
}

export default useRealtimeMessages;
