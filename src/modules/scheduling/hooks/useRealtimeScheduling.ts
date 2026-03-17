// useRealtimeScheduling - Real-time scheduling/booking updates via WebSocket
import { useCallback, useState } from "react";

import useWebSocket from "@/hooks/useWebSocket";
import type { WebSocketMessage } from "@/services/webSocketService";

type SchedulingUpdate = Record<string, unknown>;

interface UseRealtimeSchedulingReturn {
  schedulingUpdate: SchedulingUpdate | null;
  isConnected: boolean;
}

export function useRealtimeScheduling(): UseRealtimeSchedulingReturn {
  const [schedulingUpdate, setSchedulingUpdate] =
    useState<SchedulingUpdate | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.data) {
      setSchedulingUpdate(message.data as SchedulingUpdate);
    }
  }, []);

  const { isConnected } = useWebSocket({
    channel: "scheduling:bookings",
    onMessage: handleMessage,
  });

  return { schedulingUpdate, isConnected };
}

export default useRealtimeScheduling;
