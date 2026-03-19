// PLACEHOLDER FILE: src/modules/inspections/components/InspectionBooking/AttendeeForm.tsx
// TODO: Add your implementation here

import { Plus, X, User, Mail, Phone, Users } from "lucide-react";
import React, { useState } from "react";

import {
  InspectionAttendee,
  AttendeeRelationship,
} from "../../types/inspection.types";

interface AttendeeFormProps {
  attendees: Omit<InspectionAttendee, "id">[];
  tenantNotes: string;
  onAddAttendee: (attendee: Omit<InspectionAttendee, "id">) => void;
  onRemoveAttendee: (index: number) => void;
  onUpdateAttendee: (
    index: number,
    updates: Partial<Omit<InspectionAttendee, "id">>,
  ) => void;
  onNotesChange: (notes: string) => void;
  errors: Record<string, string>;
}

const relationshipOptions: { value: AttendeeRelationship; label: string }[] = [
  { value: "co_applicant", label: "Co-applicant" },
  { value: "roommate", label: "Roommate" },
  { value: "family", label: "Family Member" },
  { value: "friend", label: "Friend" },
];

export const AttendeeForm: React.FC<AttendeeFormProps> = ({
  attendees,
  tenantNotes,
  onAddAttendee,
  onRemoveAttendee,
  onUpdateAttendee: _onUpdateAttendee,
  onNotesChange,
  errors,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAttendee, setNewAttendee] = useState<
    Omit<InspectionAttendee, "id">
  >({
    name: "",
    email: "",
    phone: "",
    relationship: "co_applicant",
  });

  const handleAddAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      onAddAttendee(newAttendee);
      setNewAttendee({
        name: "",
        email: "",
        phone: "",
        relationship: "co_applicant",
      });
      setShowAddForm(false);
    }
  };

  const MAX_ATTENDEES = 5;
  const canAddMore = attendees.length < MAX_ATTENDEES;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Additional Details
        </h3>
        <p className="text-sm text-gray-600">
          Add attendees and any special requests (optional)
        </p>
      </div>

      {/* Attendees Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Additional Attendees</h4>
            <span className="text-sm text-gray-500">
              ({attendees.length}/{MAX_ATTENDEES})
            </span>
          </div>
          {canAddMore && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Person
            </button>
          )}
        </div>

        {/* Existing Attendees */}
        {attendees.length > 0 && (
          <div className="space-y-3 mb-4">
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {attendee.name}
                      </p>
                      <p className="text-sm text-gray-600">{attendee.email}</p>
                      {attendee.phone && (
                        <p className="text-sm text-gray-600">
                          {attendee.phone}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveAttendee(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove attendee"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                    {
                      relationshipOptions.find(
                        (r) => r.value === attendee.relationship,
                      )?.label
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Attendee Form */}
        {showAddForm && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <h5 className="font-medium text-gray-900 mb-4">Add Attendee</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={newAttendee.name}
                    onChange={(e) =>
                      setNewAttendee({ ...newAttendee, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={newAttendee.email}
                    onChange={(e) =>
                      setNewAttendee({ ...newAttendee, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={newAttendee.phone}
                    onChange={(e) =>
                      setNewAttendee({ ...newAttendee, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <select
                  value={newAttendee.relationship}
                  onChange={(e) =>
                    setNewAttendee({
                      ...newAttendee,
                      relationship: e.target.value as AttendeeRelationship,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddAttendee}
                  disabled={!newAttendee.name || !newAttendee.email}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Attendee
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAttendee({
                      name: "",
                      email: "",
                      phone: "",
                      relationship: "co_applicant",
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        {attendees.length === 0 && !showAddForm && (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
            You&apos;ll be the only attendee. Add others if needed.
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests or Questions (Optional)
        </label>
        <textarea
          value={tenantNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any specific areas you'd like to see? Questions for the landlord? Special accessibility needs?"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            This will be shared with the landlord/agent
          </p>
          <p className="text-xs text-gray-500">{tenantNotes.length}/500</p>
        </div>
        {errors.tenantNotes && (
          <p className="mt-1 text-sm text-red-600">{errors.tenantNotes}</p>
        )}
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Inspection Tips:</h5>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Bring a valid photo ID</li>
          <li>• Arrive 5 minutes early</li>
          <li>• Take photos/videos (with permission)</li>
          <li>• Test appliances and fixtures</li>
          <li>• Ask about utilities, parking, and neighborhood</li>
        </ul>
      </div>
    </div>
  );
};
