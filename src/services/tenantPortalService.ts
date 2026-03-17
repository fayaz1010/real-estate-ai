import apiClient from '@/api/client';
import type {
  TenantHome,
  MaintenanceRequest,
  PaymentHistoryItem,
  LeaseDetails,
  CommunityPost,
  TenantProfileDetails,
} from '../types/tenantPortal';

class TenantPortalService {
  async getTenantHomeData(): Promise<TenantHome> {
    const { data } = await apiClient.get<TenantHome>('/tenant/home');
    return data;
  }

  async submitMaintenanceRequest(
    request: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt'>,
  ): Promise<MaintenanceRequest> {
    const { data } = await apiClient.post<MaintenanceRequest>('/tenant/maintenance', request);
    return data;
  }

  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const { data } = await apiClient.get<PaymentHistoryItem[]>('/tenant/payments/history');
    return data;
  }

  async getLeaseDetails(): Promise<LeaseDetails> {
    const { data } = await apiClient.get<LeaseDetails>('/tenant/lease');
    return data;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    const { data } = await apiClient.get<CommunityPost[]>('/tenant/community');
    return data;
  }

  async createCommunityPost(post: Omit<CommunityPost, 'id' | 'date'>): Promise<CommunityPost> {
    const { data } = await apiClient.post<CommunityPost>('/tenant/community', post);
    return data;
  }

  async deleteCommunityPost(postId: string): Promise<void> {
    await apiClient.delete(`/tenant/community/${postId}`);
  }

  async updateTenantProfile(profile: TenantProfileDetails): Promise<TenantProfileDetails> {
    const { data } = await apiClient.put<TenantProfileDetails>('/tenant/profile', profile);
    return data;
  }

  async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
    const { data } = await apiClient.post<{ clientSecret: string }>('/tenant/payments/intent', { amount });
    return data;
  }
}

export const tenantPortalService = new TenantPortalService();
