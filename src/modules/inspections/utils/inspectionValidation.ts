// PLACEHOLDER FILE: src/modules/inspections/utils/inspectionValidation.ts
// TODO: Add your implementation here

import {
  InspectionBookingRequest,
  CreateInspectionDto,
  RecurringSchedule,
  BlackoutDate,
} from "../types/inspection.types";

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate inspection booking request
 */
export function validateInspectionBooking(
  data: Partial<InspectionBookingRequest>,
): ValidationResult {
  const errors: Record<string, string> = {};

  // Property ID
  if (!data.propertyId) {
    errors.propertyId = "Property is required";
  }

  // Inspection type
  if (!data.type) {
    errors.type = "Inspection type is required";
  } else if (
    !["in_person", "virtual", "open_house", "self_guided"].includes(data.type)
  ) {
    errors.type = "Invalid inspection type";
  }

  // Preferred date
  if (!data.preferredDate) {
    errors.preferredDate = "Preferred date is required";
  } else {
    const date = new Date(data.preferredDate);
    const now = new Date();

    if (isNaN(date.getTime())) {
      errors.preferredDate = "Invalid date format";
    } else if (date < now) {
      errors.preferredDate = "Date cannot be in the past";
    } else if (date > new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)) {
      errors.preferredDate = "Date cannot be more than 90 days in the future";
    }
  }

  // Time slot
  if (!data.preferredTimeSlot) {
    errors.preferredTimeSlot = "Time slot is required";
  } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.preferredTimeSlot)) {
    errors.preferredTimeSlot = "Invalid time format (use HH:mm)";
  }

  // Attendees
  if (data.attendees && data.attendees.length > 0) {
    data.attendees.forEach((attendee, index) => {
      if (!attendee.name || attendee.name.trim().length === 0) {
        errors[`attendee_${index}_name`] = "Attendee name is required";
      }

      if (!attendee.email || !isValidEmail(attendee.email)) {
        errors[`attendee_${index}_email`] = "Valid attendee email is required";
      }

      if (attendee.phone && !isValidPhone(attendee.phone)) {
        errors[`attendee_${index}_phone`] = "Invalid phone number format";
      }
    });

    // Maximum 5 attendees
    if (data.attendees.length > 5) {
      errors.attendees = "Maximum 5 attendees allowed";
    }
  }

  // Notes length
  if (data.tenantNotes && data.tenantNotes.length > 500) {
    errors.tenantNotes = "Notes cannot exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate create inspection DTO
 */
export function validateCreateInspection(
  data: Partial<CreateInspectionDto>,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.propertyId) {
    errors.propertyId = "Property ID is required";
  }

  if (!data.tenantId) {
    errors.tenantId = "Tenant ID is required";
  }

  if (!data.type) {
    errors.type = "Inspection type is required";
  }

  if (!data.scheduledDate) {
    errors.scheduledDate = "Scheduled date is required";
  } else {
    const date = new Date(data.scheduledDate);
    if (isNaN(date.getTime())) {
      errors.scheduledDate = "Invalid date format";
    }
  }

  if (!data.duration) {
    errors.duration = "Duration is required";
  } else if (data.duration < 15 || data.duration > 180) {
    errors.duration = "Duration must be between 15 and 180 minutes";
  }

  if (!data.timezone) {
    errors.timezone = "Timezone is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate recurring schedule
 */
export function validateRecurringSchedule(
  data: Partial<RecurringSchedule>,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.propertyId) {
    errors.propertyId = "Property ID is required";
  }

  if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
    errors.daysOfWeek = "At least one day of week must be selected";
  } else {
    const invalidDays = data.daysOfWeek.filter((day) => day < 0 || day > 6);
    if (invalidDays.length > 0) {
      errors.daysOfWeek = "Days must be between 0 (Sunday) and 6 (Saturday)";
    }
  }

  if (!data.startTime) {
    errors.startTime = "Start time is required";
  } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.startTime)) {
    errors.startTime = "Invalid start time format (use HH:mm)";
  }

  if (!data.endTime) {
    errors.endTime = "End time is required";
  } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.endTime)) {
    errors.endTime = "Invalid end time format (use HH:mm)";
  }

  // Check if end time is after start time
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    errors.endTime = "End time must be after start time";
  }

  if (!data.slotDuration) {
    errors.slotDuration = "Slot duration is required";
  } else if (data.slotDuration < 15 || data.slotDuration > 180) {
    errors.slotDuration = "Slot duration must be between 15 and 180 minutes";
  }

  if (
    data.bufferTime !== undefined &&
    (data.bufferTime < 0 || data.bufferTime > 60)
  ) {
    errors.bufferTime = "Buffer time must be between 0 and 60 minutes";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  } else {
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      errors.startDate = "Invalid start date format";
    }
  }

  if (data.endDate) {
    const endDate = new Date(data.endDate);
    if (isNaN(endDate.getTime())) {
      errors.endDate = "Invalid end date format";
    } else if (data.startDate && endDate <= new Date(data.startDate)) {
      errors.endDate = "End date must be after start date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate blackout date
 */
export function validateBlackoutDate(
  data: Partial<BlackoutDate>,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.propertyId) {
    errors.propertyId = "Property ID is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  } else {
    const date = new Date(data.startDate);
    if (isNaN(date.getTime())) {
      errors.startDate = "Invalid date format";
    }
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  } else {
    const date = new Date(data.endDate);
    if (isNaN(date.getTime())) {
      errors.endDate = "Invalid date format";
    }
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      errors.endDate = "End date must be after or equal to start date";
    }
  }

  if (!data.reason || data.reason.trim().length === 0) {
    errors.reason = "Reason is required";
  } else if (data.reason.length > 200) {
    errors.reason = "Reason cannot exceed 200 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate reschedule request
 */
export function validateReschedule(data: {
  newDate?: string;
  newTime?: string;
  reason?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.newDate) {
    errors.newDate = "New date is required";
  } else {
    const date = new Date(data.newDate);
    const now = new Date();

    if (isNaN(date.getTime())) {
      errors.newDate = "Invalid date format";
    } else if (date < now) {
      errors.newDate = "New date cannot be in the past";
    }
  }

  if (!data.newTime) {
    errors.newTime = "New time is required";
  } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.newTime)) {
    errors.newTime = "Invalid time format (use HH:mm)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate cancellation
 */
export function validateCancellation(data: {
  reason?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.reason || data.reason.trim().length === 0) {
    errors.reason = "Cancellation reason is required";
  } else if (data.reason.length > 300) {
    errors.reason = "Reason cannot exceed 300 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Check if inspection can be rescheduled
 */
export function canRescheduleInspection(
  scheduledDate: string,
  minHoursBeforeInspection: number = 2,
): { canReschedule: boolean; reason?: string } {
  const inspectionTime = new Date(scheduledDate);
  const now = new Date();
  const hoursUntilInspection =
    (inspectionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilInspection < 0) {
    return {
      canReschedule: false,
      reason: "Cannot reschedule past inspections",
    };
  }

  if (hoursUntilInspection < minHoursBeforeInspection) {
    return {
      canReschedule: false,
      reason: `Cannot reschedule within ${minHoursBeforeInspection} hours of inspection`,
    };
  }

  return { canReschedule: true };
}

/**
 * Check if inspection can be cancelled
 */
export function canCancelInspection(
  scheduledDate: string,
  status: string,
  minHoursBeforeInspection: number = 2,
): { canCancel: boolean; reason?: string } {
  if (["cancelled", "completed", "no_show"].includes(status)) {
    return {
      canCancel: false,
      reason: "Cannot cancel inspection with this status",
    };
  }

  const inspectionTime = new Date(scheduledDate);
  const now = new Date();
  const hoursUntilInspection =
    (inspectionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilInspection < 0) {
    return {
      canCancel: false,
      reason: "Cannot cancel past inspections",
    };
  }

  if (hoursUntilInspection < minHoursBeforeInspection) {
    return {
      canCancel: false,
      reason: `Cancellations must be made at least ${minHoursBeforeInspection} hours in advance`,
    };
  }

  return { canCancel: true };
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Accept various phone formats
  const phoneRegex = /^[\d\s\-()+]+$/;
  const digitsOnly = phone.replace(/\D/g, "");
  return (
    phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15
  );
}
