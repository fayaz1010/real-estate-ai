// PLACEHOLDER FILE: services\verificationService.ts
// TODO: Add your implementation here

import { VerificationStatus } from '../types/application.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

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
  matchScore: number; // 0-100
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
  documents: string[]; // Document IDs
}

export interface IncomeVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  verifiedIncome: number;
  method: 'paystub' | 'bank_statement' | 'tax_return' | 'employer_letter' | 'plaid';
  confidence: number; // 0-100
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
  method: 'supervisor_contact' | 'hr_verification' | 'document_verification';
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
  /**
   * Verify identity using ID document and biometrics
   */
  verifyIdentity: async (
    applicationId: string,
    data: IdentityVerificationRequest
  ): Promise<IdentityVerificationResult> => {
    return apiCall(`/applications/${applicationId}/verify-identity`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify income from documents
   */
  verifyIncome: async (
    applicationId: string,
    data: IncomeVerificationRequest
  ): Promise<IncomeVerificationResult> => {
    return apiCall(`/applications/${applicationId}/verify-income`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify employment
   */
  verifyEmployment: async (
    applicationId: string,
    data: EmploymentVerificationRequest
  ): Promise<EmploymentVerificationResult> => {
    return apiCall(`/applications/${applicationId}/verify-employment`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get Plaid Link token for bank account verification
   */
  getPlaidLinkToken: async (applicationId: string): Promise<PlaidLinkToken> => {
    return apiCall(`/applications/${applicationId}/plaid/link-token`, {
      method: 'POST',
    });
  },

  /**
   * Exchange Plaid public token for account data
   */
  exchangePlaidToken: async (
    applicationId: string,
    publicToken: string
  ): Promise<PlaidAccountData> => {
    return apiCall(`/applications/${applicationId}/plaid/exchange-token`, {
      method: 'POST',
      body: JSON.stringify({ publicToken }),
    });
  },

  /**
   * Get verification status for all checks
   */
  getVerificationStatus: async (applicationId: string): Promise<{
    identity: VerificationStatus;
    income: VerificationStatus;
    employment: VerificationStatus;
    credit: VerificationStatus;
    background: VerificationStatus;
  }> => {
    return apiCall(`/applications/${applicationId}/verification-status`);
  },

  /**
   * Request manual verification review
   */
  requestManualReview: async (
    applicationId: string,
    verificationType: 'identity' | 'income' | 'employment',
    notes?: string
  ): Promise<void> => {
    return apiCall(`/applications/${applicationId}/request-manual-review`, {
      method: 'POST',
      body: JSON.stringify({ verificationType, notes }),
    });
  },

  /**
   * Resend verification email/SMS
   */
  resendVerificationRequest: async (
    applicationId: string,
    verificationType: string,
    method: 'email' | 'sms'
  ): Promise<void> => {
    return apiCall(`/applications/${applicationId}/resend-verification`, {
      method: 'POST',
      body: JSON.stringify({ verificationType, method }),
    });
  },

  /**
   * Upload selfie for identity verification
   */
  uploadSelfie: async (
    applicationId: string,
    selfieBlob: Blob
  ): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('selfie', selfieBlob, 'selfie.jpg');

    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(
      `${API_BASE}/applications/${applicationId}/upload-selfie`,
      {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Selfie upload failed');
    }

    return response.json();
  },

  /**
   * Verify phone number with OTP
   */
  sendPhoneVerificationCode: async (
    applicationId: string,
    phoneNumber: string
  ): Promise<{ codeSent: boolean }> => {
    return apiCall(`/applications/${applicationId}/verify-phone/send`, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },

  /**
   * Confirm phone verification code
   */
  confirmPhoneVerificationCode: async (
    applicationId: string,
    code: string
  ): Promise<{ verified: boolean }> => {
    return apiCall(`/applications/${applicationId}/verify-phone/confirm`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Verify email address
   */
  sendEmailVerification: async (
    applicationId: string,
    email: string
  ): Promise<{ emailSent: boolean }> => {
    return apiCall(`/applications/${applicationId}/verify-email/send`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Confirm email verification
   */
  confirmEmailVerification: async (
    applicationId: string,
    token: string
  ): Promise<{ verified: boolean }> => {
    return apiCall(`/applications/${applicationId}/verify-email/confirm`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};