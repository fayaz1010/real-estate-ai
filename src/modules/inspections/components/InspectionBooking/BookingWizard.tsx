import { Check } from "lucide-react";
import React from "react";

import { useInspectionBooking } from "../../hooks/useInspectionBooking";

import { AttendeeForm } from "./AttendeeForm";
import { BookingSummary } from "./BookingSummary";
import { DateTimeSelector } from "./DateTimeSelector";
import { InspectionTypeSelector } from "./InspectionTypeSelector";
import { PropertySelection } from "./PropertySelection";

const STEPS = [
  { id: 0, name: "Property", description: "Select property" },
  { id: 1, name: "Type", description: "Inspection type" },
  { id: 2, name: "Date & Time", description: "Choose slot" },
  { id: 3, name: "Details", description: "Add attendees" },
];

export const BookingWizard: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    completionPercentage,
    propertyId,
    type,
    preferredDate,
    preferredTimeSlot,
    attendees,
    tenantNotes,
    errors,
    isSubmitting,
    updateBookingData,
    addAttendee,
    removeAttendee,
    updateAttendee,
    nextStep,
    prevStep,
    submitBooking,
  } = useInspectionBooking();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertySelection
            selectedPropertyId={propertyId}
            onSelect={(id) => updateBookingData({ propertyId: id })}
          />
        );
      case 1:
        return (
          <InspectionTypeSelector
            selectedType={type}
            onSelect={(selectedType) =>
              updateBookingData({ type: selectedType })
            }
          />
        );
      case 2:
        return (
          <DateTimeSelector
            propertyId={propertyId!}
            selectedDate={preferredDate}
            selectedTime={preferredTimeSlot}
            onDateSelect={(date) => updateBookingData({ preferredDate: date })}
            onTimeSelect={(time) =>
              updateBookingData({ preferredTimeSlot: time })
            }
            errors={{
              date: errors.preferredDate,
              time: errors.preferredTimeSlot,
            }}
          />
        );
      case 3:
        return (
          <AttendeeForm
            attendees={attendees}
            tenantNotes={tenantNotes}
            onAddAttendee={addAttendee}
            onRemoveAttendee={removeAttendee}
            onUpdateAttendee={updateAttendee}
            onNotesChange={(notes) => updateBookingData({ tenantNotes: notes })}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Book Inspection</h2>
          <span className="text-sm text-gray-600">
            {completionPercentage}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep > step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : currentStep === step.id
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {renderStep()}
      </div>

      {/* Summary Sidebar (visible on final steps) */}
      {currentStep >= 2 && (
        <div className="mb-6">
          <BookingSummary
            propertyId={propertyId}
            type={type}
            preferredDate={preferredDate}
            preferredTimeSlot={preferredTimeSlot}
            attendees={attendees}
          />
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submitBooking}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Need help? Contact our support team at{" "}
        <a
          href="mailto:support@realestate.com"
          className="text-blue-600 hover:underline"
        >
          support@realestate.com
        </a>
      </p>
    </div>
  );
};
