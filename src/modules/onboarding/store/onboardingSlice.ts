import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserRole } from "../../auth/types/auth.types";

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  role: UserRole | null;
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  property: {
    address: string;
    added: boolean;
  };
  bankConnected: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
}

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: 5,
  completed: false,
  role: null,
  profile: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  property: {
    address: "",
    added: false,
  },
  bankConnected: false,
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
    inApp: true,
  },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    },
    setProfile(
      state,
      action: PayloadAction<OnboardingState["profile"]>,
    ) {
      state.profile = action.payload;
    },
    setProperty(
      state,
      action: PayloadAction<OnboardingState["property"]>,
    ) {
      state.property = action.payload;
    },
    setBankConnected(state, action: PayloadAction<boolean>) {
      state.bankConnected = action.payload;
    },
    setNotificationPreferences(
      state,
      action: PayloadAction<OnboardingState["notificationPreferences"]>,
    ) {
      state.notificationPreferences = action.payload;
    },
    completeOnboarding(state) {
      state.completed = true;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  setRole,
  setProfile,
  setProperty,
  setBankConnected,
  setNotificationPreferences,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
