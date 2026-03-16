import { useState, useEffect } from "react";
import type { TrialStatus } from "../types/trial";
import { getTrialStatus } from "../services/trialService";

export function useTrialStatus() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const status = await getTrialStatus("current-user");
        if (!cancelled) {
          setTrialStatus(status);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  return { trialStatus, isLoading };
}
