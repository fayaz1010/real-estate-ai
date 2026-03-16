// PLACEHOLDER FILE: components\Shared\ApplicationStatus.tsx
// TODO: Add your implementation here

import {
  FileText,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Send,
} from "lucide-react";
import React from "react";

import { ApplicationStatus as StatusType } from "../../types/application.types";

interface ApplicationStatusProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  status,
  size = "md",
  showIcon = true,
  showLabel = true,
}) => {
  const getConfig = () => {
    switch (status) {
      case "draft":
        return {
          icon: FileText,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-600",
          label: "Draft",
        };
      case "submitted":
        return {
          icon: Send,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          iconColor: "text-blue-600",
          label: "Submitted",
        };
      case "under_review":
        return {
          icon: Search,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          iconColor: "text-yellow-600",
          label: "Under Review",
        };
      case "verification_pending":
        return {
          icon: Clock,
          color: "bg-purple-100 text-purple-800 border-purple-200",
          iconColor: "text-purple-600",
          label: "Verification Pending",
        };
      case "conditionally_approved":
        return {
          icon: UserCheck,
          color: "bg-teal-100 text-teal-800 border-teal-200",
          iconColor: "text-teal-600",
          label: "Conditionally Approved",
        };
      case "approved":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          iconColor: "text-green-600",
          label: "Approved",
        };
      case "approved_with_conditions":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          iconColor: "text-green-600",
          label: "Approved with Conditions",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          iconColor: "text-red-600",
          label: "Rejected",
        };
      case "withdrawn":
        return {
          icon: AlertTriangle,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-600",
          label: "Withdrawn",
        };
      default:
        return {
          icon: FileText,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          iconColor: "text-gray-600",
          label: "Unknown",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
    },
    md: {
      badge: "px-3 py-1 text-sm",
      icon: "w-4 h-4",
    },
    lg: {
      badge: "px-4 py-2 text-base",
      icon: "w-5 h-5",
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses[size].badge}`}
    >
      {showIcon && (
        <Icon
          className={`${sizeClasses[size].icon} ${config.iconColor} ${showLabel ? "mr-1.5" : ""}`}
        />
      )}
      {showLabel && config.label}
    </span>
  );
};

export default ApplicationStatus;
