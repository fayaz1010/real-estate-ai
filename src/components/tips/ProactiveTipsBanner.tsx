import { Lightbulb, X } from "lucide-react";
import React from "react";

import { useFeatureDiscovery } from "@/hooks/useFeatureDiscovery";
import { cn } from "@/lib/utils";

const RELEVANCE_THRESHOLD = 70;

interface ProactiveTipsBannerProps {
  className?: string;
}

export const ProactiveTipsBanner: React.FC<ProactiveTipsBannerProps> = ({
  className,
}) => {
  const { undismissedTips, dismissTip } = useFeatureDiscovery();

  const topTip = undismissedTips
    .filter((t) => t.relevanceScore > RELEVANCE_THRESHOLD)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)[0];

  if (!topTip) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3",
        className,
      )}
    >
      <Lightbulb className="h-5 w-5 shrink-0 text-accent" />

      <div className="min-w-0 flex-1">
        <span className="font-display text-sm font-semibold text-primary">
          {topTip.title}
        </span>
        <p className="truncate font-body text-sm text-primary/60">
          {topTip.description}
        </p>
      </div>

      <a
        href={topTip.ctaLink}
        className="shrink-0 rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        {topTip.ctaText}
      </a>

      <button
        onClick={() => dismissTip(topTip.id, "Dismissed from banner")}
        className="shrink-0 rounded-md p-1 text-primary/40 transition-colors hover:bg-primary/5 hover:text-primary/70"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
