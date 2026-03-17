// Trial API Service - Handles free trial API calls

import { store } from "../../../store";
import { setTrialExpirationDate } from "../../auth/store/authSlice";
import { tokenManager } from "../../auth/utils/tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

interface StartTrialData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface StartTrialResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
  trialExpirationDate: string;
}

interface TrialStatusResponse {
  isTrialing: boolean;
  daysRemaining: number;
  trialExpirationDate: string | null;
}

export async function startTrial(
  data: StartTrialData,
): Promise<StartTrialResponse> {
  const response = await fetch(`${API_BASE_URL}/trial/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || "Failed to start free trial",
    );
  }

  const json = await response.json();
  const result: StartTrialResponse = json.data;

  // Store tokens
  tokenManager.setTokens(result.accessToken, result.refreshToken, 3600);

  // Store trial expiration date in Redux
  store.dispatch(setTrialExpirationDate(result.trialExpirationDate));

  return result;
}

export async function getTrialStatus(): Promise<TrialStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/trial/status`, {
    headers: {
      ...tokenManager.getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trial status");
  }

  const json = await response.json();
  const result: TrialStatusResponse = json.data;

  // Update Redux store with latest trial expiration
  if (result.trialExpirationDate) {
    store.dispatch(setTrialExpirationDate(result.trialExpirationDate));
  }

  return result;
}
