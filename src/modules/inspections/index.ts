// ============================================================================
// FILE PATH: src/modules/inspections/index.ts
// Module 1.3: Inspection Booking & Scheduling System - Main Exports
// ============================================================================

// Export all types
export * from "./types/inspection.types";

// Export all utilities
export * from "./utils/timeSlotGenerator";
export * from "./utils/calendarSync";
export * from "./utils/timezoneHandler";
export * from "./utils/inspectionValidation";

// Export all services
export { inspectionService } from "./services/inspectionService";
export { availabilityService } from "./services/availabilityService";
export { notificationService } from "./services/notificationService";

// Export Redux store - selective exports to avoid conflicts
export { default as inspectionReducer } from "./store/inspectionSlice";
export { default as availabilityReducer } from "./store/availabilitySlice";
export type { InspectionState } from "./types/inspection.types";

// Export all hooks
export * from "./hooks/useInspections";
export * from "./hooks/useAvailability";
export * from "./hooks/useInspectionBooking";
export * from "./hooks/useInspectionCalendar";

// Export all components
// Booking Components
export * from "./components/InspectionBooking/BookingWizard";
export * from "./components/InspectionBooking/PropertySelection";
export * from "./components/InspectionBooking/InspectionTypeSelector";
export * from "./components/InspectionBooking/DateTimeSelector";
export * from "./components/InspectionBooking/TimeSlotGrid";
export * from "./components/InspectionBooking/AttendeeForm";
export * from "./components/InspectionBooking/BookingConfirmation";
export * from "./components/InspectionBooking/BookingSummary";

// Calendar Components
export { CalendarView } from "./components/InspectionCalendar/CalendarView";
export { DayView } from "./components/InspectionCalendar/DayView";
export { WeekView } from "./components/InspectionCalendar/WeekView";
export { MonthView } from "./components/InspectionCalendar/MonthView";
export { TimeSlot } from "./components/InspectionCalendar/TimeSlot";

// Management Components
export { InspectionsList } from "./components/InspectionManagement/InspectionsList";
export { InspectionCard } from "./components/InspectionManagement/InspectionCard";
export { InspectionDetails } from "./components/InspectionManagement/InspectionDetails";
export { InspectionStatus } from "./components/InspectionManagement/InspectionStatusBadge";
export { RescheduleModal } from "./components/InspectionManagement/RescheduleModal";
export { CancelModal } from "./components/InspectionManagement/CancelModal";
export { CheckInOut } from "./components/InspectionManagement/CheckInOut";

// Virtual Tour Components
export * from "./components/VirtualTour/VirtualTourLauncher";

// Availability Components
export { AvailabilityManager } from "./components/Availability/AvailabilityManager";
export { RecurringSchedule as RecurringScheduleComponent } from "./components/Availability/RecurringSchedule";
export { BlackoutDates } from "./components/Availability/BlackoutDates";
export { BufferTimeSettings } from "./components/Availability/BufferTimeSettings";

// Analytics Components
export * from "./components/Analytics/InspectionMetrics";
