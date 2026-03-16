// PLACEHOLDER FILE: components\Verification\EmploymentVerification.tsx
// TODO: Add your implementation here

import {
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";

import { useApplicationForm } from "../../hooks/useApplicationForm";
import { useVerification } from "../../hooks/useVerification";

interface EmploymentVerificationProps {
  applicationId: string;
}

const EmploymentVerification: React.FC<EmploymentVerificationProps> = ({
  applicationId,
}) => {
  const { employmentStatus, startEmploymentVerification, loading } =
    useVerification(applicationId);
  const { formData } = useApplicationForm();

  const [selectedEmployer, setSelectedEmployer] = useState<number>(0);
  const employment = formData.employment || [];

  const handleVerify = async () => {
    if (employment.length === 0) {
      alert("No employment information available");
      return;
    }

    const emp = employment[selectedEmployer];

    try {
      await startEmploymentVerification({
        employerName: emp.employerName || "",
        jobTitle: emp.jobTitle || "",
        startDate: emp.startDate || "",
        supervisorName: emp.supervisorName,
        supervisorPhone: emp.supervisorPhone,
        supervisorEmail: emp.supervisorEmail,
      });
      alert("Verification request sent to your employer");
    } catch (error) {
      alert("Verification failed");
    }
  };

  if (employmentStatus === "verified") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Employment Verified
            </h3>
            <p className="text-sm text-green-700">
              Your employment has been successfully verified
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (employment.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <AlertCircle className="w-6 h-6 text-yellow-600 mb-2" />
        <p className="text-yellow-800">
          Please add your employment information before verification
        </p>
      </div>
    );
  }

  const currentEmployer = employment[selectedEmployer];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Employment Verification
        </h2>
        <p className="text-gray-600">
          Verify your employment to strengthen your application
        </p>
      </div>

      {/* Status Badge */}
      {employmentStatus !== "not_started" && (
        <div
          className={`rounded-lg p-4 flex items-center ${
            employmentStatus === "pending" || employmentStatus === "in_progress"
              ? "bg-yellow-50 border border-yellow-200"
              : employmentStatus === "failed"
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
          }`}
        >
          {(employmentStatus === "pending" ||
            employmentStatus === "in_progress") && (
            <Clock className="w-6 h-6 text-yellow-600 mr-3" />
          )}
          {employmentStatus === "failed" && (
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          )}
          <div>
            <p className="font-medium text-gray-900 capitalize">
              {employmentStatus.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-600">
              {employmentStatus === "pending" &&
                "Waiting for employer response"}
              {employmentStatus === "in_progress" && "Verification in progress"}
              {employmentStatus === "failed" &&
                "Verification could not be completed"}
            </p>
          </div>
        </div>
      )}

      {/* Employer Selection */}
      {employment.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employer to Verify
          </label>
          <select
            value={selectedEmployer}
            onChange={(e) => setSelectedEmployer(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {employment.map((emp, index) => (
              <option key={index} value={index}>
                {emp.employerName} - {emp.jobTitle}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Employment Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start mb-4">
          <Briefcase className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {currentEmployer.jobTitle}
            </h3>
            <p className="text-gray-600">{currentEmployer.employerName}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentEmployer.verificationStatus === "verified"
                ? "bg-green-100 text-green-800"
                : currentEmployer.verificationStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {currentEmployer.verificationStatus?.replace("_", " ") ||
              "Not Verified"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Employment Type</p>
            <p className="font-medium text-gray-900 capitalize">
              {currentEmployer.employmentType?.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="font-medium text-gray-900">
              {currentEmployer.startDate}
            </p>
          </div>
          {!currentEmployer.isCurrent && (
            <div>
              <p className="text-gray-600">End Date</p>
              <p className="font-medium text-gray-900">
                {currentEmployer.endDate}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium text-gray-900">
              {currentEmployer.isCurrent ? "Current" : "Past"}
            </p>
          </div>
        </div>
      </div>

      {/* Supervisor Information */}
      {(currentEmployer.supervisorName ||
        currentEmployer.supervisorPhone ||
        currentEmployer.supervisorEmail) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            Supervisor Contact
          </h4>
          <div className="space-y-2 text-sm">
            {currentEmployer.supervisorName && (
              <div className="flex items-center text-blue-800">
                <Briefcase className="w-4 h-4 mr-2" />
                {currentEmployer.supervisorName}
              </div>
            )}
            {currentEmployer.supervisorPhone && (
              <div className="flex items-center text-blue-800">
                <Phone className="w-4 h-4 mr-2" />
                {currentEmployer.supervisorPhone}
              </div>
            )}
            {currentEmployer.supervisorEmail && (
              <div className="flex items-center text-blue-800">
                <Mail className="w-4 h-4 mr-2" />
                {currentEmployer.supervisorEmail}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification Methods */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Verification Process
        </h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                We&apos;ll Contact Your Employer
              </p>
              <p className="text-sm text-gray-600">
                We&apos;ll reach out to verify your employment status and dates
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Supervisor Confirmation
              </p>
              <p className="text-sm text-gray-600">
                Your supervisor will confirm your role and tenure
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Verification Complete</p>
              <p className="text-sm text-gray-600">
                Usually completed within 1-2 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleVerify}
        disabled={
          loading ||
          currentEmployer.verificationStatus === "verified" ||
          currentEmployer.verificationStatus === "pending"
        }
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Clock className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : currentEmployer.verificationStatus === "verified" ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Already Verified
          </>
        ) : currentEmployer.verificationStatus === "pending" ? (
          <>
            <Clock className="w-5 h-5 mr-2" />
            Verification Pending
          </>
        ) : (
          "Request Employment Verification"
        )}
      </button>

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Verification Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Make sure your supervisor&apos;s contact information is accurate</li>
          <li>• Give your supervisor a heads up about the verification</li>
          <li>• Verification typically takes 1-2 business days</li>
          <li>• You&apos;ll be notified once verification is complete</li>
        </ul>
      </div>
    </div>
  );
};

export default EmploymentVerification;
