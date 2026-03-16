import type {
  TenantHome,
  MaintenanceRequest,
  PaymentHistoryItem,
  LeaseDetails,
  CommunityPost,
  TenantProfileDetails,
} from '../types/tenantPortal';
import { tokenManager } from '../modules/auth/utils/tokenManager';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

class TenantPortalService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...tokenManager.getAuthHeader(),
    };
  }

  async getTenantHomeData(): Promise<TenantHome> {
    const response = await fetch(`${API_BASE_URL}/tenant/home`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tenant home data');
    }
    return response.json();
  }

  async submitMaintenanceRequest(
    request: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt'>,
  ): Promise<MaintenanceRequest> {
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to submit maintenance request');
    }
    return response.json();
  }

  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/history`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }
    return response.json();
  }

  async getLeaseDetails(): Promise<LeaseDetails> {
    const response = await fetch(`${API_BASE_URL}/tenant/lease`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch lease details');
    }
    return response.json();
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/community`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch community posts');
    }
    return response.json();
  }

  async createCommunityPost(
    post: Omit<CommunityPost, 'id' | 'date'>,
  ): Promise<CommunityPost> {
    const response = await fetch(`${API_BASE_URL}/tenant/community`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to create community post');
    }
    return response.json();
  }

  async deleteCommunityPost(postId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/tenant/community/${postId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete community post');
    }
  }

  async updateTenantProfile(
    profile: TenantProfileDetails,
  ): Promise<TenantProfileDetails> {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to update tenant profile');
    }
    return response.json();
  }

  async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/intent`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    return response.json();
  }
}

export const tenantPortalService = new TenantPortalService();
