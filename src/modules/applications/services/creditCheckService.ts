// PLACEHOLDER FILE: services\creditCheckService.ts
// TODO: Add your implementation here

import { CreditCheckResult } from "../types/application.types";

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

export interface CreditCheckRequest {
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
  consentGiven: boolean;
  consentDate: string;
  purpose: "rental_application" | "employment" | "loan";
}

export interface CreditCheckPackage {
  id: string;
  provider: "experian" | "equifax" | "transunion" | "all_three";
  name: string;
  description: string;
  price: number;
  includes: string[];
}

export interface CreditReport {
  score: number;
  provider: "experian" | "equifax" | "transunion";
  reportDate: string;
  accounts: {
    type: string;
    creditor: string;
    balance: number;
    paymentStatus: "current" | "late" | "delinquent" | "closed";
    monthlyPayment?: number;
    openedDate: string;
  }[];
  inquiries: {
    date: string;
    creditor: string;
    type: "hard" | "soft";
  }[];
  publicRecords: {
    type: "bankruptcy" | "judgment" | "lien" | "foreclosure";
    filedDate: string;
    amount?: number;
    status: "open" | "satisfied" | "dismissed";
  }[];
  alerts: string[];
  summary: {
    totalAccounts: number;
    openAccounts: number;
    closedAccounts: number;
    delinquentAccounts: number;
    totalDebt: number;
    creditUtilization: number;
    oldestAccount: string;
    averageAccountAge: number;
  };
}

export interface CreditCheckOrder {
  id: string;
  applicationId: string;
  packageId: string;
  status: "pending" | "processing" | "completed" | "failed" | "disputed";
  orderedAt: string;
  completedAt?: string;
  result?: CreditCheckResult;
  report?: CreditReport;
}

export const creditCheckService = {
  /**
   * Get available credit check packages
   */
  getPackages: async (): Promise<CreditCheckPackage[]> => {
    return apiCall("/credit-checks/packages");
  },

  /**
   * Order a credit check
   */
  orderCreditCheck: async (
    applicationId: string,
    packageId: string,
    data: CreditCheckRequest,
  ): Promise<CreditCheckOrder> => {
    return apiCall(`/applications/${applicationId}/credit-check`, {
      method: "POST",
      body: JSON.stringify({ packageId, ...data }),
    });
  },

  /**
   * Get credit check status
   */
  getCreditCheckStatus: async (
    applicationId: string,
  ): Promise<CreditCheckOrder> => {
    return apiCall(`/applications/${applicationId}/credit-check`);
  },

  /**
   * Get full credit report
   */
  getCreditReport: async (applicationId: string): Promise<CreditReport> => {
    return apiCall(`/applications/${applicationId}/credit-check/report`);
  },

  /**
   * Download credit report PDF
   */
  downloadCreditReportPDF: async (applicationId: string): Promise<Blob> => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE}/applications/${applicationId}/credit-check/pdf`,
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
   * Get credit check consent form
   */
  getConsentForm: async (): Promise<{
    formHtml: string;
    disclosures: string[];
    legalNotices: string[];
  }> => {
    return apiCall("/credit-checks/consent-form");
  },

  /**
   * Submit signed consent for credit check
   */
  submitConsent: async (
    applicationId: string,
    signature: string,
    ipAddress: string,
  ): Promise<{ consentRecorded: boolean }> => {
    return apiCall(`/applications/${applicationId}/credit-check/consent`, {
      method: "POST",
      body: JSON.stringify({ signature, ipAddress }),
    });
  },

  /**
   * Dispute credit check findings
   */
  disputeCreditReport: async (
    applicationId: string,
    items: {
      type: "account" | "inquiry" | "public_record";
      itemId: string;
      reason: string;
      explanation: string;
    }[],
  ): Promise<{ disputeId: string }> => {
    return apiCall(`/applications/${applicationId}/credit-check/dispute`, {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },

  /**
   * Get credit score interpretation
   */
  getCreditScoreInterpretation: async (
    score: number,
  ): Promise<{
    rating: "excellent" | "good" | "fair" | "poor" | "very_poor";
    description: string;
    recommendations: string[];
  }> => {
    return apiCall(`/credit-checks/interpret-score?score=${score}`);
  },

  /**
   * Get my credit check history
   */
  getMyCreditCheckHistory: async (): Promise<CreditCheckOrder[]> => {
    return apiCall("/credit-checks/history");
  },
};
