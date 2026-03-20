import { Clock, Loader, CheckCircle2, XCircle } from "lucide-react";
import React from "react";

import type { ScreeningRequest } from "@/types/screening";

interface BackgroundCheckStatusProps {
  status: ScreeningRequest["status"];
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-500",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
  },
} as const;

export const BackgroundCheckStatus: React.FC<BackgroundCheckStatusProps> = ({
  status,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}
    >
      <Icon
        className={`w-4 h-4 ${config.iconColor} ${status === "in_progress" ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span
        className={`text-sm font-medium ${config.textColor}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {config.label}
      </span>
    </div>
  );
};
