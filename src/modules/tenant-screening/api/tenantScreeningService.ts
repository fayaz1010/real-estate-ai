import apiClient from "@/api/client";

export interface EmploymentEntry {
  employerName: string;
  startDate: string;
  endDate: string;
  position: string;
  salary: string;
}

export interface RentalHistoryEntry {
  landlordName: string;
  address: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
}

export interface ReferenceEntry {
  name: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

export interface TenantScreeningFormData {
  fullName: string;
  dateOfBirth: string;
  ssn?: string;
  currentAddress: string;
  previousAddress?: string;
  employmentHistory: EmploymentEntry[];
  rentalHistory: RentalHistoryEntry[];
  references: ReferenceEntry[];
  consentBackgroundCheck: boolean;
}

export interface ScreeningResult {
  id: string;
  status: string;
  creditCheck?: { status: string; provider: string };
  criminalBackground?: { status: string; provider: string };
  evictionHistory?: { status: string; provider: string };
}

export interface TenantScreeningResponse {
  success: boolean;
  message: string;
  screening?: ScreeningResult;
}

class TenantScreeningService {
  async submitTenantScreeningForm(
    formData: TenantScreeningFormData,
  ): Promise<TenantScreeningResponse> {
    const response = await apiClient.post<TenantScreeningResponse>(
      "/tenant-screening",
      formData,
    );
    return response.data;
  }
}

export const tenantScreeningService = new TenantScreeningService();
