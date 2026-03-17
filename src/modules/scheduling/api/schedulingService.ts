// Scheduling API Service - Calendar Event Management
import type {
  Booking,
  BookingFilters,
  BookingsResponse,
  CreateBookingDto,
  UpdateBookingDto,
} from "../../../types/scheduling";

import apiClient from "@/api/client";

interface ApiBooking {
  id: string;
  propertyId: string;
  tenantId: string | null;
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  location: string | null;
  property?: {
    id: string;
    title: string;
    address: string;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiBookingsData {
  bookings: ApiBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function mapApiBooking(b: ApiBooking): Booking {
  return {
    id: b.id,
    type: b.type.toLowerCase() as Booking["type"],
    propertyId: b.propertyId,
    unitId: null,
    title: b.title,
    description: null,
    attendees: b.tenant
      ? [
          {
            id: b.tenant.id,
            name: `${b.tenant.firstName} ${b.tenant.lastName}`,
            email: b.tenant.email,
            role: "tenant",
          },
        ]
      : [],
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
    status: b.status.toLowerCase() as Booking["status"],
    notes: b.notes,
  };
}

class SchedulingService {
  async getBookings(filters?: BookingFilters): Promise<BookingsResponse> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status.toUpperCase();
    if (filters?.type) params.type = filters.type.toUpperCase();
    if (filters?.propertyId) params.propertyId = filters.propertyId;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.page) params.page = String(filters.page);
    if (filters?.limit) params.limit = String(filters.limit);

    const response = await apiClient.get<ApiResponse<ApiBookingsData>>(
      "/bookings",
      { params },
    );

    const data = response.data.data;
    return {
      bookings: data.bookings.map(mapApiBooking),
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
    };
  }

  async getMyBookings(filters?: BookingFilters): Promise<BookingsResponse> {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.page) params.page = String(filters.page);
    if (filters?.limit) params.limit = String(filters.limit);

    const response = await apiClient.get<ApiResponse<ApiBookingsData>>(
      "/bookings/my-bookings",
      { params },
    );

    const data = response.data.data;
    return {
      bookings: data.bookings.map(mapApiBooking),
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
    };
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<ApiBooking>>(
      `/bookings/${id}`,
    );
    return mapApiBooking(response.data.data);
  }

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const payload = {
      type: data.type.toUpperCase(),
      propertyId: data.propertyId,
      title: data.title || `${data.type} booking`,
      description: data.description,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      notes: data.notes,
    };

    const response = await apiClient.post<ApiResponse<ApiBooking>>(
      "/bookings",
      payload,
    );
    return mapApiBooking(response.data.data);
  }

  async updateBooking(id: string, data: UpdateBookingDto): Promise<Booking> {
    const payload: Record<string, unknown> = {};
    if (data.type) payload.type = data.type.toUpperCase();
    if (data.title) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.startTime)
      payload.startTime = new Date(data.startTime).toISOString();
    if (data.endTime) payload.endTime = new Date(data.endTime).toISOString();
    if (data.status) payload.status = data.status.toUpperCase();
    if (data.notes !== undefined) payload.notes = data.notes;

    const response = await apiClient.patch<ApiResponse<ApiBooking>>(
      `/bookings/${id}`,
      payload,
    );
    return mapApiBooking(response.data.data);
  }

  async deleteBooking(id: string): Promise<void> {
    await apiClient.delete(`/bookings/${id}`);
  }

  async getBookingsForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    const result = await this.getBookings({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 200,
    });
    return result.bookings;
  }
}

export const schedulingService = new SchedulingService();
export default schedulingService;
