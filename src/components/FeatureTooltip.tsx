import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  getContextTip,
  markTipAsDismissed,
  shouldShowTip,
} from "@/services/tipsService";

interface FeatureTooltipProps {
  tipId: string;
  targetElementId: string;
  currentContext: string;
  className?: string;
}

type Placement = "top" | "bottom" | "left" | "right";

interface Position {
  top: number;
  left: number;
  placement: Placement;
}

function computePosition(
  targetEl: HTMLElement,
  tooltipEl: HTMLElement,
): Position {
  const targetRect = targetEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const gap = 12;

  // Prefer bottom placement; fall back to top, right, left
  const spaceBelow = window.innerHeight - targetRect.bottom;
  const spaceAbove = targetRect.top;
  const spaceRight = window.innerWidth - targetRect.right;
  const spaceLeft = targetRect.left;

  let placement: Placement = "bottom";
  let top = 0;
  let left = 0;

  if (spaceBelow >= tooltipRect.height + gap) {
    placement = "bottom";
    top = targetRect.bottom + gap + scrollY;
    left =
      targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollX;
  } else if (spaceAbove >= tooltipRect.height + gap) {
    placement = "top";
    top = targetRect.top - tooltipRect.height - gap + scrollY;
    left =
      targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollX;
  } else if (spaceRight >= tooltipRect.width + gap) {
    placement = "right";
    top =
      targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + scrollY;
    left = targetRect.right + gap + scrollX;
  } else if (spaceLeft >= tooltipRect.width + gap) {
    placement = "left";
    top =
      targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + scrollY;
    left = targetRect.left - tooltipRect.width - gap + scrollX;
  } else {
    // Fallback: below, clamped
    placement = "bottom";
    top = targetRect.bottom + gap + scrollY;
    left =
      targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollX;
  }

  // Clamp horizontal
  left = Math.max(
    8,
    Math.min(left, window.innerWidth - tooltipRect.width - 8 + scrollX),
  );

  return { top, left, placement };
}

const arrowClasses: Record<Placement, string> = {
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#FFFFFF]",
  top: "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#FFFFFF]",
  right:
    "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[#FFFFFF]",
  left: "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#FFFFFF]",
};

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  tipId,
  targetElementId,
  currentContext,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const tip = getContextTip(tipId);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (dontShowAgain) {
      markTipAsDismissed(tipId);
    }
  }, [tipId, dontShowAgain]);

  const dismissPermanently = useCallback(() => {
    markTipAsDismissed(tipId);
    setVisible(false);
  }, [tipId]);

  // Check visibility on mount
  useEffect(() => {
    if (!tip) return;
    if (!shouldShowTip(tipId, currentContext)) return;

    // Wait a tick for the target element to be in the DOM
    const timer = setTimeout(() => {
      const target = document.getElementById(targetElementId);
      if (target) {
        setVisible(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [tipId, targetElementId, currentContext, tip]);

  // Compute position whenever visible
  useEffect(() => {
    if (!visible) return;

    function updatePosition() {
      const target = document.getElementById(targetElementId);
      const tooltip = tooltipRef.current;
      if (!target || !tooltip) return;
      setPosition(computePosition(target, tooltip));
    }

    // Initial position
    requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible, targetElementId]);

  if (!tip || !visible) return null;

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-label={tip.title}
      className={cn(
        "absolute z-50 w-80 rounded-xl border border-[#008080]/15 shadow-lg transition-opacity duration-200",
        position ? "opacity-100" : "opacity-0",
        className,
      )}
      style={
        position
          ? {
              top: position.top,
              left: position.left,
              backgroundColor: "#FFFFFF",
            }
          : { top: -9999, left: -9999, backgroundColor: "#FFFFFF" }
      }
    >
      {/* Arrow */}
      {position && (
        <span
          className={cn("absolute h-0 w-0", arrowClasses[position.placement])}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
        <h4
          className="font-display text-sm font-semibold"
          style={{ color: "#1A1A2E" }}
        >
          {tip.title}
        </h4>
        <button
          onClick={dismissPermanently}
          className="shrink-0 rounded-md p-1 transition-colors hover:bg-[#008080]/10"
          style={{ color: "#008080" }}
          aria-label="Dismiss tip"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <p
        className="px-4 pb-3 font-body text-sm leading-relaxed"
        style={{ color: "#1A1A2E", opacity: 0.75 }}
      >
        {tip.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#008080]/10 px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-[#A0926B] accent-[#C4A882]"
          />
          <span
            className="font-body text-xs"
            style={{ color: "#1A1A2E", opacity: 0.6 }}
          >
            Don&apos;t show again
          </span>
        </label>
        <button
          onClick={dismiss}
          className="rounded-lg px-4 py-1.5 font-body text-xs font-medium text-white transition-colors hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#C4A882" }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};
