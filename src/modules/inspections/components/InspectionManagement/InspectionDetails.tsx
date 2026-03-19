// PLACEHOLDER FILE: src/modules/inspections/components/InspectionManagement/InspectionDetails.tsx
// TODO: Add your implementation here

import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Edit,
  X,
  Video,
  Key,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useInspection } from "../../hooks/useInspections";
import { openCalendarApp } from "../../utils/calendarSync";

import { CancelModal } from "./CancelModal";
import { CheckInOut } from "./CheckInOut";
import { InspectionStatus } from "./InspectionStatusBadge";
import { RescheduleModal } from "./RescheduleModal";

export const InspectionDetails: React.FC = () => {
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const navigate = useNavigate();
  const {
    inspection,
    isLoading,
    setCurrentInspection: _setCurrentInspection,
  } = useInspection(inspectionId);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (inspectionId) {
      // Inspection is already loaded via selector
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
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-600 mb-4">Inspection not found</p>
        <button
          onClick={() => navigate("/inspections")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Inspections
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const canModify =
    inspection.status === "pending" || inspection.status === "confirmed";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/inspections")}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-1"
        >
          ← Back to Inspections
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inspection Details
            </h1>
            <p className="text-gray-600">
              Confirmation: {inspection.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <InspectionStatus status={inspection.status} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Property
            </h2>
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {inspection.property?.media?.images?.[0] && (
                  <img
                    src={inspection.property.media.images[0].url}
                    alt={inspection.property.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {inspection.property?.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {inspection.property?.address.street},{" "}
                      {inspection.property?.address.city},{" "}
                      {inspection.property?.address.state}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/properties/${inspection.propertyId}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View Property Details →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Inspection Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {formatDate(inspection.scheduledDate)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {formatTime(inspection.scheduledDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <div className="flex items-center gap-2">
                  {inspection.type === "virtual" && (
                    <Video className="w-5 h-5 text-gray-400" />
                  )}
                  {inspection.type === "self_guided" && (
                    <Key className="w-5 h-5 text-gray-400" />
                  )}
                  {inspection.type === "in_person" && (
                    <Users className="w-5 h-5 text-gray-400" />
                  )}
                  <p className="font-medium text-gray-900 capitalize">
                    {inspection.type.replace("_", " ")} Tour
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="font-medium text-gray-900">
                  {inspection.duration} minutes
                </p>
              </div>

              {inspection.virtualMeetingUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Virtual Meeting Link
                  </p>
                  <a
                    href={inspection.virtualMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Join Virtual Tour
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Attendees */}
          {inspection.attendees && inspection.attendees.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Attendees
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">You (Primary)</p>
                </div>
                {inspection.attendees.map((attendee, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{attendee.name}</p>
                    <p className="text-sm text-gray-600">{attendee.email}</p>
                    {attendee.phone && (
                      <p className="text-sm text-gray-600">{attendee.phone}</p>
                    )}
                    <span className="text-xs text-gray-500 capitalize">
                      {attendee.relationship.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {inspection.tenantNotes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Notes
              </h2>
              <p className="text-gray-700">{inspection.tenantNotes}</p>
            </div>
          )}

          {/* Check-in/Check-out */}
          {inspection.status === "confirmed" && (
            <CheckInOut inspection={inspection} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {canModify && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => openCalendarApp(inspection, "google")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Add to Calendar
                </button>
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Reschedule
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel Inspection
                </button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {inspection.landlord && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Landlord/Agent</p>
                  <p className="font-medium text-gray-900">
                    {inspection.landlord.firstName}{" "}
                    {inspection.landlord.lastName}
                  </p>
                </div>
                {inspection.landlord.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${inspection.landlord.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inspection.landlord.email}
                    </a>
                  </div>
                )}
                {inspection.landlord.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${inspection.landlord.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inspection.landlord.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showRescheduleModal && (
        <RescheduleModal
          inspection={inspection}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={() => {
            setShowRescheduleModal(false);
          }}
        />
      )}

      {showCancelModal && (
        <CancelModal
          inspection={inspection}
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            navigate("/inspections");
          }}
        />
      )}
    </div>
  );
};
