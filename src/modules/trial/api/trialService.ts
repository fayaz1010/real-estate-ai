// Trial API Service - Handles free trial API calls

import { store } from "../../../store";
import { setTrialExpirationDate } from "../../auth/store/authSlice";
import { tokenManager } from "../../auth/utils/tokenManager";

import apiClient from "@/api/client";

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
  const response = await apiClient.post("/trial/start", data);

  const result: StartTrialResponse = response.data.data;

  // Store tokens
  tokenManager.setTokens(result.accessToken, result.refreshToken, 3600);

  // Store trial expiration date in Redux
  store.dispatch(setTrialExpirationDate(result.trialExpirationDate));

  return result;
}

export async function getTrialStatus(): Promise<TrialStatusResponse> {
  const response = await apiClient.get("/trial/status");

  const result: TrialStatusResponse = response.data.data;

  // Update Redux store with latest trial expiration
  if (result.trialExpirationDate) {
    store.dispatch(setTrialExpirationDate(result.trialExpirationDate));
  }

  return result;
}
