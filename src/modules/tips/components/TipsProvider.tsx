import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "realestate-tips-state";

interface TipState {
  seen: boolean;
  dismissed: boolean;
}

interface TipsContextValue {
  tipStates: Record<string, TipState>;
  markSeen: (tipId: string) => void;
  dismiss: (tipId: string) => void;
  resetAll: () => void;
  isSeen: (tipId: string) => boolean;
  isDismissed: (tipId: string) => boolean;
}

const TipsContext = createContext<TipsContextValue | null>(null);

function loadState(): Record<string, TipState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: Record<string, TipState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function TipsProvider({ children }: { children: React.ReactNode }) {
  const [tipStates, setTipStates] =
    useState<Record<string, TipState>>(loadState);

  useEffect(() => {
    saveState(tipStates);
  }, [tipStates]);

  const markSeen = useCallback((tipId: string) => {
    setTipStates((prev) => ({
      ...prev,
      [tipId]: {
        ...prev[tipId],
        seen: true,
        dismissed: prev[tipId]?.dismissed ?? false,
      },
    }));
  }, []);

  const dismiss = useCallback((tipId: string) => {
    setTipStates((prev) => ({
      ...prev,
      [tipId]: { seen: true, dismissed: true },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setTipStates({});
  }, []);

  const isSeen = useCallback(
    (tipId: string) => !!tipStates[tipId]?.seen,
    [tipStates],
  );

  const isDismissed = useCallback(
    (tipId: string) => !!tipStates[tipId]?.dismissed,
    [tipStates],
  );

  const value = useMemo<TipsContextValue>(
    () => ({ tipStates, markSeen, dismiss, resetAll, isSeen, isDismissed }),
    [tipStates, markSeen, dismiss, resetAll, isSeen, isDismissed],
  );

  return <TipsContext.Provider value={value}>{children}</TipsContext.Provider>;
}

export function useTips(): TipsContextValue {
  const ctx = useContext(TipsContext);
  if (!ctx) {
    throw new Error("useTips must be used within a <TipsProvider>");
  }
  return ctx;
}
