// PLACEHOLDER FILE: src/modules/inspections/components/InspectionBooking/BookingSummary.tsx
// TODO: Add your implementation here

import React from 'react';
import { Calendar, Clock, Home, Users, MapPin } from 'lucide-react';
import { InspectionType, InspectionAttendee } from '../../types/inspection.types';

interface BookingSummaryProps {
  propertyId: string | null;
  type: InspectionType | null;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  attendees: Omit<InspectionAttendee, 'id'>[];
}

// Mock property - replace with actual API data
const mockProperty = {
  id: '1',
  title: 'Modern Downtown Apartment',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
  },
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
};

const inspectionTypeLabels: Record<InspectionType, string> = {
  in_person: 'In-Person Tour',
  virtual: 'Virtual Tour',
  open_house: 'Open House',
  self_guided: 'Self-Guided Tour',
};

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  propertyId,
  type,
  preferredDate,
  preferredTimeSlot,
  attendees,
}) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h4>

      {/* Property Info */}
      {propertyId && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex gap-3">
            <img
              src={mockProperty.image}
              alt={mockProperty.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-900 truncate">
                {mockProperty.title}
              </h5>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {mockProperty.address.street}, {mockProperty.address.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Type */}
      {type && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inspection Type</p>
              <p className="font-medium text-gray-900">{inspectionTypeLabels[type]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Date & Time */}
      {preferredDate && preferredTimeSlot && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{formatDate(preferredDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(preferredTimeSlot)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  (Approximately 30 minutes)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendees */}
      <div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Attendees</p>
            <p className="font-medium text-gray-900">
              You {attendees.length > 0 && `+ ${attendees.length} other${attendees.length > 1 ? 's' : ''}`}
            </p>
            {attendees.length > 0 && (
              <ul className="mt-2 space-y-1">
                {attendees.map((attendee, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {attendee.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> Your inspection request will be sent to the landlord for
          confirmation. You'll receive an email once it's confirmed.
        </p>
      </div>
    </div>
  );
};
