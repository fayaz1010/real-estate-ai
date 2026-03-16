// ============================================================================
// FILE PATH: src/modules/inspections/hooks/useInspections.ts
// Module 1.3: Inspection Booking & Scheduling System - Custom Hooks
// ============================================================================

import { useCallback } from "react";

import type { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchInspections,
  createInspection,
  updateInspectionStatus,
  cancelInspection,
  rescheduleInspection,
  checkInInspection,
  checkOutInspection,
  clearError,
  setFilters,
  setCurrentPage,
  setCurrentInspection as setCurrentInspectionAction,
} from "../store/inspectionSlice";
import {
  selectInspections,
  selectCurrentInspection,
  selectInspectionLoading,
  selectInspectionError,
  selectInspectionPagination,
} from "../store/inspectionSlice";
import {
  Inspection,
  InspectionBookingRequest,
  InspectionStatus,
} from "../types/inspection.types";

export const useInspections = () => {
  const dispatch = useAppDispatch();
  const inspections = useAppSelector(selectInspections);
  const currentInspection = useAppSelector(selectCurrentInspection);
  const isLoading = useAppSelector(selectInspectionLoading);
  const error = useAppSelector(selectInspectionError);
  const { currentPage, totalPages, totalInspections } = useAppSelector(
    selectInspectionPagination,
  );

  // Load inspections with optional filters
  const loadInspections = useCallback(
    async (params?: {
      landlordId?: string;
      propertyId?: string;
      status?: InspectionStatus;
      page?: number;
      limit?: number;
    }) => {
      try {
        const result = await dispatch(fetchInspections(params || {})).unwrap();
        return result;
      } catch (err) {
        console.error("Failed to load inspections:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Create new inspection
  const createNewInspection = useCallback(
    async (bookingRequest: InspectionBookingRequest) => {
      try {
        const inspection = await dispatch(
          createInspection(bookingRequest),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to create inspection:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Update inspection status
  const updateStatus = useCallback(
    async (id: string, status: InspectionStatus, notes?: string) => {
      try {
        const inspection = await dispatch(
          updateInspectionStatus({ id, status, notes }),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to update inspection status:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Cancel inspection
  const cancel = useCallback(
    async (id: string, reason: string) => {
      try {
        const inspection = await dispatch(
          cancelInspection({ id, reason }),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to cancel inspection:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Reschedule inspection
  const reschedule = useCallback(
    async (id: string, newDate: string, newTime: string, reason?: string) => {
      try {
        const inspection = await dispatch(
          rescheduleInspection({ id, newDate, newTime, reason }),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to reschedule inspection:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Check in to inspection
  const checkIn = useCallback(
    async (
      id: string,
      location: { lat: number; lng: number },
      photo?: string,
    ) => {
      try {
        const inspection = await dispatch(
          checkInInspection({ id, location, photo }),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to check in:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Check out from inspection
  const checkOut = useCallback(
    async (
      id: string,
      feedback: {
        rating: 1 | 2 | 3 | 4 | 5;
        comment?: string;
        likedFeatures: string[];
        concerns: string[];
        interestedInApplying: boolean;
      },
    ) => {
      try {
        const inspection = await dispatch(
          checkOutInspection({ id, feedback }),
        ).unwrap();
        return inspection;
      } catch (err) {
        console.error("Failed to check out:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Set filters
  const setInspectionFilters = useCallback(
    (filters: Parameters<typeof setFilters>[0]) => {
      dispatch(setFilters(filters));
    },
    [dispatch],
  );

  // Set current page
  const setPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch],
  );

  // Set current inspection
  const setCurrent = useCallback(
    (inspection: Parameters<typeof setCurrentInspectionAction>[0]) => {
      dispatch(setCurrentInspectionAction(inspection));
    },
    [dispatch],
  );

  // Clear error
  const clearInspectionError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Data
    inspections,
    currentInspection,
    currentPage,
    totalPages,
    totalInspections,

    // Status
    isLoading,
    error,

    // Actions
    loadInspections,
    createNewInspection,
    updateStatus,
    cancel,
    reschedule,
    checkIn,
    checkOut,
    setInspectionFilters,
    setPage,
    setCurrent,
    clearInspectionError,
  };
};

// Hook for single inspection management
export const useInspection = (inspectionId?: string) => {
  const dispatch = useAppDispatch();
  const currentInspection = useAppSelector(selectCurrentInspection);
  const isLoading = useAppSelector(selectInspectionLoading);

  const inspectionById = useAppSelector((state) =>
    inspectionId
      ? state.inspections.inspections.find(
          (i: Inspection) => i.id === inspectionId,
        )
      : undefined,
  );
  const inspection = inspectionId ? inspectionById : currentInspection;

  const setCurrentInspection = useCallback(
    (inspectionParam: any) => {
      dispatch(setCurrentInspectionAction(inspectionParam));
    },
    [dispatch],
  );

  return {
    inspection,
    isLoading,
    setCurrentInspection,
  };
};

// Hook for property-specific inspections
export const usePropertyInspections = (propertyId: string) => {
  const inspections = useAppSelector((state) =>
    state.inspections.inspections.filter((i) => i.propertyId === propertyId),
  );

  return {
    inspections,
    count: inspections.length,
  };
};

// Hook for inspections by status
export const useInspectionsByStatus = (status: InspectionStatus) => {
  const inspections = useAppSelector((state: RootState) =>
    state.inspections.inspections.filter(
      (i: Inspection) => i.status === status,
    ),
  );

  return {
    inspections,
    count: inspections.length,
  };
};
