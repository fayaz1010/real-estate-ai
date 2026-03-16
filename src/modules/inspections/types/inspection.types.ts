// ============================================================================
// FILE PATH: src/modules/inspections/types/inspection.types.ts
// Module 1.3: Inspection Booking & Scheduling System - Type Definitions
// ============================================================================

import { Property } from '../../properties/types/property.types';

// ============================================================================
// CORE TYPES
// ============================================================================

export type InspectionType = 'in_person' | 'virtual' | 'open_house' | 'self_guided';

export type InspectionStatus =
  | 'pending'       // Awaiting approval
  | 'confirmed'     // Confirmed by landlord
  | 'checked_in'    // Tenant arrived
  | 'completed'     // Tour finished
  | 'cancelled'     // Cancelled by either party
  | 'no_show'       // Tenant didn't show up
  | 'rescheduled';  // Moved to new time

// ============================================================================
// MAIN INTERFACES
// ============================================================================

export interface Inspection {
  id: string;
  propertyId: string;
  property?: Property; // Populated property details

  // Participants
  tenantId: string;
  tenant?: User;
  landlordId: string;
  landlord?: User;
  agentId?: string;
  agent?: User;

  // Scheduling
  type: InspectionType;
  scheduledDate: string; // ISO datetime
  duration: number; // minutes
  timezone: string;

  // Attendees (for group tours)
  attendees: InspectionAttendee[];
  maxAttendees?: number; // For open houses

  // Status & Tracking
  status: InspectionStatus;
  requestedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: 'tenant' | 'landlord' | 'system';

  // Reminders
  remindersSent: {
    type: '24h' | '2h' | '30m';
    sentAt: string;
  }[];

  // Virtual tour specific
  virtualMeetingUrl?: string;
  virtualMeetingId?: string;
  recordingUrl?: string;

  // Notes & Feedback
  landlordNotes?: string;
  tenantNotes?: string;
  tenantFeedback?: InspectionFeedback;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type AttendeeRelationship = 'applicant' | 'co_applicant' | 'roommate' | 'family' | 'friend';

export interface InspectionAttendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: AttendeeRelationship;
}

export interface InspectionFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  likedFeatures: string[];
  concerns: string[];
  interestedInApplying: boolean;
  submittedAt?: string; // Optional - set by server
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export interface AvailabilitySlot {
  id: string;
  propertyId: string;
  landlordId: string;

  // Time slot
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;

  // Capacity
  maxBookings: number; // For group tours
  currentBookings: number;

  // Slot type
  isRecurring: boolean;
  recurringRuleId?: string;

  // Status
  isAvailable: boolean;
  isBlocked: boolean;
  blockReason?: string;

  createdAt: string;
}

export interface RecurringSchedule {
  id: string;
  propertyId: string;
  landlordId: string;

  // Recurrence pattern
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number; // minutes
  bufferTime: number; // minutes between bookings

  // Date range
  startDate: string;
  endDate?: string; // null = ongoing

  // Exceptions
  excludedDates: string[]; // Specific dates to skip

  isActive: boolean;
  createdAt: string;
}

export interface BlackoutDate {
  id: string;
  propertyId: string;
  landlordId: string;

  startDate: string;
  endDate: string;
  reason: string;

  createdAt: string;
}

// ============================================================================
// BOOKING REQUEST TYPES
// ============================================================================

export interface InspectionBookingRequest {
  propertyId: string;
  type: InspectionType;
  preferredDate: string;
  preferredTimeSlot: string;
  attendees: Omit<InspectionAttendee, 'id'>[];
  tenantNotes?: string;
  requiresApproval?: boolean; // Instant booking vs approval needed
}

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

export interface InspectionState {
  // Inspection data
  inspections: Inspection[];
  currentInspection: Inspection | null;
  availableSlots: AvailabilitySlot[];

  // Loading states
  isLoadingInspections: boolean;
  isLoadingSlots: boolean;
  isCreatingInspection: boolean;
  isUpdatingInspection: boolean;

  // Pagination
  totalInspections: number;
  currentPage: number;
  totalPages: number;

  // Filters
  filters: {
    status?: InspectionStatus;
    propertyId?: string;
    landlordId?: string;
    dateRange?: string;
  };

  // Error handling
  error: string | null;

  // UI state
  selectedInspectionId: string | null;
  showBookingModal: boolean;
  showRescheduleModal: boolean;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface InspectionAnalytics {
  totalInspections: number;
  conversionRate: number; // Inspection → Application
  noShowRate: number;
  averageRating: number;
  averageDuration: number; // minutes
  responseTime: number; // hours

  byStatus: Record<InspectionStatus, number>;
  peakBookingTimes: Array<{
    day: string;
    hour: number;
    count: number;
  }>;
}

export interface PropertyInspectionMetrics {
  totalViews: number;
  inspectionRequests: number;
  completedInspections: number;
  averageFeedbackRating: number;
  inspectionToApplication: number; // conversion rate

  likedFeatures: string[];
  commonConcerns: string[];
}

// ============================================================================
// UPDATE TYPES
// ============================================================================

export interface UpdateInspectionDto {
  status?: InspectionStatus;
  scheduledDate?: string;
  duration?: number;
  landlordNotes?: string;
  tenantNotes?: string;
}

export interface CheckInDto {
  location?: {
    lat: number;
    lng: number;
  };
  photo?: string;
}

export interface CheckOutDto {
  feedback?: InspectionFeedback;
  rating?: number;
  comment?: string;
  likedFeatures?: string[];
  concerns?: string[];
  interestedInApplying?: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface InspectionsResponse {
  inspections: Inspection[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface AvailableSlotsResponse {
  slots: AvailabilitySlot[];
  nextAvailable?: string; // Next available date if none found
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface InspectionBookingProps {
  propertyId: string;
  onBookingComplete?: (inspection: Inspection) => void;
  onCancel?: () => void;
}

export interface InspectionCalendarProps {
  propertyId?: string;
  landlordId?: string;
  view?: 'day' | 'week' | 'month';
  onInspectionSelect?: (inspection: Inspection) => void;
}

export interface InspectionManagementProps {
  inspections: Inspection[];
  onInspectionUpdate?: (inspection: Inspection) => void;
  showFilters?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface TimeSlotOption {
  value: string;
  label: string;
  available: boolean;
  bookedCount?: number;
  maxCapacity?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  start: Date;
  end: Date;
  type: InspectionType;
  status: InspectionStatus;
  propertyId: string;
  tenantName: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface InspectionFormData {
  propertyId: string;
  type: InspectionType;
  preferredDate: string;
  preferredTimeSlot: string;
  attendees: Omit<InspectionAttendee, 'id'>[];
  tenantNotes?: string;
  requiresApproval?: boolean;
}

export interface AvailabilityFormData {
  propertyId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  startDate: string;
  endDate?: string;
}

// ============================================================================
// EXTERNAL DEPENDENCIES TYPES
// ============================================================================

// These would be imported from other modules
interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

// ============================================================================
// TIME SLOT TYPES
// ============================================================================

export interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
  available: boolean;
  bookingsCount: number;
  maxBookings: number;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD format
  slots: TimeSlot[];
}

// ============================================================================
// ADDITIONAL TYPES FOR SERVICE LAYER
// ============================================================================

export interface CreateInspectionDto {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  type: InspectionType;
  scheduledDate: string;
  duration: number;
  timezone: string;
  attendees: Omit<InspectionAttendee, 'id'>[];
  maxAttendees?: number;
  tenantNotes?: string;
  landlordNotes?: string;
  requiresApproval?: boolean;
}
