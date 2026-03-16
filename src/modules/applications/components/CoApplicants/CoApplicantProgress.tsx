// PLACEHOLDER FILE: components\CoApplicants\CoApplicantProgress.tsx
// TODO: Add your implementation here

import { CheckCircle, Clock, Mail, AlertCircle } from "lucide-react";
import React from "react";

import { CoApplicant } from "../../types/application.types";

interface CoApplicantProgressProps {
  coApplicants: CoApplicant[];
}

const CoApplicantProgress: React.FC<CoApplicantProgressProps> = ({
  coApplicants,
}) => {
  if (coApplicants.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No co-applicants added</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "invited":
        return <Mail className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const completedCount = coApplicants.filter(
    (ca) => ca.status === "completed",
  ).length;
  const progressPercentage = (completedCount / coApplicants.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Co-Applicant Progress
        </h3>
        <p className="text-sm text-gray-600">
          {completedCount} of {coApplicants.length} co-applicants completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Co-Applicants List */}
      <div className="space-y-3">
        {coApplicants.map((coApp) => (
          <div
            key={coApp.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {getStatusIcon(coApp.status)}
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{coApp.email}</p>
                  <p className="text-sm text-gray-600 capitalize mb-2">
                    {coApp.relationship}
                  </p>

                  {/* Status Details */}
                  {coApp.status === "invited" && (
                    <p className="text-sm text-blue-700">
                      Invitation sent on{" "}
                      {new Date(coApp.invitedAt).toLocaleDateString()}
                    </p>
                  )}
                  {coApp.status === "in_progress" && (
                    <p className="text-sm text-yellow-700">
                      Started on{" "}
                      {new Date(coApp.invitedAt).toLocaleDateString()}
                    </p>
                  )}
                  {coApp.status === "completed" && coApp.completedAt && (
                    <p className="text-sm text-green-700">
                      Completed on{" "}
                      {new Date(coApp.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  coApp.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : coApp.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {coApp.status === "completed"
                  ? "Completed"
                  : coApp.status === "in_progress"
                    ? "In Progress"
                    : "Pending"}
              </span>
            </div>

            {/* Completion Details */}
            {coApp.status === "completed" && coApp.personalInfo && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {coApp.personalInfo.firstName}{" "}
                      {coApp.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employment</p>
                    <p className="font-medium text-gray-900">
                      {coApp.employment && coApp.employment.length > 0
                        ? coApp.employment[0].employerName
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className={`rounded-lg p-4 ${
          completedCount === coApplicants.length
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div className="flex items-start">
          {completedCount === coApplicants.length ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-gray-900 mb-1">
              {completedCount === coApplicants.length
                ? "All Co-Applicants Complete"
                : "Waiting for Co-Applicants"}
            </p>
            <p className="text-sm text-gray-700">
              {completedCount === coApplicants.length
                ? "All co-applicants have completed their sections. Your application is ready for submission."
                : `${coApplicants.length - completedCount} co-applicant(s) still need to complete their information.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoApplicantProgress;
