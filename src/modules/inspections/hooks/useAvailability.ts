// PLACEHOLDER FILE: src/modules/inspections/hooks/useAvailability.ts
// TODO: Add your implementation here

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchAvailableSlots,
  createRecurringSchedule,
  fetchRecurringSchedules,
  updateRecurringSchedule,
  deleteRecurringSchedule,
  toggleRecurringSchedule,
  createBlackoutDate,
  fetchBlackoutDates,
  deleteBlackoutDate,
  selectAvailableSlots,
  selectRecurringSchedules,
  selectBlackoutDates,
  selectAvailabilityStatus,
  selectAvailabilityError,
  selectSlotsByDate,
  selectActiveRecurringSchedules,
  selectFutureBlackoutDates,
  clearAvailability,
} from "../store/availabilitySlice";
import { RecurringSchedule, BlackoutDate } from "../types/inspection.types";

export const useAvailability = () => {
  const dispatch = useAppDispatch();
  const slots = useAppSelector(selectAvailableSlots);
  const recurringSchedules = useAppSelector(selectRecurringSchedules);
  const blackoutDates = useAppSelector(selectBlackoutDates);
  const status = useAppSelector(selectAvailabilityStatus);
  const error = useAppSelector(selectAvailabilityError);
  const activeSchedules = useAppSelector(selectActiveRecurringSchedules);
  const futureBlackouts = useAppSelector(selectFutureBlackoutDates);

  const isLoading = status === "loading";
  const isError = status === "failed";

  // Load available slots
  const loadSlots = useCallback(
    async (propertyId: string, startDate: string, endDate: string) => {
      try {
        await dispatch(
          fetchAvailableSlots({ propertyId, startDate, endDate }),
        ).unwrap();
      } catch (err) {
        console.error("Failed to load available slots:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Create recurring schedule
  const createSchedule = useCallback(
    async (data: Omit<RecurringSchedule, "id" | "createdAt" | "updatedAt">) => {
      try {
        const schedule = await dispatch(createRecurringSchedule(data)).unwrap();
        return schedule;
      } catch (err) {
        console.error("Failed to create recurring schedule:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Load recurring schedules
  const loadSchedules = useCallback(
    async (propertyId: string) => {
      try {
        await dispatch(fetchRecurringSchedules(propertyId)).unwrap();
      } catch (err) {
        console.error("Failed to load recurring schedules:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Update recurring schedule
  const updateSchedule = useCallback(
    async (id: string, updates: Partial<RecurringSchedule>) => {
      try {
        const schedule = await dispatch(
          updateRecurringSchedule({ id, updates }),
        ).unwrap();
        return schedule;
      } catch (err) {
        console.error("Failed to update recurring schedule:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Delete recurring schedule
  const deleteSchedule = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteRecurringSchedule(id)).unwrap();
      } catch (err) {
        console.error("Failed to delete recurring schedule:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Toggle schedule active status
  const toggleSchedule = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        const schedule = await dispatch(
          toggleRecurringSchedule({ id, isActive }),
        ).unwrap();
        return schedule;
      } catch (err) {
        console.error("Failed to toggle recurring schedule:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Create blackout date
  const createBlackout = useCallback(
    async (data: Omit<BlackoutDate, "id" | "createdAt">) => {
      try {
        const blackout = await dispatch(createBlackoutDate(data)).unwrap();
        return blackout;
      } catch (err) {
        console.error("Failed to create blackout date:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Load blackout dates
  const loadBlackouts = useCallback(
    async (propertyId: string) => {
      try {
        await dispatch(fetchBlackoutDates(propertyId)).unwrap();
      } catch (err) {
        console.error("Failed to load blackout dates:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Delete blackout date
  const deleteBlackout = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteBlackoutDate(id)).unwrap();
      } catch (err) {
        console.error("Failed to delete blackout date:", err);
        throw err;
      }
    },
    [dispatch],
  );

  // Clear all availability data
  const clearAll = useCallback(() => {
    dispatch(clearAvailability());
  }, [dispatch]);

  return {
    slots,
    recurringSchedules,
    blackoutDates,
    activeSchedules,
    futureBlackouts,
    isLoading,
    isError,
    error,
    loadSlots,
    createSchedule,
    loadSchedules,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
    createBlackout,
    loadBlackouts,
    deleteBlackout,
    clearAll,
  };
};

// Hook for slots on a specific date
export const useDateSlots = (date: string) => {
  const slots = useAppSelector((state) => selectSlotsByDate(state, date));

  return {
    slots,
    availableCount: slots.filter((s) => s.isAvailable).length,
    totalCount: slots.length,
  };
};
