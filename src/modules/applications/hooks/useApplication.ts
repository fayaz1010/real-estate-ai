// PLACEHOLDER FILE: hooks\useApplication.ts
// TODO: Add your implementation here
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../../store";
import {
  createApplication,
  fetchApplication,
  updateApplication,
  submitApplication,
  fetchMyApplications,
  approveApplication,
  rejectApplication,
  withdrawApplication,
  deleteApplication,
  setCurrentApplication,
  clearError,
} from "../store/applicationSlice";
import { Application, ApplicationFilters } from "../types/application.types";

export const useApplication = (applicationId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentApplication,
    applications,
    loading,
    saving,
    submitting,
    error,
  } = useSelector((state: RootState) => state.applications);

  // Load application on mount if ID provided
  useEffect(() => {
    if (
      applicationId &&
      (!currentApplication || currentApplication.id !== applicationId)
    ) {
      dispatch(fetchApplication(applicationId));
    }
  }, [applicationId, dispatch, currentApplication]);

  // Create new application
  const create = useCallback(
    async (propertyId: string) => {
      const result = await dispatch(createApplication(propertyId));
      return result.payload as Application;
    },
    [dispatch],
  );

  // Update application
  const update = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      const result = await dispatch(
        updateApplication({ applicationId: id, data }),
      );
      return result.payload as Application;
    },
    [dispatch],
  );

  // Submit application
  const submit = useCallback(
    async (id: string) => {
      const result = await dispatch(submitApplication(id));
      return result.payload as Application;
    },
    [dispatch],
  );

  // Approve application (landlord)
  const approve = useCallback(
    async (id: string, conditions?: string[]) => {
      const result = await dispatch(
        approveApplication({ applicationId: id, conditions }),
      );
      return result.payload as Application;
    },
    [dispatch],
  );

  // Reject application (landlord)
  const reject = useCallback(
    async (id: string, reason: string) => {
      const result = await dispatch(
        rejectApplication({ applicationId: id, reason }),
      );
      return result.payload as Application;
    },
    [dispatch],
  );

  // Withdraw application (applicant)
  const withdraw = useCallback(
    async (id: string) => {
      const result = await dispatch(withdrawApplication(id));
      return result.payload as Application;
    },
    [dispatch],
  );

  // Delete application (draft only)
  const remove = useCallback(
    async (id: string) => {
      await dispatch(deleteApplication(id));
    },
    [dispatch],
  );

  // Fetch my applications
  const fetchMy = useCallback(
    async (filters?: ApplicationFilters) => {
      const result = await dispatch(fetchMyApplications(filters));
      return result.payload as Application[];
    },
    [dispatch],
  );

  // Set current application
  const setCurrent = useCallback(
    (application: Application) => {
      dispatch(setCurrentApplication(application));
    },
    [dispatch],
  );

  // Clear error
  const clearErr = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    application: currentApplication,
    applications,
    loading,
    saving,
    submitting,
    error,

    // Actions
    create,
    update,
    submit,
    approve,
    reject,
    withdraw,
    remove,
    fetchMy,
    setCurrent,
    clearError: clearErr,
  };
};
