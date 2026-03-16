// PLACEHOLDER FILE: src/modules/inspections/components/InspectionManagement/InspectionCard.tsx
// TODO: Add your implementation here

import { MapPin, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Inspection } from "../../types/inspection.types";

import { InspectionStatus } from "./InspectionStatusBadge";

interface InspectionCardProps {
  inspection: Inspection;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({
  inspection,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  const getTimeUntil = (dateStr: string): string => {
    const now = new Date();
    const inspectionDate = new Date(dateStr);
    const diffMs = inspectionDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return "Past";
    if (diffHours < 1) return "Less than 1 hour";
    if (diffHours < 24)
      return `In ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `In ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    return "";
  };

  const timeUntil = getTimeUntil(inspection.scheduledDate);
  const isUpcoming =
    new Date(inspection.scheduledDate) > new Date() &&
    (inspection.status === "confirmed" || inspection.status === "pending");

  return (
    <div
      onClick={() => navigate(`/inspections/${inspection.id}`)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Property Image */}
        <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {inspection.property?.media?.images?.[0] ? (
            <img
              src={inspection.property.media.images[0].url}
              alt={inspection.property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Calendar className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                {inspection.property?.title || "Property Inspection"}
              </h3>
              {inspection.property && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {inspection.property.address.street},{" "}
                    {inspection.property.address.city}
                  </span>
                </div>
              )}
            </div>
            <InspectionStatus status={inspection.status} />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{formatDate(inspection.scheduledDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                {formatTime(inspection.scheduledDate)} ({inspection.duration}{" "}
                min)
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            {/* Type */}
            <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
              {inspection.type.replace("_", " ")}
            </span>

            {/* Attendees */}
            {inspection.attendees && inspection.attendees.length > 0 && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {inspection.attendees.length + 1} attendee
                  {inspection.attendees.length + 1 > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Countdown */}
            {isUpcoming && timeUntil && (
              <span className="text-blue-600 font-medium">{timeUntil}</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              {inspection.status === "pending" && (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  Awaiting confirmation
                </span>
              )}
              {inspection.status === "confirmed" && isUpcoming && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  Ready to attend
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/inspections/${inspection.id}`);
              }}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
