// PLACEHOLDER FILE: src/modules/inspections/components/InspectionBooking/BookingConfirmation.tsx
// TODO: Add your implementation here

import {
  CheckCircle,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Share2,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useInspection } from "../../hooks/useInspections";
import { openCalendarApp } from "../../utils/calendarSync";

export const BookingConfirmation: React.FC = () => {
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const navigate = useNavigate();
  const { inspection, isLoading } = useInspection(inspectionId);

  useEffect(() => {
    if (inspectionId) {
      // intentionally empty
    }
  }, [inspectionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-600">Inspection not found</p>
        <button
          onClick={() => navigate("/properties")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddToCalendar = (
    provider: "google" | "outlook" | "apple" | "ics",
  ) => {
    openCalendarApp(inspection, provider);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inspection Request Submitted!
        </h1>
        <p className="text-lg text-gray-600">
          {inspection.status === "confirmed"
            ? "Your inspection has been confirmed"
            : "Waiting for landlord confirmation"}
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Inspection Details
        </h2>

        <div className="space-y-4">
          {/* Property */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {inspection.property?.media?.images?.[0] && (
                <img
                  src={inspection.property.media.images[0].url}
                  alt={inspection.property.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {inspection.property?.title || "Property"}
              </h3>
              <p className="text-sm text-gray-600">
                {inspection.property?.address.street},{" "}
                {inspection.property?.address.city}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(inspection.scheduledDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="font-medium text-gray-900">
                {formatTime(inspection.scheduledDate)}
              </p>
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Inspection Type</p>
            <p className="font-medium text-gray-900 capitalize">
              {inspection.type.replace("_", " ")}
            </p>
          </div>

          {/* Confirmation Number */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {inspection.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleAddToCalendar("google")}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Add to Calendar</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              Download Confirmation
            </span>
          </button>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-4">What Happens Next?</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <div>
              <p className="font-medium text-blue-900">Email Confirmation</p>
              <p className="text-sm text-blue-800">
                You&apos;ll receive an email with all the details and calendar
                invite
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <div>
              <p className="font-medium text-blue-900">Landlord Confirms</p>
              <p className="text-sm text-blue-800">
                The landlord will confirm your inspection (usually within 24
                hours)
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <div>
              <p className="font-medium text-blue-900">Reminders</p>
              <p className="text-sm text-blue-800">
                We&apos;ll send you reminders 24 hours and 2 hours before your
                inspection
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </span>
            <div>
              <p className="font-medium text-blue-900">Attend Inspection</p>
              <p className="text-sm text-blue-800">
                Show up on time with a valid ID and ready to explore!
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Need to Make Changes?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              You can reschedule or cancel your inspection up to 2 hours before
              the scheduled time.
            </p>
            <button
              onClick={() => navigate(`/inspections/${inspection.id}`)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Manage Inspection →
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/inspections")}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          View All Inspections
        </button>
        <button
          onClick={() => navigate("/properties")}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse More Properties
        </button>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Questions? Contact us at{" "}
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
