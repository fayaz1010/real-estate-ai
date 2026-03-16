// ============================================================================
// FILE PATH: src/modules/inspections/services/inspectionService.ts
// Module 1.3: Inspection Booking & Scheduling System - API Service Layer
// ============================================================================

import axios from 'axios';
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
} from '../types/inspection.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

class InspectionService {
  /**
   * Request a new inspection
   */
  async requestInspection(data: InspectionBookingRequest): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/request`,
      data
    );
    return response.data;
  }

  /**
   * Create inspection (admin/landlord)
   */
  async createInspection(data: CreateInspectionDto): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections`,
      data
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
    const response = await axios.get<InspectionsResponse>(
      `${API_URL}/inspections`,
      { params: filters }
    );
    return response.data;
  }

  /**
   * Get inspection by ID
   */
  async getInspectionById(id: string): Promise<Inspection> {
    const response = await axios.get<Inspection>(
      `${API_URL}/inspections/${id}`
    );
    return response.data;
  }

  /**
   * Update inspection
   */
  async updateInspection(id: string, updates: UpdateInspectionDto): Promise<Inspection> {
    const response = await axios.patch<Inspection>(
      `${API_URL}/inspections/${id}`,
      updates
    );
    return response.data;
  }

  /**
   * Confirm inspection
   */
  async confirmInspection(id: string): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/confirm`
    );
    return response.data;
  }

  /**
   * Cancel inspection
   */
  async cancelInspection(id: string, reason: string): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/cancel`,
      { reason }
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
    reason?: string
  ): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/reschedule`,
      { newDate, newTime, reason }
    );
    return response.data;
  }

  /**
   * Check in to inspection
   */
  async checkInInspection(id: string, data: CheckInDto): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/checkin`,
      data
    );
    return response.data;
  }

  /**
   * Check out from inspection
   */
  async checkOutInspection(id: string, data: CheckOutDto): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/checkout`,
      data
    );
    return response.data;
  }

  /**
   * Mark as no-show
   */
  async markAsNoShow(id: string): Promise<Inspection> {
    const response = await axios.post<Inspection>(
      `${API_URL}/inspections/${id}/no-show`
    );
    return response.data;
  }

  /**
   * Delete inspection
   */
  async deleteInspection(id: string): Promise<void> {
    await axios.delete(`${API_URL}/inspections/${id}`);
  }

  /**
   * Get available slots for a property
   */
  async getAvailableSlots(propertyId: string, date?: string): Promise<AvailableSlotsResponse> {
    const response = await axios.get<AvailableSlotsResponse>(
      `${API_URL}/properties/${propertyId}/available-slots`,
      { params: { date } }
    );
    return response.data;
  }

  /**
   * Get inspection analytics for landlord
   */
  async getLandlordAnalytics(
    landlordId: string,
    dateRange: '7d' | '30d' | '90d' | 'all' = '30d'
  ): Promise<InspectionAnalytics> {
    const response = await axios.get<InspectionAnalytics>(
      `${API_URL}/landlords/${landlordId}/inspection-analytics`,
      { params: { dateRange } }
    );
    return response.data;
  }

  /**
   * Get property inspection metrics
   */
  async getPropertyMetrics(
    propertyId: string,
    dateRange: '7d' | '30d' | '90d' | 'all' = '30d'
  ): Promise<PropertyInspectionMetrics> {
    const response = await axios.get<PropertyInspectionMetrics>(
      `${API_URL}/properties/${propertyId}/inspection-metrics`,
      { params: { dateRange } }
    );
    return response.data;
  }

  /**
   * Send reminder for inspection
   */
  async sendReminder(id: string, type: '24h' | '2h' | '30m'): Promise<void> {
    await axios.post(`${API_URL}/inspections/${id}/reminder`, { type });
  }

  /**
   * Get upcoming inspections for tenant
   */
  async getUpcomingInspections(tenantId: string): Promise<Inspection[]> {
    const response = await axios.get<Inspection[]>(
      `${API_URL}/tenants/${tenantId}/upcoming-inspections`
    );
    return response.data;
  }

  /**
   * Get past inspections for tenant
   */
  async getPastInspections(tenantId: string, page?: number, limit?: number): Promise<InspectionsResponse> {
    const response = await axios.get<InspectionsResponse>(
      `${API_URL}/tenants/${tenantId}/past-inspections`,
      { params: { page, limit } }
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
    }
  ): Promise<InspectionsResponse> {
    const response = await axios.get<InspectionsResponse>(
      `${API_URL}/landlords/${landlordId}/inspections`,
      { params: filters }
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
    }
  ): Promise<InspectionsResponse> {
    const response = await axios.get<InspectionsResponse>(
      `${API_URL}/properties/${propertyId}/inspections`,
      { params: filters }
    );
    return response.data;
  }

  /**
   * Bulk update inspection status
   */
  async bulkUpdateStatus(
    inspectionIds: string[],
    status: string,
    reason?: string
  ): Promise<Inspection[]> {
    const response = await axios.post<Inspection[]>(
      `${API_URL}/inspections/bulk-status`,
      { inspectionIds, status, reason }
    );
    return response.data;
  }

  /**
   * Export inspections data
   */
  async exportInspections(
    filters?: {
      landlordId?: string;
      propertyId?: string;
      startDate?: string;
      endDate?: string;
      format?: 'csv' | 'excel';
    }
  ): Promise<Blob> {
    const response = await axios.get(`${API_URL}/inspections/export`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

// Create and export singleton instance
export const inspectionService = new InspectionService();
export default inspectionService;
