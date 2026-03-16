import React from "react";

import type { InspectionStatus as InspectionStatusType } from "../../types/inspection.types";

interface InspectionStatusProps {
  status: InspectionStatusType;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  InspectionStatusType,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  checked_in: {
    label: "Checked In",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  no_show: {
    label: "No Show",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export const InspectionStatus: React.FC<InspectionStatusProps> = ({
  status,
  size = "md",
}) => {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
};

export default InspectionStatus;
