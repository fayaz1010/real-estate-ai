import { Bell } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface TipsNotificationBellProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export const TipsNotificationBell: React.FC<TipsNotificationBellProps> = ({
  count,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-md p-2 text-primary/60 transition-colors hover:bg-primary/5 hover:text-primary",
        className,
      )}
      aria-label={`Tips${count > 0 ? ` (${count} new)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-body text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
};
