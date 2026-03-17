import { VerificationStatus } from "../types/application.types";

import apiClient from "@/api/client";

export interface IdentityVerificationRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  idType: string;
  idNumber: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
}

export interface IdentityVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  matchScore: number;
  checks: {
    documentAuthenticity: boolean;
    faceMatch: boolean;
    dataMatch: boolean;
  };
  verifiedAt?: string;
  message?: string;
}

export interface IncomeVerificationRequest {
  employerName: string;
  annualIncome: number;
  employmentStartDate: string;
  documents: string[];
}

export interface IncomeVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  verifiedIncome: number;
  method:
    | "paystub"
    | "bank_statement"
    | "tax_return"
    | "employer_letter"
    | "plaid";
  confidence: number;
  verifiedAt?: string;
  message?: string;
}

export interface EmploymentVerificationRequest {
  employerName: string;
  jobTitle: string;
  startDate: string;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
}

export interface EmploymentVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  method: "supervisor_contact" | "hr_verification" | "document_verification";
  details: {
    employerConfirmed: boolean;
    titleConfirmed: boolean;
    datesConfirmed: boolean;
  };
  verifiedAt?: string;
  message?: string;
}

export interface PlaidLinkToken {
  linkToken: string;
  expiration: string;
}

export interface PlaidAccountData {
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }[];
  income: {
    totalMonthly: number;
    sources: {
      employer: string;
      amount: number;
      frequency: string;
    }[];
  };
}

export const verificationService = {
  verifyIdentity: async (
    applicationId: string,
    reqData: IdentityVerificationRequest,
  ): Promise<IdentityVerificationResult> => {
    const { data } = await apiClient.post<IdentityVerificationResult>(
      `/applications/${applicationId}/verify-identity`,
      reqData,
    );
    return data;
  },

  verifyIncome: async (
    applicationId: string,
    reqData: IncomeVerificationRequest,
  ): Promise<IncomeVerificationResult> => {
    const { data } = await apiClient.post<IncomeVerificationResult>(
      `/applications/${applicationId}/verify-income`,
      reqData,
    );
    return data;
  },

  verifyEmployment: async (
    applicationId: string,
    reqData: EmploymentVerificationRequest,
  ): Promise<EmploymentVerificationResult> => {
    const { data } = await apiClient.post<EmploymentVerificationResult>(
      `/applications/${applicationId}/verify-employment`,
      reqData,
    );
    return data;
  },

  getPlaidLinkToken: async (applicationId: string): Promise<PlaidLinkToken> => {
    const { data } = await apiClient.post<PlaidLinkToken>(
      `/applications/${applicationId}/plaid/link-token`,
    );
    return data;
  },

  exchangePlaidToken: async (
    applicationId: string,
    publicToken: string,
  ): Promise<PlaidAccountData> => {
    const { data } = await apiClient.post<PlaidAccountData>(
      `/applications/${applicationId}/plaid/exchange-token`,
      { publicToken },
    );
    return data;
  },

  getVerificationStatus: async (
    applicationId: string,
  ): Promise<{
    identity: VerificationStatus;
    income: VerificationStatus;
    employment: VerificationStatus;
    credit: VerificationStatus;
    background: VerificationStatus;
  }> => {
    const { data } = await apiClient.get(
      `/applications/${applicationId}/verification-status`,
    );
    return data;
  },

  requestManualReview: async (
    applicationId: string,
    verificationType: "identity" | "income" | "employment",
    notes?: string,
  ): Promise<void> => {
    await apiClient.post(
      `/applications/${applicationId}/request-manual-review`,
      {
        verificationType,
        notes,
      },
    );
  },

  resendVerificationRequest: async (
    applicationId: string,
    verificationType: string,
    method: "email" | "sms",
  ): Promise<void> => {
    await apiClient.post(`/applications/${applicationId}/resend-verification`, {
      verificationType,
      method,
    });
  },

  uploadSelfie: async (
    applicationId: string,
    selfieBlob: Blob,
  ): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("selfie", selfieBlob, "selfie.jpg");
    const { data } = await apiClient.post<{ imageUrl: string }>(
      `/applications/${applicationId}/upload-selfie`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  sendPhoneVerificationCode: async (
    applicationId: string,
    phoneNumber: string,
  ): Promise<{ codeSent: boolean }> => {
    const { data } = await apiClient.post<{ codeSent: boolean }>(
      `/applications/${applicationId}/verify-phone/send`,
      { phoneNumber },
    );
    return data;
  },

  confirmPhoneVerificationCode: async (
    applicationId: string,
    code: string,
  ): Promise<{ verified: boolean }> => {
    const { data } = await apiClient.post<{ verified: boolean }>(
      `/applications/${applicationId}/verify-phone/confirm`,
      { code },
    );
    return data;
  },

  sendEmailVerification: async (
    applicationId: string,
    email: string,
  ): Promise<{ emailSent: boolean }> => {
    const { data } = await apiClient.post<{ emailSent: boolean }>(
      `/applications/${applicationId}/verify-email/send`,
      { email },
    );
    return data;
  },

  confirmEmailVerification: async (
    applicationId: string,
    token: string,
  ): Promise<{ verified: boolean }> => {
    const { data } = await apiClient.post<{ verified: boolean }>(
      `/applications/${applicationId}/verify-email/confirm`,
      { token },
    );
    return data;
  },
};
