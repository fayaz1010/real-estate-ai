import type {
  LeaseDetails,
  MaintenanceRequest,
  PaymentHistoryItem,
  UpcomingPayment,
} from '@/types/tenantPortal';
import { tokenManager } from '@/modules/auth/utils/tokenManager';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

class TenantPortalModuleService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...tokenManager.getAuthHeader(),
    };
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

  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/payments`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }
    return response.json();
  }

  async getUpcomingPayments(): Promise<UpcomingPayment[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/upcoming`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming payments');
    }
    return response.json();
  }

  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance requests');
    }
    return response.json();
  }

  async submitMaintenanceRequest(
    data: FormData,
  ): Promise<MaintenanceRequest> {
    const headers = tokenManager.getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      method: 'POST',
      headers,
      body: data,
    });
    if (!response.ok) {
      throw new Error('Failed to submit maintenance request');
    }
    return response.json();
  }

  async downloadReceipt(paymentId: string): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/tenant/payments/${paymentId}/receipt`,
      { headers: this.getHeaders() },
    );
    if (!response.ok) {
      throw new Error('Failed to download receipt');
    }
    return response.blob();
  }
}

export const tenantPortalModuleService = new TenantPortalModuleService();
