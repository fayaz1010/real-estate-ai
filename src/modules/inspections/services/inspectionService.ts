// ============================================================================
// FILE PATH: src/modules/inspections/services/inspectionService.ts
// Module 1.3: Inspection Booking & Scheduling System - API Service Layer
// ============================================================================

import apiClient from "@/api/client";

import {
  Inspection,
  InspectionBookingRequest,
  CreateInspectionDto,
  UpdateInspectionDto,
  CheckInDto,
  CheckOutDto,
  InspectionAnalytics,
  PropertyInspectionMetrics,
  InspectionsResponse,
  AvailableSlotsResponse,
} from "../types/inspection.types";

class InspectionService {
  /**
   * Request a new inspection
   */
  async requestInspection(data: InspectionBookingRequest): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      "/inspections/request",
      data,
    );
    return response.data;
  }

  /**
   * Create inspection (admin/landlord)
   */
  async createInspection(data: CreateInspectionDto): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      "/inspections",
      data,
    );
    return response.data;
  }

  /**
   * Get all inspections with filters
   */
  async getInspections(filters?: {
    status?: string;
    propertyId?: string;
    tenantId?: string;
    landlordId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<InspectionsResponse> {
    const response = await apiClient.get<InspectionsResponse>(
      "/inspections",
      { params: filters },
    );
    return response.data;
  }

  /**
   * Get inspection by ID
   */
  async getInspectionById(id: string): Promise<Inspection> {
    const response = await apiClient.get<Inspection>(
      `/inspections/${id}`,
    );
    return response.data;
  }

  /**
   * Update inspection
   */
  async updateInspection(
    id: string,
    updates: UpdateInspectionDto,
  ): Promise<Inspection> {
    const response = await apiClient.patch<Inspection>(
      `/inspections/${id}`,
      updates,
    );
    return response.data;
  }

  /**
   * Confirm inspection
   */
  async confirmInspection(id: string): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/confirm`,
    );
    return response.data;
  }

  /**
   * Cancel inspection
   */
  async cancelInspection(id: string, reason: string): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/cancel`,
      { reason },
    );
    return response.data;
  }

  /**
   * Reschedule inspection
   */
  async rescheduleInspection(
    id: string,
    newDate: string,
    newTime: string,
    reason?: string,
  ): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/reschedule`,
      { newDate, newTime, reason },
    );
    return response.data;
  }

  /**
   * Check in to inspection
   */
  async checkInInspection(id: string, data: CheckInDto): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/checkin`,
      data,
    );
    return response.data;
  }

  /**
   * Check out from inspection
   */
  async checkOutInspection(id: string, data: CheckOutDto): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/checkout`,
      data,
    );
    return response.data;
  }

  /**
   * Mark as no-show
   */
  async markAsNoShow(id: string): Promise<Inspection> {
    const response = await apiClient.post<Inspection>(
      `/inspections/${id}/no-show`,
    );
    return response.data;
  }

  /**
   * Delete inspection
   */
  async deleteInspection(id: string): Promise<void> {
    await apiClient.delete(`/inspections/${id}`);
  }

  /**
   * Get available slots for a property
   */
  async getAvailableSlots(
    propertyId: string,
    date?: string,
  ): Promise<AvailableSlotsResponse> {
    const response = await apiClient.get<AvailableSlotsResponse>(
      `/properties/${propertyId}/available-slots`,
      { params: { date } },
    );
    return response.data;
  }

  /**
   * Get inspection analytics for landlord
   */
  async getLandlordAnalytics(
    landlordId: string,
    dateRange: "7d" | "30d" | "90d" | "all" = "30d",
  ): Promise<InspectionAnalytics> {
    const response = await apiClient.get<InspectionAnalytics>(
      `/landlords/${landlordId}/inspection-analytics`,
      { params: { dateRange } },
    );
    return response.data;
  }

  /**
   * Get property inspection metrics
   */
  async getPropertyMetrics(
    propertyId: string,
    dateRange: "7d" | "30d" | "90d" | "all" = "30d",
  ): Promise<PropertyInspectionMetrics> {
    const response = await apiClient.get<PropertyInspectionMetrics>(
      `/properties/${propertyId}/inspection-metrics`,
      { params: { dateRange } },
    );
    return response.data;
  }

  /**
   * Send reminder for inspection
   */
  async sendReminder(id: string, type: "24h" | "2h" | "30m"): Promise<void> {
    await apiClient.post(`/inspections/${id}/reminder`, { type });
  }

  /**
   * Get upcoming inspections for tenant
   */
  async getUpcomingInspections(tenantId: string): Promise<Inspection[]> {
    const response = await apiClient.get<Inspection[]>(
      `/tenants/${tenantId}/upcoming-inspections`,
    );
    return response.data;
  }

  /**
   * Get past inspections for tenant
   */
  async getPastInspections(
    tenantId: string,
    page?: number,
    limit?: number,
  ): Promise<InspectionsResponse> {
    const response = await apiClient.get<InspectionsResponse>(
      `/tenants/${tenantId}/past-inspections`,
      { params: { page, limit } },
    );
    return response.data;
  }

  /**
   * Get inspections for landlord
   */
  async getLandlordInspections(
    landlordId: string,
    filters?: {
      status?: string;
      propertyId?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<InspectionsResponse> {
    const response = await apiClient.get<InspectionsResponse>(
      `/landlords/${landlordId}/inspections`,
      { params: filters },
    );
    return response.data;
  }

  /**
   * Get property-specific inspections
   */
  async getPropertyInspections(
    propertyId: string,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<InspectionsResponse> {
    const response = await apiClient.get<InspectionsResponse>(
      `/properties/${propertyId}/inspections`,
      { params: filters },
    );
    return response.data;
  }

  /**
   * Bulk update inspection status
   */
  async bulkUpdateStatus(
    inspectionIds: string[],
    status: string,
    reason?: string,
  ): Promise<Inspection[]> {
    const response = await apiClient.post<Inspection[]>(
      "/inspections/bulk-status",
      { inspectionIds, status, reason },
    );
    return response.data;
  }

  /**
   * Export inspections data
   */
  async exportInspections(filters?: {
    landlordId?: string;
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    format?: "csv" | "excel";
  }): Promise<Blob> {
    const response = await apiClient.get("/inspections/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  }
}

// Create and export singleton instance
export const inspectionService = new InspectionService();
export default inspectionService;
