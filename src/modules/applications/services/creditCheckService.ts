import apiClient from "@/api/client";
import { CreditCheckResult } from "../types/application.types";

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
  getPackages: async (): Promise<CreditCheckPackage[]> => {
    const { data } = await apiClient.get<CreditCheckPackage[]>("/credit-checks/packages");
    return data;
  },

  orderCreditCheck: async (
    applicationId: string,
    packageId: string,
    reqData: CreditCheckRequest,
  ): Promise<CreditCheckOrder> => {
    const { data } = await apiClient.post<CreditCheckOrder>(
      `/applications/${applicationId}/credit-check`,
      { packageId, ...reqData },
    );
    return data;
  },

  getCreditCheckStatus: async (applicationId: string): Promise<CreditCheckOrder> => {
    const { data } = await apiClient.get<CreditCheckOrder>(
      `/applications/${applicationId}/credit-check`,
    );
    return data;
  },

  getCreditReport: async (applicationId: string): Promise<CreditReport> => {
    const { data } = await apiClient.get<CreditReport>(
      `/applications/${applicationId}/credit-check/report`,
    );
    return data;
  },

  downloadCreditReportPDF: async (applicationId: string): Promise<Blob> => {
    const { data } = await apiClient.get(
      `/applications/${applicationId}/credit-check/pdf`,
      { responseType: "blob" },
    );
    return data;
  },

  getConsentForm: async (): Promise<{ formHtml: string; disclosures: string[]; legalNotices: string[] }> => {
    const { data } = await apiClient.get<{ formHtml: string; disclosures: string[]; legalNotices: string[] }>(
      "/credit-checks/consent-form",
    );
    return data;
  },

  submitConsent: async (
    applicationId: string,
    signature: string,
    ipAddress: string,
  ): Promise<{ consentRecorded: boolean }> => {
    const { data } = await apiClient.post<{ consentRecorded: boolean }>(
      `/applications/${applicationId}/credit-check/consent`,
      { signature, ipAddress },
    );
    return data;
  },

  disputeCreditReport: async (
    applicationId: string,
    items: { type: "account" | "inquiry" | "public_record"; itemId: string; reason: string; explanation: string }[],
  ): Promise<{ disputeId: string }> => {
    const { data } = await apiClient.post<{ disputeId: string }>(
      `/applications/${applicationId}/credit-check/dispute`,
      { items },
    );
    return data;
  },

  getCreditScoreInterpretation: async (
    score: number,
  ): Promise<{ rating: "excellent" | "good" | "fair" | "poor" | "very_poor"; description: string; recommendations: string[] }> => {
    const { data } = await apiClient.get<{ rating: "excellent" | "good" | "fair" | "poor" | "very_poor"; description: string; recommendations: string[] }>(
      `/credit-checks/interpret-score?score=${score}`,
    );
    return data;
  },

  getMyCreditCheckHistory: async (): Promise<CreditCheckOrder[]> => {
    const { data } = await apiClient.get<CreditCheckOrder[]>("/credit-checks/history");
    return data;
  },
};
