// PLACEHOLDER FILE: hooks\useVerification.ts
// TODO: Add your implementation here
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../../store";
import { BackgroundCheckRequest } from "../services/backgroundCheckService";
import { CreditCheckRequest } from "../services/creditCheckService";
import {
  IdentityVerificationRequest,
  IncomeVerificationRequest,
  EmploymentVerificationRequest,
} from "../services/verificationService";
import {
  verifyIdentity,
  verifyIncome,
  verifyEmployment,
  orderCreditCheck,
  getCreditCheckStatus,
  orderBackgroundCheck,
  getBackgroundCheckStatus,
  getPlaidLinkToken,
  exchangePlaidToken,
  fetchVerificationStatus,
  sendPhoneVerification,
  confirmPhoneVerification,
  updateVerificationProgress,
  clearError,
  resetVerification,
} from "../store/verificationSlice";

export const useVerification = (applicationId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    identityStatus,
    incomeStatus,
    employmentStatus,
    creditStatus,
    backgroundStatus,
    creditCheck,
    backgroundCheck,
    plaidLinkToken,
    plaidConnected,
    loading,
    error,
    verificationProgress,
  } = useSelector((state: RootState) => state.verification);

  // Update progress when statuses change
  useEffect(() => {
    dispatch(updateVerificationProgress());
  }, [
    identityStatus,
    incomeStatus,
    employmentStatus,
    creditStatus,
    backgroundStatus,
    dispatch,
  ]);

  // Fetch verification status on mount
  useEffect(() => {
    if (applicationId) {
      dispatch(fetchVerificationStatus(applicationId));
    }
  }, [applicationId, dispatch]);

  // Identity verification
  const startIdentityVerification = useCallback(
    async (data: IdentityVerificationRequest) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(verifyIdentity({ applicationId, data }));
      return result.payload;
    },
    [applicationId, dispatch],
  );

  // Income verification
  const startIncomeVerification = useCallback(
    async (data: IncomeVerificationRequest) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(verifyIncome({ applicationId, data }));
      return result.payload;
    },
    [applicationId, dispatch],
  );

  // Employment verification
  const startEmploymentVerification = useCallback(
    async (data: EmploymentVerificationRequest) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(verifyEmployment({ applicationId, data }));
      return result.payload;
    },
    [applicationId, dispatch],
  );

  // Credit check
  const startCreditCheck = useCallback(
    async (packageId: string, data: CreditCheckRequest) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(
        orderCreditCheck({ applicationId, packageId, data }),
      );
      return result.payload;
    },
    [applicationId, dispatch],
  );

  const checkCreditStatus = useCallback(async () => {
    if (!applicationId) throw new Error("Application ID required");
    const result = await dispatch(getCreditCheckStatus(applicationId));
    return result.payload;
  }, [applicationId, dispatch]);

  // Background check
  const startBackgroundCheck = useCallback(
    async (packageId: string, data: BackgroundCheckRequest) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(
        orderBackgroundCheck({ applicationId, packageId, data }),
      );
      return result.payload;
    },
    [applicationId, dispatch],
  );

  const checkBackgroundStatus = useCallback(async () => {
    if (!applicationId) throw new Error("Application ID required");
    const result = await dispatch(getBackgroundCheckStatus(applicationId));
    return result.payload;
  }, [applicationId, dispatch]);

  // Plaid integration
  const initializePlaid = useCallback(async () => {
    if (!applicationId) throw new Error("Application ID required");
    const result = await dispatch(getPlaidLinkToken(applicationId));
    return result.payload;
  }, [applicationId, dispatch]);

  const connectPlaid = useCallback(
    async (publicToken: string) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(
        exchangePlaidToken({ applicationId, publicToken }),
      );
      return result.payload;
    },
    [applicationId, dispatch],
  );

  // Phone verification
  const sendPhoneCode = useCallback(
    async (phoneNumber: string) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(
        sendPhoneVerification({ applicationId, phoneNumber }),
      );
      return result.payload;
    },
    [applicationId, dispatch],
  );

  const verifyPhoneCode = useCallback(
    async (code: string) => {
      if (!applicationId) throw new Error("Application ID required");
      const result = await dispatch(
        confirmPhoneVerification({ applicationId, code }),
      );
      return result.payload;
    },
    [applicationId, dispatch],
  );

  // Helpers
  const isAllVerified = useCallback(() => {
    return (
      identityStatus === "verified" &&
      incomeStatus === "verified" &&
      employmentStatus === "verified" &&
      creditStatus === "verified" &&
      backgroundStatus === "verified"
    );
  }, [
    identityStatus,
    incomeStatus,
    employmentStatus,
    creditStatus,
    backgroundStatus,
  ]);

  const getVerificationSteps = useCallback(() => {
    return [
      {
        name: "Identity",
        status: identityStatus,
        required: true,
        icon: "user-check",
      },
      {
        name: "Income",
        status: incomeStatus,
        required: true,
        icon: "dollar-sign",
      },
      {
        name: "Employment",
        status: employmentStatus,
        required: true,
        icon: "briefcase",
      },
      {
        name: "Credit",
        status: creditStatus,
        required: true,
        icon: "credit-card",
      },
      {
        name: "Background",
        status: backgroundStatus,
        required: true,
        icon: "shield",
      },
    ];
  }, [
    identityStatus,
    incomeStatus,
    employmentStatus,
    creditStatus,
    backgroundStatus,
  ]);

  const clearErr = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetVerification());
  }, [dispatch]);

  return {
    // Status
    identityStatus,
    incomeStatus,
    employmentStatus,
    creditStatus,
    backgroundStatus,

    // Results
    creditCheck,
    backgroundCheck,

    // Plaid
    plaidLinkToken,
    plaidConnected,

    // UI state
    loading,
    error,
    verificationProgress,

    // Actions
    startIdentityVerification,
    startIncomeVerification,
    startEmploymentVerification,
    startCreditCheck,
    checkCreditStatus,
    startBackgroundCheck,
    checkBackgroundStatus,
    initializePlaid,
    connectPlaid,
    sendPhoneCode,
    verifyPhoneCode,

    // Helpers
    isAllVerified,
    getVerificationSteps,
    clearError: clearErr,
    reset,
  };
};
