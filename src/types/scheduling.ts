// FILE PATH: src/types/scheduling.ts
// Smart Scheduling & Booking System - Type Definitions

export type BookingType = 'viewing' | 'inspection' | 'maintenance' | 'meeting';
export type BookingStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
export type AttendeeRole = 'tenant' | 'landlord' | 'agent' | 'property_manager';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role: AttendeeRole;
}

export interface Booking {
  id: string;
  type: BookingType;
  propertyId: string;
  unitId: string | null;
  title: string | null;
  description: string | null;
  attendees: Attendee[];
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes: string | null;
}

export interface AvailabilitySlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export interface RecurringAvailability {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface BlackoutDate {
  id: string;
  date: Date;
  reason?: string;
}

export interface SmartSuggestion {
  id: string;
  startTime: Date;
  endTime: Date;
  score: number;
  reason: string;
  type: BookingType;
  propertyId: string;
}

export interface CreateBookingDto {
  type: BookingType;
  propertyId: string;
  unitId?: string;
  title?: string;
  description?: string;
  attendees: Omit<Attendee, 'id'>[];
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingDto {
  type?: BookingType;
  title?: string;
  description?: string;
  attendees?: Omit<Attendee, 'id'>[];
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  type?: BookingType;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}
