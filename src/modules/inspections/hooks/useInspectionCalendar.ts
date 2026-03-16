import { useState, useCallback, useMemo } from "react";

import { Inspection } from "../types/inspection.types";

import { useAvailability } from "./useAvailability";
import { useInspections } from "./useInspections";

interface CalendarDay {
  date: Date;
  inspections: Inspection[];
  isCurrentMonth: boolean;
  isToday: boolean;
  hasInspections: boolean;
}

export const useInspectionCalendar = () => {
  const { inspections } = useInspections();
  const { slots, loadSlots } = useAvailability();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Navigate to previous period
  const previousPeriod = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  }, [view]);

  // Navigate to next period
  const nextPeriod = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  }, [view]);

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Change view
  const changeView = useCallback((newView: "month" | "week" | "day") => {
    setView(newView);
  }, []);

  // Get inspections for a specific date
  const getInspectionsForDate = useCallback(
    (date: Date): Inspection[] => {
      const dateStr = date.toISOString().split("T")[0];
      return inspections.filter((inspection) => {
        const inspectionDate = new Date(inspection.scheduledDate)
          .toISOString()
          .split("T")[0];
        return inspectionDate === dateStr;
      });
    },
    [inspections],
  );

  // Get calendar days for month view
  const getMonthDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDay = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      const dayInspections = getInspectionsForDate(currentDay);

      days.push({
        date: new Date(currentDay),
        inspections: dayInspections,
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        hasInspections: dayInspections.length > 0,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  }, [currentDate, getInspectionsForDate]);

  // Get week days
  const getWeekDays = useMemo((): CalendarDay[] => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(currentDay.getDate() + i);
      const dayInspections = getInspectionsForDate(currentDay);

      days.push({
        date: currentDay,
        inspections: dayInspections,
        isCurrentMonth: true,
        isToday: currentDay.toDateString() === today.toDateString(),
        hasInspections: dayInspections.length > 0,
      });
    }

    return days;
  }, [currentDate, getInspectionsForDate]);

  // Get current day
  const getCurrentDay = useMemo((): CalendarDay => {
    const dayInspections = getInspectionsForDate(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      date: currentDate,
      inspections: dayInspections,
      isCurrentMonth: true,
      isToday: currentDate.toDateString() === today.toDateString(),
      hasInspections: dayInspections.length > 0,
    };
  }, [currentDate, getInspectionsForDate]);

  // Get formatted period label
  const getPeriodLabel = useCallback((): string => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (view === "month") {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${
        monthNames[endOfWeek.getMonth()]
      } ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    monthDays: getMonthDays,
    weekDays: getWeekDays,
    currentDay: getCurrentDay,
    periodLabel: getPeriodLabel(),
    previousPeriod,
    nextPeriod,
    goToToday,
    changeView,
    getInspectionsForDate,
  };
};
