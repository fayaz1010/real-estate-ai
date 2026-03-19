// PLACEHOLDER FILE: store\verificationSlice.ts
// TODO: Add your implementation here

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  backgroundCheckService,
  BackgroundCheckRequest,
} from "../services/backgroundCheckService";
import {
  creditCheckService,
  CreditCheckRequest,
} from "../services/creditCheckService";
import {
  verificationService,
  IdentityVerificationRequest,
  IncomeVerificationRequest,
  EmploymentVerificationRequest,
} from "../services/verificationService";
import {
  VerificationStatus,
  CreditCheckResult,
  BackgroundCheckResult,
} from "../types/application.types";

interface VerificationState {
  // Verification statuses
  identityStatus: VerificationStatus;
  incomeStatus: VerificationStatus;
  employmentStatus: VerificationStatus;
  creditStatus: VerificationStatus;
  backgroundStatus: VerificationStatus;

  // Results
  creditCheck: CreditCheckResult | null;
  backgroundCheck: BackgroundCheckResult | null;

  // Plaid integration
  plaidLinkToken: string | null;
  plaidConnected: boolean;

  // UI state
  loading: boolean;
  error: string | null;

  // Verification progress
  verificationProgress: number; // 0-100
}

const initialState: VerificationState = {
  identityStatus: "not_started",
  incomeStatus: "not_started",
  employmentStatus: "not_started",
  creditStatus: "not_started",
  backgroundStatus: "not_started",
  creditCheck: null,
  backgroundCheck: null,
  plaidLinkToken: null,
  plaidConnected: false,
  loading: false,
  error: null,
  verificationProgress: 0,
};

// Async Thunks

export const verifyIdentity = createAsyncThunk(
  "verification/identity",
  async ({
    applicationId,
    data,
  }: {
    applicationId: string;
    data: IdentityVerificationRequest;
  }) => {
    const result = await verificationService.verifyIdentity(
      applicationId,
      data,
    );
    return result;
  },
);

export const verifyIncome = createAsyncThunk(
  "verification/income",
  async ({
    applicationId,
    data,
  }: {
    applicationId: string;
    data: IncomeVerificationRequest;
  }) => {
    const result = await verificationService.verifyIncome(applicationId, data);
    return result;
  },
);

export const verifyEmployment = createAsyncThunk(
  "verification/employment",
  async ({
    applicationId,
    data,
  }: {
    applicationId: string;
    data: EmploymentVerificationRequest;
  }) => {
    const result = await verificationService.verifyEmployment(
      applicationId,
      data,
    );
    return result;
  },
);

export const orderCreditCheck = createAsyncThunk(
  "verification/creditCheck",
  async ({
    applicationId,
    packageId,
    data,
  }: {
    applicationId: string;
    packageId: string;
    data: CreditCheckRequest;
  }) => {
    const result = await creditCheckService.orderCreditCheck(
      applicationId,
      packageId,
      data,
    );
    return result;
  },
);

export const getCreditCheckStatus = createAsyncThunk(
  "verification/getCreditStatus",
  async (applicationId: string) => {
    const result = await creditCheckService.getCreditCheckStatus(applicationId);
    return result;
  },
);

export const orderBackgroundCheck = createAsyncThunk(
  "verification/backgroundCheck",
  async ({
    applicationId,
    packageId,
    data,
  }: {
    applicationId: string;
    packageId: string;
    data: BackgroundCheckRequest;
  }) => {
    const result = await backgroundCheckService.orderBackgroundCheck(
      applicationId,
      packageId,
      data,
    );
    return result;
  },
);

export const getBackgroundCheckStatus = createAsyncThunk(
  "verification/getBackgroundStatus",
  async (applicationId: string) => {
    const result =
      await backgroundCheckService.getBackgroundCheckStatus(applicationId);
    return result;
  },
);

export const getPlaidLinkToken = createAsyncThunk(
  "verification/plaidToken",
  async (applicationId: string) => {
    const result = await verificationService.getPlaidLinkToken(applicationId);
    return result;
  },
);

export const exchangePlaidToken = createAsyncThunk(
  "verification/plaidExchange",
  async ({
    applicationId,
    publicToken,
  }: {
    applicationId: string;
    publicToken: string;
  }) => {
    const result = await verificationService.exchangePlaidToken(
      applicationId,
      publicToken,
    );
    return result;
  },
);

export const fetchVerificationStatus = createAsyncThunk(
  "verification/fetchStatus",
  async (applicationId: string) => {
    const status =
      await verificationService.getVerificationStatus(applicationId);
    return status;
  },
);

export const sendPhoneVerification = createAsyncThunk(
  "verification/sendPhone",
  async ({
    applicationId,
    phoneNumber,
  }: {
    applicationId: string;
    phoneNumber: string;
  }) => {
    const result = await verificationService.sendPhoneVerificationCode(
      applicationId,
      phoneNumber,
    );
    return result;
  },
);

export const confirmPhoneVerification = createAsyncThunk(
  "verification/confirmPhone",
  async ({ applicationId, code }: { applicationId: string; code: string }) => {
    const result = await verificationService.confirmPhoneVerificationCode(
      applicationId,
      code,
    );
    return result;
  },
);

