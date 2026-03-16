import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Clock,
} from "lucide-react";
import React from "react";

import { Application } from "../../types/application.types";

interface BackgroundCheckProps {
  application: Application;
}

const BackgroundCheck: React.FC<BackgroundCheckProps> = ({ application }) => {
  const backgroundCheck = application.backgroundCheck;

  if (!backgroundCheck) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Background check not initiated</p>
      </div>
    );
  }

  const isClean =
    backgroundCheck.criminalRecords.length === 0 &&
    backgroundCheck.evictionRecords.length === 0 &&
    !backgroundCheck.sexOffenderCheck;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div
        className={`rounded-lg p-6 border-2 ${
          backgroundCheck.status === "verified" && isClean
            ? "bg-green-50 border-green-500"
            : backgroundCheck.status === "verified" && !isClean
              ? "bg-yellow-50 border-yellow-500"
              : backgroundCheck.status === "in_progress"
                ? "bg-blue-50 border-blue-500"
                : backgroundCheck.status === "failed"
                  ? "bg-red-50 border-red-500"
                  : "bg-gray-50 border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {backgroundCheck.status === "verified" && isClean && (
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            )}
            {backgroundCheck.status === "verified" && !isClean && (
              <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            )}
            {backgroundCheck.status === "in_progress" && (
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
            )}
            {backgroundCheck.status === "failed" && (
              <XCircle className="w-8 h-8 text-red-600 mr-3" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Background Check
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {backgroundCheck.status.replace("_", " ")}
              </p>
            </div>
          </div>
          <Shield
            className={`w-12 h-12 ${
              isClean && backgroundCheck.status === "verified"
                ? "text-green-600"
                : "text-gray-400"
            }`}
          />
        </div>

        {backgroundCheck.status === "verified" && isClean && (
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <p className="font-semibold text-green-900">Clean Record</p>
            <p className="text-sm text-green-800">
              No criminal records, evictions, or sex offender registry matches
              found
            </p>
          </div>
        )}
      </div>

      {/* Report Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">
            Background Check Details
          </h4>
          {backgroundCheck.reportUrl && (
            <a
              href={backgroundCheck.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Report
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Provider</p>
            <p className="font-medium text-gray-900 capitalize">
              {backgroundCheck.provider}
            </p>
          </div>
          {backgroundCheck.completedAt && (
            <div>
              <p className="text-gray-600">Completed</p>
              <p className="font-medium text-gray-900">
                {new Date(backgroundCheck.completedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium text-gray-900 capitalize">
              {backgroundCheck.status.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Sex Offender Check</p>
            <div className="flex items-center">
              {backgroundCheck.sexOffenderCheck ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                  <span className="font-medium text-red-700">Match Found</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="font-medium text-green-700">Clear</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Criminal Records */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Criminal Records</h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              backgroundCheck.criminalRecords.length === 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {backgroundCheck.criminalRecords.length} Record(s)
          </span>
        </div>

        {backgroundCheck.criminalRecords.length === 0 ? (
          <div className="flex items-center text-green-700 bg-green-50 rounded-lg p-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              No criminal records found
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {backgroundCheck.criminalRecords.map((record, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                    <span className="font-medium text-red-900 capitalize">
                      {record.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{record.date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {record.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Jurisdiction:</span>{" "}
                    {record.jurisdiction}
                  </div>
                  <div>
                    <span className="font-medium">Disposition:</span>{" "}
                    {record.disposition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Eviction Records */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Eviction Records</h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              backgroundCheck.evictionRecords.length === 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {backgroundCheck.evictionRecords.length} Record(s)
          </span>
        </div>

        {backgroundCheck.evictionRecords.length === 0 ? (
          <div className="flex items-center text-green-700 bg-green-50 rounded-lg p-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              No eviction records found
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {backgroundCheck.evictionRecords.map((record, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                    <span className="font-medium text-red-900">
                      Eviction Case
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {record.filedDate}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Court:</span>
                    <span className="ml-2 text-gray-900">{record.court}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 text-gray-900 capitalize">
                      {record.status}
                    </span>
                  </div>
                  {record.amount && (
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 text-gray-900">
                        ${record.amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div
        className={`rounded-lg p-6 ${
          isClean
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <h4 className="font-semibold text-gray-900 mb-2">
          Background Check Summary
        </h4>
        <p className="text-sm text-gray-700">
          {isClean
            ? "This applicant has a clean background with no criminal records, evictions, or sex offender registry matches. The background check supports approval."
            : "This applicant has items in their background check that require review. Please carefully consider all factors before making a decision."}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Background checks are provided by{" "}
          {backgroundCheck.provider} and include criminal records, eviction
          history, and sex offender registry checks. This information is
          confidential and must be used in compliance with Fair Housing laws.
          Some records may be expunged, sealed, or legally restricted from
          consideration in housing decisions. Consult with legal counsel if
          needed.
        </p>
      </div>
    </div>
  );
};

export default BackgroundCheck;
