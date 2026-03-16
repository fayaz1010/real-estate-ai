// PLACEHOLDER FILE: src/modules/inspections/utils/timeSlotGenerator.ts
// TODO: Add your implementation here

import {
  RecurringSchedule,
  BlackoutDate,
  Inspection,
  AvailabilitySlot,
  TimeSlot,
  DaySchedule,
} from "../types/inspection.types";

/**
 * Generate available time slots based on recurring schedule
 */
export function generateAvailableSlots(params: {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  recurringSchedule: RecurringSchedule;
  existingBookings: Inspection[];
  blackoutDates: BlackoutDate[];
  bufferTime: number;
  minAdvanceNotice?: number; // hours
}): AvailabilitySlot[] {
  const {
    propertyId,
    startDate,
    endDate,
    recurringSchedule,
    existingBookings,
    blackoutDates,
    bufferTime,
    minAdvanceNotice = 2,
  } = params;

  const slots: AvailabilitySlot[] = [];
  const currentDate = new Date(startDate);
  const now = new Date();
  const minBookingTime = new Date(
    now.getTime() + minAdvanceNotice * 60 * 60 * 1000,
  );

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dateString = formatDate(currentDate);

    // Check if this day is in the recurring schedule
    if (!recurringSchedule.daysOfWeek.includes(dayOfWeek)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Check if date is in excluded dates
    if (recurringSchedule.excludedDates.includes(dateString)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Check if date is in blackout period
    if (isDateBlackedOut(currentDate, blackoutDates)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate time slots for this day
    const daySlots = generateDaySlots({
      date: currentDate,
      startTime: recurringSchedule.startTime,
      endTime: recurringSchedule.endTime,
      slotDuration: recurringSchedule.slotDuration,
      bufferTime: bufferTime || recurringSchedule.bufferTime,
      existingBookings,
      minBookingTime,
      propertyId,
      landlordId: recurringSchedule.landlordId,
      recurringRuleId: recurringSchedule.id,
    });

    slots.push(...daySlots);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

/**
 * Generate time slots for a single day
 */
function generateDaySlots(params: {
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number;
  bufferTime: number;
  existingBookings: Inspection[];
  minBookingTime: Date;
  propertyId: string;
  landlordId: string;
  recurringRuleId: string;
}): AvailabilitySlot[] {
  const {
    date,
    startTime,
    endTime,
    slotDuration,
    bufferTime,
    existingBookings,
    minBookingTime,
    propertyId,
    landlordId,
    recurringRuleId,
  } = params;

  const slots: AvailabilitySlot[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMinute, 0, 0);

  const endDateTime = new Date(date);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  while (currentTime < endDateTime) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration * 60 * 1000);

    // Check if slot is in the past or too soon
    if (slotEnd <= minBookingTime) {
      currentTime = new Date(slotEnd.getTime() + bufferTime * 60 * 1000);
      continue;
    }

    // Check if slot end time exceeds schedule end time
    if (slotEnd > endDateTime) {
      break;
    }

    // Check for conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(
        bookingStart.getTime() + booking.duration * 60 * 1000,
      );

      return (
        booking.propertyId === propertyId &&
        booking.status !== "cancelled" &&
        booking.status !== "no_show" &&
        ((currentTime >= bookingStart && currentTime < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (currentTime <= bookingStart && slotEnd >= bookingEnd))
      );
    });

    const slot: AvailabilitySlot = {
      id: `${propertyId}_${currentTime.getTime()}`,
      propertyId,
      landlordId,
      date: formatDate(date),
      startTime: formatTime(currentTime),
      endTime: formatTime(slotEnd),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      maxBookings: 1, // Can be configured for open houses
      currentBookings: hasConflict ? 1 : 0,
      isRecurring: true,
      recurringRuleId,
      isAvailable: !hasConflict,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    slots.push(slot);

    // Move to next slot (including buffer time)
    currentTime = new Date(slotEnd.getTime() + bufferTime * 60 * 1000);
  }

  return slots;
}

/**
 * Check if a date is within any blackout period
 */
function isDateBlackedOut(date: Date, blackoutDates: BlackoutDate[]): boolean {
  const checkDate = formatDate(date);

  return blackoutDates.some((blackout) => {
    return checkDate >= blackout.startDate && checkDate <= blackout.endDate;
  });
}

/**
 * Group time slots by date
 */
export function groupSlotsByDate(slots: AvailabilitySlot[]): DaySchedule[] {
  const grouped = new Map<string, TimeSlot[]>();

  slots.forEach((slot) => {
    if (!grouped.has(slot.date)) {
      grouped.set(slot.date, []);
    }

    grouped.get(slot.date)!.push({
      start: slot.startTime,
      end: slot.endTime,
      available: slot.isAvailable,
      bookingsCount: slot.currentBookings,
      maxBookings: slot.maxBookings,
    });
  });

  return Array.from(grouped.entries())
    .map(([date, slots]) => ({
      date,
      slots: slots.sort((a, b) => a.start.localeCompare(b.start)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Find optimal time slots based on preferences
 */
export function suggestOptimalSlots(params: {
  availableSlots: AvailabilitySlot[];
  preferredDates?: string[];
  preferredTimes?: string[]; // e.g., ['morning', 'afternoon', 'evening']
  limit?: number;
}): AvailabilitySlot[] {
  const { availableSlots, preferredDates, preferredTimes, limit = 5 } = params;

  const scored = availableSlots
    .filter((slot) => slot.isAvailable)
    .map((slot) => {
      let score = 0;

      // Prefer dates in preferred list
      if (preferredDates && preferredDates.includes(slot.date)) {
        score += 10;
      }

      // Prefer times based on time of day
      if (preferredTimes) {
        const hour = parseInt(slot.startTime.split(":")[0]);

        if (preferredTimes.includes("morning") && hour >= 8 && hour < 12) {
          score += 5;
        } else if (
          preferredTimes.includes("afternoon") &&
          hour >= 12 &&
          hour < 17
        ) {
          score += 5;
        } else if (
          preferredTimes.includes("evening") &&
          hour >= 17 &&
          hour < 21
        ) {
          score += 5;
        }
      }

      // Prefer earlier dates
      const daysFromNow = Math.floor(
        (new Date(slot.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      score += Math.max(0, 10 - daysFromNow);

      return { slot, score };
    });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.slot);
}

/**
 * Calculate buffer time needed for agent traveling between properties
 */
export function calculateTravelBuffer(params: {
  fromProperty: { latitude: number; longitude: number };
  toProperty: { latitude: number; longitude: number };
  mode?: "driving" | "transit";
}): number {
  const { fromProperty, toProperty, mode = "driving" } = params;

  // Simple distance calculation (Haversine formula)
  const lat1 = fromProperty.latitude;
  const lon1 = fromProperty.longitude;
  const lat2 = toProperty.latitude;
  const lon2 = toProperty.longitude;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Estimate travel time (rough estimate)
  const speedKmH = mode === "driving" ? 40 : 25; // Average city speed
  const travelTimeHours = distance / speedKmH;
  const travelTimeMinutes = Math.ceil(travelTimeHours * 60);

  // Add 15 minute buffer
  return travelTimeMinutes + 15;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if two time slots overlap
 */
export function slotsOverlap(
  slot1: { start: Date; end: Date },
  slot2: { start: Date; end: Date },
): boolean {
  return (
    (slot1.start >= slot2.start && slot1.start < slot2.end) ||
    (slot1.end > slot2.start && slot1.end <= slot2.end) ||
    (slot1.start <= slot2.start && slot1.end >= slot2.end)
  );
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format time as HH:mm
 */
function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
