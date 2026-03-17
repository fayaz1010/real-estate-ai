import apiClient from "@/api/client";
import {
  BackgroundCheckResult,
  CriminalRecord,
  EvictionRecord,
} from "../types/application.types";

export interface BackgroundCheckRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  previousAddresses?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }[];
  consentGiven: boolean;
  consentDate: string;
  consentSignature: string;
}

export interface BackgroundCheckPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
  turnaroundTime: string;
}

export interface BackgroundCheckOrder {
  id: string;
  applicationId: string;
  packageId: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  orderedAt: string;
  completedAt?: string;
  result?: BackgroundCheckResult;
}

export const backgroundCheckService = {
  getPackages: async (): Promise<BackgroundCheckPackage[]> => {
    const { data } = await apiClient.get<BackgroundCheckPackage[]>("/background-checks/packages");
    return data;
  },

  orderBackgroundCheck: async (
    applicationId: string,
    packageId: string,
    data: BackgroundCheckRequest,
  ): Promise<BackgroundCheckOrder> => {
    const { data: result } = await apiClient.post<BackgroundCheckOrder>(
      `/applications/${applicationId}/background-check`,
      { packageId, ...data },
    );
    return result;
  },

  getBackgroundCheckStatus: async (applicationId: string): Promise<BackgroundCheckOrder> => {
    const { data } = await apiClient.get<BackgroundCheckOrder>(
      `/applications/${applicationId}/background-check`,
    );
    return data;
  },

  getBackgroundCheckReport: async (applicationId: string): Promise<BackgroundCheckResult> => {
    const { data } = await apiClient.get<BackgroundCheckResult>(
      `/applications/${applicationId}/background-check/report`,
    );
    return data;
  },

  downloadBackgroundCheckPDF: async (applicationId: string): Promise<Blob> => {
    const { data } = await apiClient.get(
      `/applications/${applicationId}/background-check/pdf`,
      { responseType: "blob" },
    );
    return data;
  },

  cancelBackgroundCheck: async (applicationId: string): Promise<void> => {
    await apiClient.delete(`/applications/${applicationId}/background-check`);
  },

  disputeBackgroundCheck: async (
    applicationId: string,
    reason: string,
    details: string,
    supportingDocuments?: string[],
  ): Promise<{ disputeId: string }> => {
    const { data } = await apiClient.post<{ disputeId: string }>(
      `/applications/${applicationId}/background-check/dispute`,
      { reason, details, supportingDocuments },
    );
    return data;
  },

  getCriminalRecordDetails: async (recordId: string): Promise<CriminalRecord> => {
    const { data } = await apiClient.get<CriminalRecord>(`/background-checks/criminal-records/${recordId}`);
    return data;
  },

  getEvictionRecordDetails: async (recordId: string): Promise<EvictionRecord> => {
    const { data } = await apiClient.get<EvictionRecord>(`/background-checks/eviction-records/${recordId}`);
    return data;
  },

  getConsentForm: async (): Promise<{ formHtml: string; disclosures: string[] }> => {
    const { data } = await apiClient.get<{ formHtml: string; disclosures: string[] }>(
      "/background-checks/consent-form",
    );
    return data;
  },

  submitConsent: async (
    applicationId: string,
    signature: string,
    ipAddress: string,
  ): Promise<{ consentRecorded: boolean }> => {
    const { data } = await apiClient.post<{ consentRecorded: boolean }>(
      `/applications/${applicationId}/background-check/consent`,
      { signature, ipAddress },
    );
    return data;
  },

  getBackgroundCheckHistory: async (): Promise<BackgroundCheckOrder[]> => {
    const { data } = await apiClient.get<BackgroundCheckOrder[]>("/background-checks/my-history");
    return data;
  },

  estimateCost: async (
    packageId: string,
    state: string,
  ): Promise<{ cost: number; breakdown: any }> => {
    const { data } = await apiClient.post<{ cost: number; breakdown: any }>(
      "/background-checks/estimate-cost",
      { packageId, state },
    );
    return data;
  },
};
