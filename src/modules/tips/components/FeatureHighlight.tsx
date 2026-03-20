import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useTips } from "./TipsProvider";

import { cn } from "@/lib/utils";

interface FeatureHighlightProps {
  id: string;
  targetElement: string;
  title: string;
  content: string;
  className?: string;
}

export function FeatureHighlight({
  id,
  targetElement,
  title,
  content,
  className,
}: FeatureHighlightProps) {
  const { isDismissed, dismiss, markSeen } = useTips();
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (isDismissed(id)) return;

    const target = document.querySelector(targetElement) as HTMLElement | null;
    if (!target) return;

    const update = () => {
      const rect = target.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    };

    update();
    markSeen(id);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [targetElement, id, isDismissed, markSeen]);

  if (isDismissed(id) || !position) return null;

  return (
    <div
      className={cn("fixed z-50", className)}
      style={{ top: position.top, left: position.left }}
    >
      {/* Pulsing indicator */}
      <span className="absolute -translate-x-1/2 -translate-y-1/2">
        <span
          className="absolute inline-flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-60"
          style={{ backgroundColor: "#008080" }}
        />
        <span
          className="relative inline-flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: "#008080" }}
        />
      </span>

      {/* Info card */}
      <div
        className="absolute left-4 top-4 w-56 rounded-lg p-3 shadow-lg"
        style={{
          backgroundColor: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
          color: "#1A1A2E",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">{title}</p>
          <button
            type="button"
            onClick={() => dismiss(id)}
            className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss highlight"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mt-1 text-xs leading-snug opacity-80">{content}</p>
      </div>
    </div>
  );
}
