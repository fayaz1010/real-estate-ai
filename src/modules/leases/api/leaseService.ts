import apiClient from "@/api/client";

export interface LeaseProperty {
  id: string;
  title: string;
  address: string;
}

export interface LeaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status:
    | "DRAFT"
    | "PENDING_SIGNATURES"
    | "ACTIVE"
    | "EXPIRED"
    | "TERMINATED"
    | "RENEWED";
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  depositPaid: boolean;
  lateFeeAmount: number;
  lateFeeGraceDays: number;
  leaseDocumentUrl: string | null;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  signedAt: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
  createdAt: string;
  updatedAt: string;
  property?: LeaseProperty;
  tenant?: LeaseUser;
  landlord?: LeaseUser;
}

export interface CreateLeaseData {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  lateFeeAmount?: number;
  lateFeeGraceDays?: number;
  leaseDocumentUrl?: string;
}

export interface UpdateLeaseStatusData {
  status: Lease["status"];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const leaseService = {
  async getMyLeases(
    role: "tenant" | "landlord" = "landlord",
  ): Promise<Lease[]> {
    const res = await apiClient.get<ApiResponse<Lease[]>>("/leases/my-leases", {
      params: { role },
    });
    return res.data.data;
  },

  async getById(id: string): Promise<Lease> {
    const res = await apiClient.get<ApiResponse<Lease>>(`/leases/${id}`);
    return res.data.data;
  },

  async create(data: CreateLeaseData): Promise<Lease> {
    const res = await apiClient.post<ApiResponse<Lease>>("/leases", data);
    return res.data.data;
  },

  async updateStatus(id: string, data: UpdateLeaseStatusData): Promise<Lease> {
    const res = await apiClient.patch<ApiResponse<Lease>>(
      `/leases/${id}/status`,
      data,
    );
    return res.data.data;
  },

  async sign(id: string): Promise<Lease> {
    const res = await apiClient.post<ApiResponse<Lease>>(`/leases/${id}/sign`);
    return res.data.data;
  },

  async terminate(id: string, reason: string): Promise<Lease> {
    const res = await apiClient.post<ApiResponse<Lease>>(
      `/leases/${id}/terminate`,
      { reason },
    );
    return res.data.data;
  },
};

export default leaseService;
