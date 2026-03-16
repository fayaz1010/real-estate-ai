// PLACEHOLDER FILE: components\ApplicationWizard\ApplicationWizard.tsx
// TODO: Add your implementation here
import { Check, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import React, { useState } from "react";

import { useApplication } from "../../hooks/useApplication";
import { useApplicationForm } from "../../hooks/useApplicationForm";

import BackgroundConsentStep from "./BackgroundConsentStep";
import DocumentUploadStep from "./DocumentUploadStep";
import EmploymentStep from "./EmploymentStep";
import IncomeVerificationStep from "./IncomeVerificationStep";
import PersonalInfoStep from "./PersonalInfoStep";
import ReferencesStep from "./ReferencesStep";
import RentalHistoryStep from "./RentalHistoryStep";
import ReviewSubmitStep from "./ReviewSubmitStep";

interface ApplicationWizardProps {
  propertyId: string;
  onComplete?: () => void;
}

const STEPS = [
  { id: 0, name: "Personal Info", icon: "user" },
  { id: 1, name: "Employment", icon: "briefcase" },
  { id: 2, name: "Income", icon: "dollar-sign" },
  { id: 3, name: "Rental History", icon: "home" },
  { id: 4, name: "References", icon: "users" },
  { id: 5, name: "Background Check", icon: "shield" },
  { id: 6, name: "Documents", icon: "file-text" },
  { id: 7, name: "Review & Submit", icon: "check-circle" },
];

const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  propertyId,
  onComplete,
}) => {
  const { create, submit, application, submitting } = useApplication();
  const {
    currentStep,
    formData,
    nextStep,
    previousStep,
    goToStep,
    isStepComplete,
    getStepCompletion,
    formCompletion,
    realTimeScore,
    scoreRating,
    saving,
  } = useApplicationForm();

  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  // Initialize application on mount
  React.useEffect(() => {
    if (!application) {
      create(propertyId);
    }
  }, [application, propertyId, create]);

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];

    switch (step) {
      case 0: // Personal Info
        if (!formData.personalInfo?.firstName)
          errors.push("First name is required");
        if (!formData.personalInfo?.lastName)
          errors.push("Last name is required");
        if (!formData.personalInfo?.email) errors.push("Email is required");
        if (!formData.personalInfo?.phone) errors.push("Phone is required");
        if (!formData.personalInfo?.dateOfBirth)
          errors.push("Date of birth is required");
        if (!formData.personalInfo?.ssn) errors.push("SSN is required");
        break;

      case 1: // Employment
        if (!formData.employment || formData.employment.length === 0) {
          errors.push("At least one employment history is required");
        }
        break;

      case 2: // Income
        if (!formData.income || formData.income.length === 0) {
          errors.push("At least one income source is required");
        }
        break;

      case 3: // Rental History
        if (!formData.rentalHistory || formData.rentalHistory.length === 0) {
          errors.push("At least one rental history entry is required");
        }
        break;

      case 4: // References
        if (!formData.references || formData.references.length < 2) {
          errors.push("At least 2 references are required");
        }
        break;

      case 5: // Background Consent
        if (!formData.backgroundConsentGiven) {
          errors.push("Background check consent is required");
        }
        break;
    }

    setStepErrors((prev) => ({ ...prev, [step]: errors }));
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleBack = () => {
    previousStep();
  };

  const handleSubmit = async () => {
    if (!application) return;

    // Validate all steps
    let allValid = true;
    for (let i = 0; i < 7; i++) {
      if (!validateStep(i)) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      try {
        await submit(application.id);
        onComplete?.();
      } catch (error) {
        console.error("Failed to submit application:", error);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <EmploymentStep />;
      case 2:
        return <IncomeVerificationStep />;
      case 3:
        return <RentalHistoryStep />;
      case 4:
        return <ReferencesStep />;
      case 5:
        return <BackgroundConsentStep />;
      case 6:
        return <DocumentUploadStep />;
      case 7:
        return <ReviewSubmitStep onSubmit={handleSubmit} />;
      default:
        return <PersonalInfoStep />;
    }
  };

  const getScoreColor = () => {
    if (realTimeScore >= 90) return "text-green-600";
    if (realTimeScore >= 75) return "text-blue-600";
    if (realTimeScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Score */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Rental Application
            </h1>
            <p className="text-gray-600 mt-1">
              Complete all steps to submit your application
            </p>
          </div>

          {/* Real-time Score Badge */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {realTimeScore}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {scoreRating.label} Applicant
            </div>
            <div className="text-xs text-gray-500">
              {formCompletion()}% Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${formCompletion()}%` }}
          />
        </div>

        {saving && (
          <div className="mt-2 text-sm text-gray-600 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
            Saving...
          </div>
        )}
      </div>

      {/* Step Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                onClick={() => goToStep(step.id)}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  currentStep === step.id
                    ? "scale-110"
                    : currentStep > step.id
                      ? "opacity-75"
                      : "opacity-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isStepComplete(step.id)
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isStepComplete(step.id) ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id + 1}</span>
                  )}
                </div>
                <span className="text-xs text-center font-medium">
                  {step.name}
                </span>
                <span className="text-xs text-gray-500">
                  {getStepCompletion(step.id)}%
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-2">
                  <div
                    className="h-1 bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${
                        currentStep > step.id
                          ? 100
                          : currentStep === step.id
                            ? 50
                            : 0
                      }%`,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Errors */}
      {stepErrors[currentStep] && stepErrors[currentStep].length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Please complete the following:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {stepErrors[currentStep].map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {STEPS.length}
        </div>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Check className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;
