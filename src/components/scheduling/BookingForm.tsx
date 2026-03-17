// FILE PATH: src/components/scheduling/BookingForm.tsx
// Smart Scheduling & Booking System - Booking Creation/Edit Form

import React, { useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import type {
  BookingType,
  AttendeeRole,
  CreateBookingDto,
  Booking,
} from "../../types/scheduling";

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "viewing", label: "Property Viewing" },
  { value: "inspection", label: "Inspection" },
  { value: "maintenance", label: "Maintenance" },
  { value: "meeting", label: "Meeting" },
];

const ATTENDEE_ROLES: { value: AttendeeRole; label: string }[] = [
  { value: "tenant", label: "Tenant" },
  { value: "landlord", label: "Landlord" },
  { value: "agent", label: "Agent" },
  { value: "property_manager", label: "Property Manager" },
];

const MOCK_PROPERTIES = [
  { id: "prop-1", title: "Harbourview Penthouse" },
  { id: "prop-2", title: "Riverside Apartment" },
  { id: "prop-3", title: "Parkside Terrace" },
  { id: "prop-4", title: "Ocean Breeze Villa" },
  { id: "prop-5", title: "Skyline Loft" },
];

const MOCK_UNITS = [
  { id: "unit-1", label: "Unit 1A" },
  { id: "unit-2", label: "Unit 2B" },
  { id: "unit-3", label: "Unit 3C" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttendeeInput {
  name: string;
  email: string;
  role: AttendeeRole;
}

interface FormErrors {
  type?: string;
  propertyId?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string;
}

interface BookingFormProps {
  initialData?: Booking;
  onSubmit: (data: CreateBookingDto) => Promise<void>;
  onCancel?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!initialData;

  const [type, setType] = useState<BookingType>(initialData?.type || "viewing");
  const [propertyId, setPropertyId] = useState(initialData?.propertyId || "");
  const [unitId, setUnitId] = useState(initialData?.unitId || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [startTime, setStartTime] = useState(
    initialData ? new Date(initialData.startTime).toISOString().slice(0, 16) : "",
  );
  const [endTime, setEndTime] = useState(
    initialData ? new Date(initialData.endTime).toISOString().slice(0, 16) : "",
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [attendees, setAttendees] = useState<AttendeeInput[]>(
    initialData?.attendees.map((a) => ({ name: a.name, email: a.email, role: a.role })) || [
      { name: "", email: "", role: "tenant" },
    ],
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!type) newErrors.type = "Booking type is required";
    if (!propertyId) newErrors.propertyId = "Property is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = "End time must be after start time";
    }
    const validAttendees = attendees.filter((a) => a.name.trim() && a.email.trim());
    if (validAttendees.length === 0) {
      newErrors.attendees = "At least one attendee is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const a of attendees) {
      if (a.email.trim() && !emailRegex.test(a.email.trim())) {
        newErrors.attendees = "Please enter valid email addresses";
        break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [type, propertyId, startTime, endTime, attendees]);

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        propertyId,
        unitId: unitId || undefined,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        attendees: attendees
          .filter((a) => a.name.trim() && a.email.trim())
          .map((a) => ({ name: a.name.trim(), email: a.email.trim(), role: a.role })),
        startTime,
        endTime,
        notes: notes.trim() || undefined,
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Attendee Management ─────────────────────────────────────────────────

  const addAttendee = () =>
    setAttendees([...attendees, { name: "", email: "", role: "tenant" }]);

  const removeAttendee = (index: number) =>
    setAttendees(attendees.filter((_, i) => i !== index));

  const updateAttendee = (index: number, field: keyof AttendeeInput, value: string) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], [field]: value };
    setAttendees(updated);
  };

  // ─── Field Wrapper ───────────────────────────────────────────────────────

  const fieldClasses =
    "w-full px-3 py-2.5 border border-[#091a2b]/20 rounded-lg text-sm text-[#091a2b] font-['Open_Sans'] focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent transition-colors bg-white";

  const labelClasses =
    "block text-sm font-semibold text-[#091a2b] font-['Open_Sans'] mb-1.5";

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-[#091a2b] font-['Montserrat']">
        {isEditing ? "Edit Booking" : "New Booking"}
      </h3>

      {/* Booking Type */}
      <div>
        <label className={labelClasses} htmlFor="booking-type">
          <Calendar className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
          Booking Type *
        </label>
        <select
          id="booking-type"
          value={type}
          onChange={(e) => setType(e.target.value as BookingType)}
          className={fieldClasses}
        >
          {BOOKING_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
            <AlertCircle className="w-3 h-3" /> {errors.type}
          </p>
        )}
      </div>

      {/* Property & Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="property">
            <MapPin className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
            Property *
          </label>
          <select
            id="property"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className={fieldClasses}
          >
            <option value="">Select property...</option>
            {MOCK_PROPERTIES.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {errors.propertyId && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
              <AlertCircle className="w-3 h-3" /> {errors.propertyId}
            </p>
          )}
        </div>
        <div>
          <label className={labelClasses} htmlFor="unit">Unit (optional)</label>
          <select
            id="unit"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className={fieldClasses}
          >
            <option value="">No unit</option>
            {MOCK_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClasses} htmlFor="title">Title (optional)</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Annual property inspection"
          className={fieldClasses}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses} htmlFor="description">
          <FileText className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add any details about this booking..."
          className={fieldClasses + " resize-none"}
        />
      </div>

      {/* Date/Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="start-time">
            <Clock className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
            Start Time *
          </label>
          <input
            id="start-time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={fieldClasses}
          />
          {errors.startTime && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
              <AlertCircle className="w-3 h-3" /> {errors.startTime}
            </p>
          )}
        </div>
        <div>
          <label className={labelClasses} htmlFor="end-time">End Time *</label>
          <input
            id="end-time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={fieldClasses}
          />
          {errors.endTime && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
              <AlertCircle className="w-3 h-3" /> {errors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Attendees */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClasses + " mb-0"}>
            <Users className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
            Attendees *
          </label>
          <button
            type="button"
            onClick={addAttendee}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#005163] hover:text-[#091a2b] transition-colors font-['Open_Sans']"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        {errors.attendees && (
          <p className="mb-2 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
            <AlertCircle className="w-3 h-3" /> {errors.attendees}
          </p>
        )}
        <div className="space-y-2">
          {attendees.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                type="text"
                value={a.name}
                onChange={(e) => updateAttendee(i, "name", e.target.value)}
                placeholder="Name"
                className={fieldClasses + " flex-1"}
                aria-label={`Attendee ${i + 1} name`}
              />
              <input
                type="email"
                value={a.email}
                onChange={(e) => updateAttendee(i, "email", e.target.value)}
                placeholder="Email"
                className={fieldClasses + " flex-1"}
                aria-label={`Attendee ${i + 1} email`}
              />
              <select
                value={a.role}
                onChange={(e) => updateAttendee(i, "role", e.target.value)}
                className={fieldClasses + " w-40"}
                aria-label={`Attendee ${i + 1} role`}
              >
                {ATTENDEE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {attendees.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttendee(i)}
                  className="p-2.5 text-red-400 hover:text-red-600 transition-colors"
                  aria-label={`Remove attendee ${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClasses} htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Internal notes..."
          className={fieldClasses + " resize-none"}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#091a2b] text-white text-sm font-semibold rounded-lg hover:bg-[#005163] disabled:opacity-50 transition-colors font-['Open_Sans']"
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : submitSuccess ? (
            <CheckCircle className="w-4 h-4" />
          ) : null}
          {isSubmitting
            ? "Saving..."
            : submitSuccess
              ? "Saved!"
              : isEditing
                ? "Update Booking"
                : "Create Booking"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Open_Sans']"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
