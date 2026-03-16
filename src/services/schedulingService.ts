// FILE PATH: src/services/schedulingService.ts
// Smart Scheduling & Booking System - API Service Layer

import axios from "axios";
import type {
  Booking,
  BookingFilters,
  BookingsResponse,
  CreateBookingDto,
  UpdateBookingDto,
  AvailabilitySlot,
  SmartSuggestion,
} from "../types/scheduling";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class SchedulingService {
  /**
   * Fetch bookings for a given user and date range
   */
  async getBookings(filters?: BookingFilters): Promise<BookingsResponse> {
    const response = await axios.get<BookingsResponse>(
      `${API_URL}/bookings`,
      { params: filters },
    );
    return response.data;
  }

  /**
   * Fetch a single booking by ID
   */
  async getBookingById(id: string): Promise<Booking> {
    const response = await axios.get<Booking>(`${API_URL}/bookings/${id}`);
    return response.data;
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const response = await axios.post<Booking>(`${API_URL}/bookings`, data);
    return response.data;
  }

  /**
   * Update an existing booking
   */
  async updateBooking(id: string, data: UpdateBookingDto): Promise<Booking> {
    const response = await axios.patch<Booking>(
      `${API_URL}/bookings/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const response = await axios.post<Booking>(
      `${API_URL}/bookings/${id}/cancel`,
      { reason },
    );
    return response.data;
  }

  /**
   * Fetch availability slots for a given user and date range
   */
  async getAvailabilitySlots(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AvailabilitySlot[]> {
    const response = await axios.get<AvailabilitySlot[]>(
      `${API_URL}/availability/${userId}`,
      { params: { startDate, endDate } },
    );
    return response.data;
  }

  /**
   * Create or update availability slots
   */
  async upsertAvailabilitySlots(
    userId: string,
    slots: Omit<AvailabilitySlot, "id">[],
  ): Promise<AvailabilitySlot[]> {
    const response = await axios.post<AvailabilitySlot[]>(
      `${API_URL}/availability/${userId}`,
      { slots },
    );
    return response.data;
  }

  /**
   * Delete an availability slot
   */
  async deleteAvailabilitySlot(slotId: string): Promise<void> {
    await axios.delete(`${API_URL}/availability/slots/${slotId}`);
  }

  /**
   * Get smart scheduling suggestions based on AI analysis
   */
  async getSmartSuggestions(
    propertyId: string,
    type: string,
    preferredDateRange?: { start: string; end: string },
  ): Promise<SmartSuggestion[]> {
    const response = await axios.get<SmartSuggestion[]>(
      `${API_URL}/bookings/smart-suggestions`,
      { params: { propertyId, type, ...preferredDateRange } },
    );
    return response.data;
  }
}

export const schedulingService = new SchedulingService();
export default schedulingService;
