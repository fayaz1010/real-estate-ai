// PLACEHOLDER FILE: services\backgroundCheckService.ts
// TODO: Add your implementation here

import {
  BackgroundCheckResult,
  CriminalRecord,
  EvictionRecord,
} from "../types/application.types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

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
  /**
   * Get available background check packages
   */
  getPackages: async (): Promise<BackgroundCheckPackage[]> => {
    return apiCall("/background-checks/packages");
  },

  /**
   * Order a background check
   */
  orderBackgroundCheck: async (
    applicationId: string,
    packageId: string,
    data: BackgroundCheckRequest,
  ): Promise<BackgroundCheckOrder> => {
    return apiCall(`/applications/${applicationId}/background-check`, {
      method: "POST",
      body: JSON.stringify({ packageId, ...data }),
    });
  },

  /**
   * Get background check status
   */
  getBackgroundCheckStatus: async (
    applicationId: string,
  ): Promise<BackgroundCheckOrder> => {
    return apiCall(`/applications/${applicationId}/background-check`);
  },

  /**
   * Get full background check report
   */
  getBackgroundCheckReport: async (
    applicationId: string,
  ): Promise<BackgroundCheckResult> => {
    return apiCall(`/applications/${applicationId}/background-check/report`);
  },

  /**
   * Download background check PDF
   */
  downloadBackgroundCheckPDF: async (applicationId: string): Promise<Blob> => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE}/applications/${applicationId}/background-check/pdf`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    );

    if (!response.ok) {
      throw new Error("PDF download failed");
    }

    return response.blob();
  },

  /**
   * Cancel pending background check
   */
  cancelBackgroundCheck: async (applicationId: string): Promise<void> => {
    return apiCall(`/applications/${applicationId}/background-check`, {
      method: "DELETE",
    });
  },

  /**
   * Dispute background check findings
   */
  disputeBackgroundCheck: async (
    applicationId: string,
    reason: string,
    details: string,
    supportingDocuments?: string[],
  ): Promise<{ disputeId: string }> => {
    return apiCall(`/applications/${applicationId}/background-check/dispute`, {
      method: "POST",
      body: JSON.stringify({ reason, details, supportingDocuments }),
    });
  },

  /**
   * Get criminal record details
   */
  getCriminalRecordDetails: async (
    recordId: string,
  ): Promise<CriminalRecord> => {
    return apiCall(`/background-checks/criminal-records/${recordId}`);
  },

  /**
   * Get eviction record details
   */
  getEvictionRecordDetails: async (
    recordId: string,
  ): Promise<EvictionRecord> => {
    return apiCall(`/background-checks/eviction-records/${recordId}`);
  },

  /**
   * Request background check consent form
   */
  getConsentForm: async (): Promise<{
    formHtml: string;
    disclosures: string[];
  }> => {
    return apiCall("/background-checks/consent-form");
  },

  /**
   * Submit signed consent
   */
  submitConsent: async (
    applicationId: string,
    signature: string,
    ipAddress: string,
  ): Promise<{ consentRecorded: boolean }> => {
    return apiCall(`/applications/${applicationId}/background-check/consent`, {
      method: "POST",
      body: JSON.stringify({ signature, ipAddress }),
    });
  },

  /**
   * Get applicant's background check history
   */
  getBackgroundCheckHistory: async (): Promise<BackgroundCheckOrder[]> => {
    return apiCall("/background-checks/my-history");
  },

  /**
   * Estimate background check cost
   */
  estimateCost: async (
    packageId: string,
    state: string,
  ): Promise<{ cost: number; breakdown: any }> => {
    return apiCall("/background-checks/estimate-cost", {
      method: "POST",
      body: JSON.stringify({ packageId, state }),
    });
  },
};
