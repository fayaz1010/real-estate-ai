// Smart Scheduling & Booking System - Main Scheduling Page
// CRUD operations for calendar events with BookingCalendar integration

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Loader,
  CheckCircle,
  Trash2,
  Edit3,
  X,
  ChevronRight,
} from "lucide-react";
import type {
  Booking,
  BookingType,
  CreateBookingDto,
  UpdateBookingDto,
} from "../../../types/scheduling";
import schedulingService from "../api/schedulingService";
import BookingCalendar from "../components/BookingCalendar";

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "viewing", label: "Property Viewing" },
  { value: "inspection", label: "Inspection" },
  { value: "maintenance", label: "Maintenance" },
  { value: "meeting", label: "Meeting" },
];

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

// ─── Form Errors ─────────────────────────────────────────────────────────────

interface FormErrors {
  type?: string;
  propertyId?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SchedulingPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formType, setFormType] = useState<BookingType>("viewing");
  const [formPropertyId, setFormPropertyId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─── Fetch upcoming bookings ─────────────────────────────────────────────

  const fetchUpcoming = useCallback(async () => {
    setIsLoadingUpcoming(true);
    try {
      const now = new Date();
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const result = await schedulingService.getBookings({
        startDate: now.toISOString(),
        endDate: future.toISOString(),
        limit: 10,
      });
      setUpcomingBookings(result.bookings);
    } catch {
      setUpcomingBookings([]);
    } finally {
      setIsLoadingUpcoming(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming, refreshTrigger]);

  // ─── Form helpers ────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormType("viewing");
    setFormPropertyId("");
    setFormTitle("");
    setFormDescription("");
    setFormStartTime("");
    setFormEndTime("");
    setFormNotes("");
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setEditingBooking(null);
  };

  const openCreateForm = (date?: Date) => {
    resetForm();
    if (date) {
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setFormStartTime(local.toISOString().slice(0, 16));
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 1);
      const localEnd = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
      setFormEndTime(localEnd.toISOString().slice(0, 16));
    }
    setShowForm(true);
  };

  const openEditForm = (booking: Booking) => {
    setEditingBooking(booking);
    setFormType(booking.type);
    setFormPropertyId(booking.propertyId);
    setFormTitle(booking.title || "");
    setFormDescription(booking.description || "");
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const localStart = new Date(start.getTime() - start.getTimezoneOffset() * 60000);
    const localEnd = new Date(end.getTime() - end.getTimezoneOffset() * 60000);
    setFormStartTime(localStart.toISOString().slice(0, 16));
    setFormEndTime(localEnd.toISOString().slice(0, 16));
    setFormNotes(booking.notes || "");
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowForm(true);
  };

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formType) errors.type = "Booking type is required";
    if (!formPropertyId.trim()) errors.propertyId = "Property ID is required";
    if (!formStartTime) errors.startTime = "Start time is required";
    if (!formEndTime) errors.endTime = "End time is required";
    if (!formTitle.trim()) errors.title = "Title is required";
    if (formStartTime && formEndTime && new Date(formStartTime) >= new Date(formEndTime)) {
      errors.endTime = "End time must be after start time";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit (Create / Update) ────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (editingBooking) {
        const updateData: UpdateBookingDto = {
          type: formType,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          startTime: formStartTime,
          endTime: formEndTime,
          notes: formNotes.trim() || undefined,
        };
        await schedulingService.updateBooking(editingBooking.id, updateData);
      } else {
        const createData: CreateBookingDto = {
          type: formType,
          propertyId: formPropertyId.trim(),
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          attendees: [],
          startTime: formStartTime,
          endTime: formEndTime,
          notes: formNotes.trim() || undefined,
        };
        await schedulingService.createBooking(createData);
      }

      setSubmitSuccess(true);
      setRefreshTrigger((prev) => prev + 1);
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save booking",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await schedulingService.deleteBooking(id);
      setDeleteConfirmId(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      // Error handled silently
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Field styles ────────────────────────────────────────────────────────

  const fieldClasses =
    "w-full px-3 py-2.5 border border-[#091a2b]/20 rounded-lg text-sm text-[#091a2b] font-['Open_Sans'] focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent transition-colors bg-white";

  const labelClasses =
    "block text-sm font-semibold text-[#091a2b] font-['Open_Sans'] mb-1.5";

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#091a2b] font-['Montserrat']">
              Smart Scheduling
            </h1>
            <p className="text-sm text-gray-600 font-['Open_Sans'] mt-1">
              Manage property viewings, inspections, and meetings
            </p>
          </div>
          <button
            onClick={() => openCreateForm()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#091a2b] text-white text-sm font-semibold rounded-lg hover:bg-[#005163] transition-colors font-['Open_Sans']"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <BookingCalendar
                onDateClick={(date) => openCreateForm(date)}
                onBookingClick={(booking) => openEditForm(booking)}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>

          {/* Sidebar: Upcoming Bookings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-[#091a2b] font-['Montserrat'] mb-4">
                Upcoming Events
              </h2>

              {isLoadingUpcoming ? (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-50">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-['Open_Sans']">
                    No upcoming bookings
                  </p>
                  <button
                    onClick={() => openCreateForm()}
                    className="mt-3 text-sm text-[#005163] font-semibold hover:underline font-['Open_Sans']"
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="group relative p-3 rounded-lg border border-gray-100 hover:border-[#005163]/30 hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => openEditForm(booking)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              STATUS_COLORS[booking.status] || STATUS_COLORS.pending
                            } font-['Open_Sans']`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-['Open_Sans']">
                              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#091a2b] truncate font-['Open_Sans']">
                            {booking.title || `${booking.type} booking`}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-['Open_Sans']">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.startTime).toLocaleDateString("en-US", {
                              month: "short", day: "numeric",
                            })}{" "}
                            {new Date(booking.startTime).toLocaleTimeString("en-US", {
                              hour: "numeric", minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditForm(booking);
                            }}
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-[#005163]"
                            aria-label="Edit booking"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(booking.id);
                            }}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                            aria-label="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {upcomingBookings.length >= 10 && (
                    <button className="w-full flex items-center justify-center gap-1 py-2 text-xs text-[#005163] font-semibold hover:underline font-['Open_Sans']">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowForm(false); resetForm(); }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#091a2b] font-['Montserrat']">
                {editingBooking ? "Edit Booking" : "New Booking"}
              </h3>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2 font-['Open_Sans']">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Booking Type */}
              <div>
                <label className={labelClasses} htmlFor="form-type">
                  <Calendar className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
                  Booking Type *
                </label>
                <select
                  id="form-type"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as BookingType)}
                  className={fieldClasses}
                >
                  {BOOKING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
                    <AlertCircle className="w-3 h-3" /> {formErrors.type}
                  </p>
                )}
              </div>

              {/* Property ID */}
              <div>
                <label className={labelClasses} htmlFor="form-property">
                  <MapPin className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
                  Property ID *
                </label>
                <input
                  id="form-property"
                  type="text"
                  value={formPropertyId}
                  onChange={(e) => setFormPropertyId(e.target.value)}
                  placeholder="Enter property UUID"
                  className={fieldClasses}
                  disabled={!!editingBooking}
                />
                {formErrors.propertyId && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
                    <AlertCircle className="w-3 h-3" /> {formErrors.propertyId}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className={labelClasses} htmlFor="form-title">Title *</label>
                <input
                  id="form-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual property inspection"
                  className={fieldClasses}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
                    <AlertCircle className="w-3 h-3" /> {formErrors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={labelClasses} htmlFor="form-description">
                  <FileText className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
                  Description
                </label>
                <textarea
                  id="form-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Add details about this booking..."
                  className={fieldClasses + " resize-none"}
                />
              </div>

              {/* Date/Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses} htmlFor="form-start">
                    <Clock className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />
                    Start Time *
                  </label>
                  <input
                    id="form-start"
                    type="datetime-local"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className={fieldClasses}
                  />
                  {formErrors.startTime && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
                      <AlertCircle className="w-3 h-3" /> {formErrors.startTime}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClasses} htmlFor="form-end">End Time *</label>
                  <input
                    id="form-end"
                    type="datetime-local"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className={fieldClasses}
                  />
                  {formErrors.endTime && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-['Open_Sans']">
                      <AlertCircle className="w-3 h-3" /> {formErrors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelClasses} htmlFor="form-notes">Notes</label>
                <textarea
                  id="form-notes"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
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
                      : editingBooking
                        ? "Update Booking"
                        : "Create Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Open_Sans']"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#091a2b] font-['Montserrat'] mb-2">
              Delete Booking
            </h3>
            <p className="text-sm text-gray-600 font-['Open_Sans'] mb-5">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-['Open_Sans']"
              >
                {isDeleting && <Loader className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Open_Sans']"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingPage;
