// PLACEHOLDER FILE: src/modules/inspections/components/InspectionCalendar/TimeSlot.tsx
// TODO: Add your implementation here

import React from 'react';
import { MapPin, Clock, User, Users } from 'lucide-react';
import { Inspection } from '../../types/inspection.types';

interface TimeSlotProps {
  inspection: Inspection;
  onClick?: () => void;
  variant?: 'compact' | 'expanded';
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  inspection,
  onClick,
  variant = 'compact',
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
      case 'checked_in':
        return 'bg-blue-600 border-blue-600';
      case 'pending':
        return 'bg-yellow-500 border-yellow-500';
      case 'completed':
        return 'bg-green-600 border-green-600';
      case 'cancelled':
      case 'no_show':
        return 'bg-red-500 border-red-500';
      default:
        return 'bg-gray-400 border-gray-400';
    }
  };

  const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInspectionTypeIcon = (type: string) => {
    switch (type) {
      case 'in_person':
        return '🏠';
      case 'virtual':
        return '💻';
      case 'open_house':
        return '👥';
      case 'self_guided':
        return '🔑';
      default:
        return '📅';
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`
          w-full text-left px-2 py-1.5 rounded border-l-4 text-white
          hover:shadow-md transition-all cursor-pointer
          ${getStatusColor(inspection.status)}
        `}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium truncate">
            {formatTime(inspection.scheduledDate)}
          </span>
          <span>{getInspectionTypeIcon(inspection.type)}</span>
        </div>
        <div className="text-xs mt-0.5 truncate opacity-90">
          {inspection.property?.title || 'Property'}
        </div>
      </button>
    );
  }

  // Expanded variant
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg border-l-4 bg-white
        hover:shadow-lg transition-all cursor-pointer
        ${getStatusColor(inspection.status)}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getInspectionTypeIcon(inspection.type)}</span>
          <div>
            <h4 className="font-semibold text-gray-900">
              {inspection.property?.title || 'Property Inspection'}
            </h4>
            <p className="text-sm text-gray-500 capitalize">
              {inspection.type.replace('_', ' ')} Tour
            </p>
          </div>
        </div>
        <span
          className={`
            px-2 py-1 rounded-full text-xs font-medium text-white
            ${getStatusColor(inspection.status)}
          `}
        >
          {inspection.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {formatTime(inspection.scheduledDate)} ({inspection.duration} minutes)
          </span>
        </div>

        {/* Location */}
        {inspection.property && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {inspection.property.address.street}, {inspection.property.address.city}
            </span>
          </div>
        )}

        {/* Attendees */}
        {inspection.attendees && inspection.attendees.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              You + {inspection.attendees.length} other
              {inspection.attendees.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Landlord/Agent */}
        {inspection.landlord && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>
              With {inspection.landlord.firstName} {inspection.landlord.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {inspection.status === 'confirmed' && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle check-in
            }}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            Check In
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle reschedule
            }}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            Reschedule
          </button>
        </div>
      )}

      {/* Notes */}
      {inspection.tenantNotes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <span className="font-medium">Note:</span> {inspection.tenantNotes}
        </div>
      )}
    </button>
  );
};
