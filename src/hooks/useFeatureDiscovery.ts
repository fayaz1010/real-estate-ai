import { useCallback, useEffect, useState } from "react";

import { getTips, updateTip } from "@/services/tipsService";
import { Tip } from "@/types/tips";

export function useFeatureDiscovery(userId: string = "current-user") {
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    getTips(userId).then(setTips);
  }, [userId]);

  const undismissedTips = tips.filter((t) => !t.dismissed);

  const dismissTip = useCallback(async (tipId: string, reason: string) => {
    const updated = await updateTip(tipId, { dismissed: true, reason });
    setTips((prev) => prev.map((t) => (t.id === tipId ? updated : t)));
  }, []);

  return { tips, undismissedTips, dismissTip };
}
