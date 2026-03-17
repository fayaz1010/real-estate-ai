// useRealtimeTenantUpdates - Real-time tenant dashboard updates via WebSocket
import { useCallback, useState } from "react";

import useWebSocket from "@/hooks/useWebSocket";
import type { WebSocketMessage } from "@/services/webSocketService";

interface TenantUpdate {
  [key: string]: any;
}

interface UseRealtimeTenantUpdatesReturn {
  tenantUpdate: TenantUpdate | null;
  isConnected: boolean;
}

export function useRealtimeTenantUpdates(): UseRealtimeTenantUpdatesReturn {
  const [tenantUpdate, setTenantUpdate] = useState<TenantUpdate | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.data) {
      setTenantUpdate(message.data as TenantUpdate);
    }
  }, []);

  const { isConnected } = useWebSocket({
    channel: "tenant-portal:dashboard",
    onMessage: handleMessage,
  });

  return { tenantUpdate, isConnected };
}

export default useRealtimeTenantUpdates;
