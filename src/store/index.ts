// FILE PATH: src/store/index.ts
// Redux Store Configuration for Real Estate Platform

import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import applicationReducer from "../modules/applications/store/applicationSlice";
import verificationReducer from "../modules/applications/store/verificationSlice";
import authReducer from "../modules/auth/store/authSlice";
import availabilityReducer from "../modules/inspections/store/availabilitySlice";
import inspectionReducer from "../modules/inspections/store/inspectionSlice";
import propertyReducer from "../modules/properties/store/propertySlice";
import searchReducer from "../modules/properties/store/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    search: searchReducer,
    inspections: inspectionReducer,
    availability: availabilityReducer,
    applications: applicationReducer,
    verification: verificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: [
          "auth/login/fulfilled",
          "auth/register/fulfilled",
          "inspections/fetchInspection/fulfilled",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for usage in components
export { useDispatch, useSelector } from "react-redux";
export type { TypedUseSelectorHook } from "react-redux";

// Typed hooks
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
