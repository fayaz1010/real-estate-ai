import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTips } from "./TipsProvider";

interface TooltipProps {
  id: string;
  targetElement: string;
  title: string;
  content: string;
  className?: string;
}

export function Tooltip({ id, targetElement, title, content, className }: TooltipProps) {
  const { markSeen } = useTips();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.querySelector(targetElement);
    if (!target) return;

    const show = () => {
      const rect = (target as HTMLElement).getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setVisible(true);
      markSeen(id);
    };

    const hide = () => setVisible(false);

    target.addEventListener("mouseenter", show);
    target.addEventListener("focus", show);
    target.addEventListener("mouseleave", hide);
    target.addEventListener("blur", hide);

    return () => {
      target.removeEventListener("mouseenter", show);
      target.removeEventListener("focus", show);
      target.removeEventListener("mouseleave", hide);
      target.removeEventListener("blur", hide);
    };
  }, [targetElement, id, markSeen]);

  if (!visible) return null;

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      className={cn(
        "pointer-events-none fixed z-50 max-w-xs -translate-x-1/2 rounded-md px-3 py-2 shadow-md",
        className,
      )}
      style={{
        top: position.top,
        left: position.left,
        backgroundColor: "#f1f3f4",
        fontFamily: "'Open Sans', sans-serif",
        color: "#091a2b",
      }}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs leading-snug opacity-80">{content}</p>
    </div>
  );
}
