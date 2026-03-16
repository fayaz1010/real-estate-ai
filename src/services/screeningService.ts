import axios from 'axios';
import type { ScreeningRequest } from '@/types/screening';

const API_BASE = '/api/screening';

export const screeningService = {
  async getAllScreeningRequests(): Promise<ScreeningRequest[]> {
    const response = await axios.get<ScreeningRequest[]>(API_BASE);
    return response.data;
  },

  async getScreeningRequestById(id: string): Promise<ScreeningRequest> {
    const response = await axios.get<ScreeningRequest>(`${API_BASE}/${id}`);
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
    const response = await axios.post<ScreeningRequest>(API_BASE, {
      ...data,
      status: 'pending',
    });
    return response.data;
  },

  async updateScreeningRequest(
    id: string,
    data: Partial<ScreeningRequest>,
  ): Promise<ScreeningRequest> {
    const response = await axios.patch<ScreeningRequest>(
      `${API_BASE}/${id}`,
      data,
    );
    return response.data;
  },
};
