import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  type ContextTip,
  getAllContextTips,
  markTipAsDismissed,
  shouldShowTip,
} from "@/services/tipsService";

interface OnboardingTourProps {
  /** Current page/context — only tips matching this context start the tour */
  currentContext?: string;
  /** Called when the tour ends (completed or skipped) */
  onComplete?: () => void;
  className?: string;
}

type Placement = "top" | "bottom" | "left" | "right";

interface Position {
  top: number;
  left: number;
  placement: Placement;
}

const TOUR_COMPLETED_KEY = "realEstateAI_tourCompleted";

function isTourCompleted(): boolean {
  return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
}

function markTourCompleted(): void {
  localStorage.setItem(TOUR_COMPLETED_KEY, "true");
}

function computePosition(
  targetEl: HTMLElement,
  tooltipEl: HTMLElement,
): Position {
  const targetRect = targetEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const gap = 14;

  const spaceBelow = window.innerHeight - targetRect.bottom;
  const spaceAbove = targetRect.top;

  let placement: Placement;
  let top: number;
  let left: number;

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
  } else {
    placement = "bottom";
    top = targetRect.bottom + gap + scrollY;
    left =
      targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollX;
  }

  left = Math.max(
    8,
    Math.min(left, window.innerWidth - tooltipRect.width - 8 + scrollX),
  );

  return { top, left, placement };
}

const arrowClasses: Record<Placement, string> = {
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#FAF6F1]",
  top: "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#FAF6F1]",
  right:
    "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[#FAF6F1]",
  left: "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#FAF6F1]",
};

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  currentContext,
  onComplete,
  className,
}) => {
  const [steps, setSteps] = useState<ContextTip[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [active, setActive] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Build tour steps on mount
  useEffect(() => {
    if (isTourCompleted()) return;

    const allTips = getAllContextTips();
    const availableSteps = currentContext
      ? allTips.filter((tip) => shouldShowTip(tip.id, currentContext))
      : allTips.filter((tip) =>
          tip.contexts.some((ctx) => shouldShowTip(tip.id, ctx)),
        );

    if (availableSteps.length > 0) {
      setSteps(availableSteps);
      // Delay start slightly so target elements are rendered
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentContext]);

  const currentTip = steps[currentStep];

  // Position tooltip on the current step's target
  useEffect(() => {
    if (!active || !currentTip) return;

    function updatePosition() {
      const target = document.getElementById(currentTip.targetElementId);
      const tooltip = tooltipRef.current;
      if (!target || !tooltip) return;

      // Scroll target into view
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      requestAnimationFrame(() => {
        if (!tooltipRef.current) return;
        setPosition(computePosition(target, tooltipRef.current));
      });
    }

    // Small delay after scroll
    const timer = setTimeout(updatePosition, 300);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, [active, currentStep, currentTip]);

  const endTour = useCallback(() => {
    markTourCompleted();
    setActive(false);
    onComplete?.();
  }, [onComplete]);

  const skipTour = useCallback(() => {
    // Dismiss all tour tips
    steps.forEach((step) => markTipAsDismissed(step.id));
    endTour();
  }, [steps, endTour]);

  const goNext = useCallback(() => {
    // Dismiss current tip
    if (currentTip) {
      markTipAsDismissed(currentTip.id);
    }
    if (currentStep < steps.length - 1) {
      setPosition(null);
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, steps.length, currentTip, endTour]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setPosition(null);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  if (!active || !currentTip || steps.length === 0) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-200"
        aria-hidden="true"
        onClick={skipTour}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}: ${currentTip.title}`}
        aria-modal="true"
        className={cn(
          "absolute z-50 w-80 rounded-xl border border-[#8B7355]/15 shadow-xl transition-opacity duration-200",
          position ? "opacity-100" : "opacity-0",
          className,
        )}
        style={
          position
            ? {
                top: position.top,
                left: position.left,
                backgroundColor: "#FAF6F1",
              }
            : { top: -9999, left: -9999, backgroundColor: "#FAF6F1" }
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
        <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-1">
          <div>
            <span
              className="mb-1 inline-block rounded-full px-2 py-0.5 font-body text-xs font-medium"
              style={{ backgroundColor: "#C4A882", color: "#fff" }}
            >
              {currentStep + 1} / {steps.length}
            </span>
            <h4
              className="mt-1 font-display text-sm font-semibold"
              style={{ color: "#2D2A26" }}
            >
              {currentTip.title}
            </h4>
          </div>
          <button
            onClick={skipTour}
            className="shrink-0 rounded-md p-1 transition-colors hover:bg-[#8B7355]/10"
            style={{ color: "#8B7355" }}
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <p
          className="px-4 py-2 font-body text-sm leading-relaxed"
          style={{ color: "#2D2A26", opacity: 0.75 }}
        >
          {currentTip.description}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[#8B7355]/10 px-4 py-3">
          <button
            onClick={skipTour}
            className="font-body text-xs transition-colors hover:underline"
            style={{ color: "#8B7355" }}
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={goPrev}
                className="flex items-center gap-1 rounded-lg border border-[#8B7355]/20 px-3 py-1.5 font-body text-xs font-medium transition-colors hover:bg-[#8B7355]/5 active:scale-95"
                style={{ color: "#8B7355" }}
                aria-label="Previous step"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            <button
              onClick={goNext}
              className="flex items-center gap-1 rounded-lg px-4 py-1.5 font-body text-xs font-medium text-white transition-colors hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#C4A882" }}
              aria-label={isLast ? "Finish tour" : "Next step"}
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
