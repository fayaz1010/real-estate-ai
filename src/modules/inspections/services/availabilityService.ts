// PLACEHOLDER FILE: src/modules/inspections/services/availabilityService.ts
// TODO: Add your implementation here

import axios from "axios";

import {
  AvailabilitySlot,
  RecurringSchedule,
  BlackoutDate,
} from "../types/inspection.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class AvailabilityService {
  /**
   * Get available time slots for a property
   */
  async getAvailableSlots(params: {
    propertyId: string;
    startDate: string;
    endDate: string;
  }): Promise<AvailabilitySlot[]> {
    const response = await axios.get<AvailabilitySlot[]>(
      `${API_URL}/availability/slots`,
      { params },
    );
    return response.data;
  }

  /**
   * Create recurring schedule
   */
  async createRecurringSchedule(
    data: Omit<RecurringSchedule, "id" | "createdAt" | "updatedAt">,
  ): Promise<RecurringSchedule> {
    const response = await axios.post<RecurringSchedule>(
      `${API_URL}/availability/recurring`,
      data,
    );
    return response.data;
  }

  /**
   * Get recurring schedules for a property
   */
  async getRecurringSchedules(
    propertyId: string,
  ): Promise<RecurringSchedule[]> {
    const response = await axios.get<RecurringSchedule[]>(
      `${API_URL}/availability/recurring`,
      { params: { propertyId } },
    );
    return response.data;
  }

  /**
   * Update recurring schedule
   */
  async updateRecurringSchedule(
    id: string,
    updates: Partial<RecurringSchedule>,
  ): Promise<RecurringSchedule> {
    const response = await axios.patch<RecurringSchedule>(
      `${API_URL}/availability/recurring/${id}`,
      updates,
    );
    return response.data;
  }

  /**
   * Delete recurring schedule
   */
  async deleteRecurringSchedule(id: string): Promise<{ success: boolean }> {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/availability/recurring/${id}`,
    );
    return response.data;
  }

  /**
   * Toggle recurring schedule active status
   */
  async toggleRecurringSchedule(
    id: string,
    isActive: boolean,
  ): Promise<RecurringSchedule> {
    return this.updateRecurringSchedule(id, { isActive });
  }

  /**
   * Create blackout date
   */
  async createBlackoutDate(
    data: Omit<BlackoutDate, "id" | "createdAt">,
  ): Promise<BlackoutDate> {
    const response = await axios.post<BlackoutDate>(
      `${API_URL}/availability/blackout`,
      data,
    );
    return response.data;
  }

  /**
   * Get blackout dates for a property
   */
  async getBlackoutDates(propertyId: string): Promise<BlackoutDate[]> {
    const response = await axios.get<BlackoutDate[]>(
      `${API_URL}/availability/blackout`,
      { params: { propertyId } },
    );
    return response.data;
  }

  /**
   * Delete blackout date
   */
  async deleteBlackoutDate(id: string): Promise<{ success: boolean }> {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/availability/blackout/${id}`,
    );
    return response.data;
  }

  /**
   * Get landlord's availability across all properties
   */
  async getLandlordAvailability(
    landlordId: string,
    startDate: string,
    endDate: string,
  ): Promise<AvailabilitySlot[]> {
    const response = await axios.get<AvailabilitySlot[]>(
      `${API_URL}/availability/landlord/${landlordId}`,
      { params: { startDate, endDate } },
    );
    return response.data;
  }

  /**
   * Bulk create recurring schedules for multiple properties
   */
  async bulkCreateRecurringSchedule(
    propertyIds: string[],
    scheduleData: Omit<
      RecurringSchedule,
      "id" | "propertyId" | "createdAt" | "updatedAt"
    >,
  ): Promise<RecurringSchedule[]> {
    const response = await axios.post<RecurringSchedule[]>(
      `${API_URL}/availability/recurring/bulk`,
      {
        propertyIds,
        ...scheduleData,
      },
    );
    return response.data;
  }

  /**
   * Check if a specific time slot is available
   */
  async checkSlotAvailability(params: {
    propertyId: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<{ available: boolean; reason?: string }> {
    const response = await axios.get<{ available: boolean; reason?: string }>(
      `${API_URL}/availability/check`,
      { params },
    );
    return response.data;
  }
}

// Create and export singleton instance
export const availabilityService = new AvailabilityService();
export default availabilityService;
