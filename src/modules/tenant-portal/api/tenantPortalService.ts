import apiClient from "@/api/client";
import type {
  LeaseDetails,
  MaintenanceRequest,
  PaymentHistoryItem,
  UpcomingPayment,
} from "@/types/tenantPortal";

class TenantPortalModuleService {
  async getLeaseDetails(): Promise<LeaseDetails> {
    const response = await apiClient.get<LeaseDetails>("/tenant/lease");
    return response.data;
  }

  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const response =
      await apiClient.get<PaymentHistoryItem[]>("/tenant/payments");
    return response.data;
  }

  async getUpcomingPayments(): Promise<UpcomingPayment[]> {
    const response = await apiClient.get<UpcomingPayment[]>(
      "/tenant/payments/upcoming",
    );
    return response.data;
  }

  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    const response = await apiClient.get<MaintenanceRequest[]>(
      "/tenant/maintenance",
    );
    return response.data;
  }

  async submitMaintenanceRequest(data: FormData): Promise<MaintenanceRequest> {
    const response = await apiClient.post<MaintenanceRequest>(
      "/tenant/maintenance",
      data,
      {
        headers: { "Content-Type": undefined as unknown as string },
      },
    );
    return response.data;
  }

  async downloadReceipt(paymentId: string): Promise<Blob> {
    const response = await apiClient.get(
      `/tenant/payments/${paymentId}/receipt`,
      { responseType: "blob" },
    );
    return response.data;
  }
}

export const tenantPortalModuleService = new TenantPortalModuleService();
