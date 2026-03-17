import { tokenManager } from "../../auth/utils/tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

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
    const response = await fetch(`${API_BASE_URL}/tenant-screening`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        error?.message || "Failed to submit tenant screening form",
      );
    }

    return response.json();
  }
}

export const tenantScreeningService = new TenantScreeningService();
