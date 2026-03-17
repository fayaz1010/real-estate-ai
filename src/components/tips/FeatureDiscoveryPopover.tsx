import React, { useEffect, useRef, useState } from "react";

import { TipCard } from "./TipCard";
import { TipsNotificationBell } from "./TipsNotificationBell";

import { useFeatureDiscovery } from "@/hooks/useFeatureDiscovery";
import { cn } from "@/lib/utils";

interface FeatureDiscoveryPopoverProps {
  className?: string;
}

export const FeatureDiscoveryPopover: React.FC<
  FeatureDiscoveryPopoverProps
> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { undismissedTips, dismissTip } = useFeatureDiscovery();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <TipsNotificationBell
        count={undismissedTips.length}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-primary/10 bg-white shadow-lg">
          <div className="border-b border-primary/10 px-5 py-4">
            <h3 className="font-display text-base font-semibold text-primary">
              Feature Discovery
            </h3>
            <p className="mt-0.5 font-body text-sm text-primary/60">
              Tips and features tailored to your portfolio.
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto p-3">
            {undismissedTips.length === 0 ? (
              <p className="px-2 py-6 text-center font-body text-sm text-primary/50">
                You&apos;re all caught up — no new tips right now.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {undismissedTips
                  .sort((a, b) => b.relevanceScore - a.relevanceScore)
                  .map((tip) => (
                    <TipCard key={tip.id} tip={tip} onDismiss={dismissTip} />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
