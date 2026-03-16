// PLACEHOLDER FILE: src/modules/inspections/components/InspectionBooking/DateTimeSelector.tsx
// TODO: Add your implementation here

import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useAvailability } from "../../hooks/useAvailability";

import { TimeSlotGrid } from "./TimeSlotGrid";

interface DateTimeSelectorProps {
  propertyId: string;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  errors?: { date?: string; time?: string };
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  propertyId,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  errors,
}) => {
  const { slots, loadSlots, isLoading } = useAvailability();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // Load available slots for the current month
  useEffect(() => {
    if (propertyId) {
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
      );

      loadSlots(
        propertyId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      );
    }
  }, [propertyId, currentMonth, loadSlots]);

  // Generate calendar days
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: Date[] = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const hasAvailableSlots = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    return slots.some((slot) => slot.date === dateStr && slot.isAvailable);
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Date & Time
        </h3>
        <p className="text-sm text-gray-600">
          Choose your preferred inspection date and time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dateStr = day.toISOString().split("T")[0];
                const isSelected = selectedDate === dateStr;
                const isCurrentMonth =
                  day.getMonth() === currentMonth.getMonth();
                const isPast = isDateInPast(day);
                const hasSlots = hasAvailableSlots(day);
                const isToday =
                  day.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isPast && hasSlots) {
                        onDateSelect(dateStr);
                        onTimeSelect(""); // Reset time selection
                      }
                    }}
                    disabled={isPast || !hasSlots}
                    className={`
                      aspect-square p-2 rounded-lg text-sm transition-all relative
                      ${!isCurrentMonth ? "text-gray-400" : ""}
                      ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                      ${isSelected ? "bg-blue-600 text-white font-semibold" : ""}
                      ${!isSelected && !isPast && hasSlots ? "hover:bg-blue-50 text-gray-900" : ""}
                      ${!isSelected && !isPast && !hasSlots ? "text-gray-400 cursor-not-allowed" : ""}
                      ${isToday && !isSelected ? "border-2 border-blue-600" : ""}
                    `}
                  >
                    {day.getDate()}
                    {hasSlots && !isSelected && !isPast && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 rounded" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  <span>Available</span>
                </div>
              </div>
            </div>

            {errors?.date && (
              <div className="mt-3 text-sm text-red-600">{errors.date}</div>
            )}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          {selectedDate ? (
            <TimeSlotGrid
              propertyId={propertyId}
              date={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
              error={errors?.time}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">
                Select a date first
              </p>
              <p className="text-sm text-gray-500">
                Choose a date from the calendar to see available time slots
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Booking Tips:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Dates with blue dots have available time slots</li>
              <li>• Book at least 2 hours in advance</li>
              <li>• Flexible with timing? Morning slots fill up faster</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
