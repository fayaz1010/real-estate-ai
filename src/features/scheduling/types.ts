import { z } from "zod/v4";

export type BookingType = "VIEWING" | "INSPECTION" | "MAINTENANCE" | "MEETING";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  propertyId: string;
  tenantId: string | null;
  type: BookingType;
  title: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  location: string | null;
  createdAt: string;
  updatedAt?: string;
  property?: {
    id: string;
    title: string;
    address: Record<string, string>;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface Availability {
  id: string;
  propertyId: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  score: number;
  reason: string;
}

export interface ConflictInfo {
  booking: Booking;
  overlapStart: string;
  overlapEnd: string;
  severity: "low" | "medium" | "high";
}

export const bookingTypeLabels: Record<BookingType, string> = {
  VIEWING: "Property Viewing",
  INSPECTION: "Property Inspection",
  MAINTENANCE: "Maintenance Visit",
  MEETING: "Meeting",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const bookingSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  tenantId: z.string().nullable().optional(),
  type: z.enum(["VIEWING", "INSPECTION", "MAINTENANCE", "MEETING"]),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  notes: z.string().max(1000).nullable().optional(),
  location: z.string().max(500).nullable().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const availabilitySchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  userId: z.string().min(1, "User is required"),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

export interface SchedulingState {
  bookings: Booking[];
  availabilities: Availability[];
  selectedBooking: Booking | null;
  suggestedSlots: TimeSlot[];
  conflicts: ConflictInfo[];
  isLoading: boolean;
  error: string | null;
}
