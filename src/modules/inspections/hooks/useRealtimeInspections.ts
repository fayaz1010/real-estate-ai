// useRealtimeInspections - Real-time inspection updates via WebSocket
import { useCallback, useState } from "react";

import useWebSocket from "@/hooks/useWebSocket";
import type { WebSocketMessage } from "@/services/webSocketService";

interface InspectionUpdate {
  [key: string]: any;
}

interface UseRealtimeInspectionsReturn {
  inspectionUpdate: InspectionUpdate | null;
  isConnected: boolean;
}

export function useRealtimeInspections(): UseRealtimeInspectionsReturn {
  const [inspectionUpdate, setInspectionUpdate] =
    useState<InspectionUpdate | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.data) {
      setInspectionUpdate(message.data as InspectionUpdate);
    }
  }, []);

  const { isConnected } = useWebSocket({
    channel: "inspections:updates",
    onMessage: handleMessage,
  });

  return { inspectionUpdate, isConnected };
}

export default useRealtimeInspections;
