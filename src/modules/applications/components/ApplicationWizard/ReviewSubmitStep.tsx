// PLACEHOLDER FILE: components\ApplicationWizard\ReviewSubmitStep.tsx
// TODO: Add your implementation here
import {
  CheckCircle,
  AlertCircle,
  Edit,
  User,
  Briefcase,
  DollarSign,
  Home,
  Users,
  Shield,
  FileText,
} from "lucide-react";
import React from "react";

import { useApplication } from "../../hooks/useApplication";
import { useApplicationForm } from "../../hooks/useApplicationForm";
import { maskSSN } from "../../utils/applicationValidation";

interface ReviewSubmitStepProps {
  onSubmit: () => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ onSubmit }) => {
  const { formData, goToStep, realTimeScore, scoreRating } =
    useApplicationForm();
  const { application, submitting } = useApplication();

  const personalInfo = formData.personalInfo;
  const employment = formData.employment || [];
  const income = formData.income || [];
  const rentalHistory = formData.rentalHistory || [];
  const references = formData.references || [];
  const documents = application?.documents || [];

  const completionChecks = [
    {
      label: "Personal Information",
      complete: !!personalInfo?.firstName && !!personalInfo?.lastName,
      step: 0,
    },
    { label: "Employment History", complete: employment.length > 0, step: 1 },
    { label: "Income Information", complete: income.length > 0, step: 2 },
    { label: "Rental History", complete: rentalHistory.length > 0, step: 3 },
    { label: "References", complete: references.length >= 2, step: 4 },
    {
      label: "Background Consent",
      complete: !!formData.backgroundConsentGiven,
      step: 5,
    },
    { label: "Documents Uploaded", complete: documents.length > 0, step: 6 },
  ];

  const allComplete = completionChecks.every((check) => check.complete);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit Application
        </h2>
        <p className="text-gray-600">
          Please review all information before submitting your application.
        </p>
      </div>

      {/* Application Score */}
      <div
        className={`rounded-lg p-6 ${
          realTimeScore >= 90
            ? "bg-green-50 border-2 border-green-500"
            : realTimeScore >= 75
              ? "bg-blue-50 border-2 border-blue-500"
              : realTimeScore >= 60
                ? "bg-yellow-50 border-2 border-yellow-500"
                : "bg-red-50 border-2 border-red-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Your Application Score
            </p>
            <p
              className={`text-4xl font-bold ${
                realTimeScore >= 90
                  ? "text-green-700"
                  : realTimeScore >= 75
                    ? "text-blue-700"
                    : realTimeScore >= 60
                      ? "text-yellow-700"
                      : "text-red-700"
              }`}
            >
              {realTimeScore} / 100
            </p>
            <p className="text-sm mt-1 font-medium">
              {scoreRating.label} Applicant
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{scoreRating.description}</p>
          </div>
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Application Checklist
        </h3>
        <div className="space-y-3">
          {completionChecks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center">
                {check.complete ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                )}
                <span
                  className={
                    check.complete
                      ? "text-gray-900"
                      : "text-red-700 font-medium"
                  }
                >
                  {check.label}
                </span>
              </div>
              {!check.complete && (
                <button
                  onClick={() => goToStep(check.step)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Personal Information Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <button
            onClick={() => goToStep(0)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {personalInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">
                {personalInfo.firstName} {personalInfo.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{personalInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{personalInfo.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="font-medium">{personalInfo.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-gray-600">SSN</p>
              <p className="font-medium">{maskSSN(personalInfo.ssn || "")}</p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-medium">
                {personalInfo.currentAddress?.street},{" "}
                {personalInfo.currentAddress?.city},{" "}
                {personalInfo.currentAddress?.state}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Employment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Employment ({employment.length})
          </h3>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {employment.map((emp, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <p className="font-medium">
              {emp.jobTitle} at {emp.employerName}
            </p>
            <p className="text-sm text-gray-600">
              {emp.employmentType?.replace("_", " ").toUpperCase()} •{" "}
              {emp.isCurrent ? "Current" : `Ended ${emp.endDate}`}
            </p>
          </div>
        ))}
      </div>

      {/* Income Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Income Sources ({income.length})
          </h3>
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {income.map((inc, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <p className="font-medium capitalize">
              {inc.source?.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-600">
              ${inc.amount} / {inc.frequency}
            </p>
          </div>
        ))}
      </div>

      {/* Rental History Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Rental History ({rentalHistory.length})
          </h3>
          <button
            onClick={() => goToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {rentalHistory.map((rental, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <p className="font-medium">{rental.address?.street}</p>
            <p className="text-sm text-gray-600">
              {rental.address?.city}, {rental.address?.state} • $
              {rental.monthlyRent}/mo
            </p>
          </div>
        ))}
      </div>

      {/* References Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            References ({references.length})
          </h3>
          <button
            onClick={() => goToStep(4)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {references.map((ref, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <p className="font-medium">{ref.name}</p>
            <p className="text-sm text-gray-600 capitalize">
              {ref.relationship?.replace("_", " ")} • {ref.phone}
            </p>
          </div>
        ))}
      </div>

      {/* Documents Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Documents ({documents.length})
          </h3>
          <button
            onClick={() => goToStep(6)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center text-sm">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <span>{doc.filename}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No documents uploaded</p>
        )}
      </div>

      {/* Warning if incomplete */}
      {!allComplete && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <p className="font-semibold text-red-900 mb-1">
                Application Incomplete
              </p>
              <p className="text-sm text-red-800">
                Please complete all required sections before submitting your
                application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Certification</h4>
        <p className="text-sm text-gray-700">
          By submitting this application, I certify that all information
          provided is true and accurate to the best of my knowledge. I
          understand that any false information may result in the rejection of
          my application or termination of tenancy.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={!allComplete || submitting}
        className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold flex items-center justify-center"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
            Submitting Application...
          </>
        ) : (
          <>
            <CheckCircle className="w-6 h-6 mr-3" />
            Submit Application
          </>
        )}
      </button>
    </div>
  );
};

export default ReviewSubmitStep;