// Slice

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    resetVerification: (_state) => {
      return initialState;
    },

    updateVerificationProgress: (state) => {
      let completed = 0;
      const total = 5;

      if (state.identityStatus === "verified") completed++;
      if (state.incomeStatus === "verified") completed++;
      if (state.employmentStatus === "verified") completed++;
      if (state.creditStatus === "verified") completed++;
      if (state.backgroundStatus === "verified") completed++;

      state.verificationProgress = Math.round((completed / total) * 100);
    },
  },
  extraReducers: (builder) => {
    // Identity Verification
    builder.addCase(verifyIdentity.pending, (state) => {
      state.loading = true;
      state.identityStatus = "in_progress";
      state.error = null;
    });
    builder.addCase(verifyIdentity.fulfilled, (state, action) => {
      state.loading = false;
      state.identityStatus = action.payload.status;
    });
    builder.addCase(verifyIdentity.rejected, (state, action) => {
      state.loading = false;
      state.identityStatus = "failed";
      state.error = action.error.message || "Identity verification failed";
    });

    // Income Verification
    builder.addCase(verifyIncome.pending, (state) => {
      state.loading = true;
      state.incomeStatus = "in_progress";
      state.error = null;
    });
    builder.addCase(verifyIncome.fulfilled, (state, action) => {
      state.loading = false;
      state.incomeStatus = action.payload.status;
    });
    builder.addCase(verifyIncome.rejected, (state, action) => {
      state.loading = false;
      state.incomeStatus = "failed";
      state.error = action.error.message || "Income verification failed";
    });

    // Employment Verification
    builder.addCase(verifyEmployment.pending, (state) => {
      state.loading = true;
      state.employmentStatus = "in_progress";
      state.error = null;
    });
    builder.addCase(verifyEmployment.fulfilled, (state, action) => {
      state.loading = false;
      state.employmentStatus = action.payload.status;
    });
    builder.addCase(verifyEmployment.rejected, (state, action) => {
      state.loading = false;
      state.employmentStatus = "failed";
      state.error = action.error.message || "Employment verification failed";
    });

    // Credit Check
    builder.addCase(orderCreditCheck.pending, (state) => {
      state.loading = true;
      state.creditStatus = "pending";
      state.error = null;
    });
    builder.addCase(orderCreditCheck.fulfilled, (state, action) => {
      state.loading = false;
      // Map service status to VerificationStatus
      const statusMap: Record<string, VerificationStatus> = {
        pending: "pending",
        processing: "in_progress",
        completed: "verified",
        failed: "failed",
        disputed: "manual_review",
      };
      state.creditStatus = statusMap[action.payload.status] || "pending";
    });
    builder.addCase(orderCreditCheck.rejected, (state, action) => {
      state.loading = false;
      state.creditStatus = "failed";
      state.error = action.error.message || "Credit check order failed";
    });

    // Get Credit Check Status
    builder.addCase(getCreditCheckStatus.fulfilled, (state, action) => {
      const statusMap: Record<string, VerificationStatus> = {
        pending: "pending",
        processing: "in_progress",
        completed: "verified",
        failed: "failed",
        disputed: "manual_review",
      };
      state.creditStatus = statusMap[action.payload.status] || "pending";
      if (action.payload.result) {
        state.creditCheck = action.payload.result;
      }
    });

    // Background Check
    builder.addCase(orderBackgroundCheck.pending, (state) => {
      state.loading = true;
      state.backgroundStatus = "pending";
      state.error = null;
    });
    builder.addCase(orderBackgroundCheck.fulfilled, (state, action) => {
      state.loading = false;
      const statusMap: Record<string, VerificationStatus> = {
        pending: "pending",
        in_progress: "in_progress",
        completed: "verified",
        cancelled: "failed",
      };
      state.backgroundStatus = statusMap[action.payload.status] || "pending";
    });
    builder.addCase(orderBackgroundCheck.rejected, (state, action) => {
      state.loading = false;
      state.backgroundStatus = "failed";
      state.error = action.error.message || "Background check order failed";
    });

    // Get Background Check Status
    builder.addCase(getBackgroundCheckStatus.fulfilled, (state, action) => {
      const statusMap: Record<string, VerificationStatus> = {
        pending: "pending",
        in_progress: "in_progress",
        completed: "verified",
        cancelled: "failed",
      };
      state.backgroundStatus = statusMap[action.payload.status] || "pending";
      if (action.payload.result) {
        state.backgroundCheck = action.payload.result;
      }
    });

    // Plaid Link Token
    builder.addCase(getPlaidLinkToken.fulfilled, (state, action) => {
      state.plaidLinkToken = action.payload.linkToken;
    });

    // Plaid Exchange
    builder.addCase(exchangePlaidToken.fulfilled, (state) => {
      state.plaidConnected = true;
      state.incomeStatus = "verified";
    });

    // Fetch Verification Status
    builder.addCase(fetchVerificationStatus.fulfilled, (state, action) => {
      state.identityStatus = action.payload.identity;
      state.incomeStatus = action.payload.income;
      state.employmentStatus = action.payload.employment;
      state.creditStatus = action.payload.credit;
      state.backgroundStatus = action.payload.background;
    });

    // Phone Verification
    builder.addCase(confirmPhoneVerification.fulfilled, (state, action) => {
      if (action.payload.verified) {
        // Mark phone as verified (could add to identity verification)
      }
    });
  },
});

export const { clearError, resetVerification, updateVerificationProgress } =
  verificationSlice.actions;

export default verificationSlice.reducer;
