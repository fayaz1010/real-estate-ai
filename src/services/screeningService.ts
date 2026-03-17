import apiClient from "@/api/client";
import type { ScreeningRequest } from '@/types/screening';

export const screeningService = {
  async getAllScreeningRequests(): Promise<ScreeningRequest[]> {
    const response = await apiClient.get<ScreeningRequest[]>("/screening");
    return response.data;
  },

  async getScreeningRequestById(id: string): Promise<ScreeningRequest> {
    const response = await apiClient.get<ScreeningRequest>(`/screening/${id}`);
    return response.data;
  },

  async createScreeningRequest(
    data: Omit<
      ScreeningRequest,
      | 'id'
      | 'status'
      | 'creditScore'
      | 'backgroundCheck'
      | 'evictionHistory'
      | 'employmentVerification'
      | 'createdAt'
      | 'updatedAt'
    >,
  ): Promise<ScreeningRequest> {
    const response = await apiClient.post<ScreeningRequest>("/screening", {
      ...data,
      status: 'pending',
    });
    return response.data;
  },

  async updateScreeningRequest(
    id: string,
    data: Partial<ScreeningRequest>,
  ): Promise<ScreeningRequest> {
    const response = await apiClient.patch<ScreeningRequest>(
      `/screening/${id}`,
      data,
    );
    return response.data;
  },
};
