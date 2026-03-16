// PLACEHOLDER FILE: components\ApplicationReview\ApplicationTimeline.tsx
// TODO: Add your implementation here
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Shield,
  DollarSign,
} from "lucide-react";
import React from "react";

import { Application } from "../../types/application.types";

interface ApplicationTimelineProps {
  application: Application;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
}) => {
  const events = [
    {
      id: 1,
      type: "created",
      title: "Application Started",
      description: `${application.personalInfo.firstName} ${application.personalInfo.lastName} began filling out the application`,
      timestamp: application.createdAt,
      icon: FileText,
      color: "blue",
    },
    ...(application.submittedAt
      ? [
          {
            id: 2,
            type: "submitted",
            title: "Application Submitted",
            description: "Application was submitted for review",
            timestamp: application.submittedAt,
            icon: CheckCircle,
            color: "green",
          },
        ]
      : []),
    ...(application.identityVerification.verifiedAt
      ? [
          {
            id: 3,
            type: "identity_verified",
            title: "Identity Verified",
            description: "Identity verification completed successfully",
            timestamp: application.identityVerification.verifiedAt,
            icon: User,
            color: "purple",
          },
        ]
      : []),
    ...(application.incomeVerification.verifiedAt
      ? [
          {
            id: 4,
            type: "income_verified",
            title: "Income Verified",
            description: "Income verification completed successfully",
            timestamp: application.incomeVerification.verifiedAt,
            icon: DollarSign,
            color: "green",
          },
        ]
      : []),
    ...(application.creditCheck.pulledAt
      ? [
          {
            id: 5,
            type: "credit_check",
            title: "Credit Check Completed",
            description: `Credit score: ${application.creditCheck.score}`,
            timestamp: application.creditCheck.pulledAt,
            icon: Shield,
            color:
              application.creditCheck.score >= 700
                ? "green"
                : application.creditCheck.score >= 600
                  ? "yellow"
                  : "red",
          },
        ]
      : []),
    ...(application.backgroundCheck.completedAt
      ? [
          {
            id: 6,
            type: "background_check",
            title: "Background Check Completed",
            description:
              application.backgroundCheck.criminalRecords.length === 0 &&
              application.backgroundCheck.evictionRecords.length === 0
                ? "No records found"
                : `${application.backgroundCheck.criminalRecords.length} criminal record(s), ${application.backgroundCheck.evictionRecords.length} eviction(s)`,
            timestamp: application.backgroundCheck.completedAt,
            icon: Shield,
            color:
              application.backgroundCheck.criminalRecords.length === 0
                ? "green"
                : "red",
          },
        ]
      : []),
    ...(application.reviewedAt
      ? [
          {
            id: 7,
            type:
              application.status === "approved"
                ? "approved"
                : application.status === "rejected"
                  ? "rejected"
                  : "reviewed",
            title:
              application.status === "approved"
                ? "Application Approved"
                : application.status === "rejected"
                  ? "Application Rejected"
                  : "Application Reviewed",
            description:
              application.status === "approved"
                ? "Application was approved"
                : application.status === "rejected"
                  ? `Reason: ${application.rejectionReason || "Not specified"}`
                  : "Application review completed",
            timestamp: application.reviewedAt,
            icon:
              application.status === "approved"
                ? CheckCircle
                : application.status === "rejected"
                  ? XCircle
                  : FileText,
            color:
              application.status === "approved"
                ? "green"
                : application.status === "rejected"
                  ? "red"
                  : "blue",
          },
        ]
      : []),
  ].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          border: "border-green-300",
        };
      case "blue":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-300",
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-300",
        };
      case "yellow":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          border: "border-yellow-300",
        };
      case "red":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          border: "border-red-300",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          border: "border-gray-300",
        };
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Application Timeline
        </h3>
        <p className="text-sm text-gray-600">
          Track the progress of this application from submission to decision
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const colors = getColorClasses(event.color);
            const Icon = event.icon;

            return (
              <div key={event.id} className="relative flex items-start">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} border-4 border-white`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <div
                    className={`bg-white border ${colors.border} rounded-lg p-4 shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(event.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Current Status</h4>
            <p className="text-sm text-blue-800">
              Application is currently{" "}
              <span className="font-medium capitalize">
                {application.status.replace("_", " ")}
              </span>
            </p>
            {application.status === "under_review" && (
              <p className="text-sm text-blue-700 mt-2">
                Waiting for landlord review and decision
              </p>
            )}
            {application.status === "verification_pending" && (
              <p className="text-sm text-blue-700 mt-2">
                Waiting for background check and verification to complete
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {(application.status === "submitted" ||
        application.status === "under_review") && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Next Steps</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Review all application details thoroughly</li>
            <li>• Verify employment and income information</li>
            <li>• Check references if needed</li>
            <li>• Review credit and background check results</li>
            <li>• Make a decision: Approve or Reject</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;
