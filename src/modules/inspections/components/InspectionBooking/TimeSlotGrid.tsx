// PLACEHOLDER FILE: src/modules/inspections/components/InspectionBooking/TimeSlotGrid.tsx
// TODO: Add your implementation here

import { Clock, Check } from "lucide-react";
import React, { useEffect } from "react";

import { useDateSlots } from "../../hooks/useAvailability";

interface TimeSlotGridProps {
  propertyId: string;
  date: string;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  error?: string;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  propertyId,
  date,
  selectedTime,
  onTimeSelect,
  error,
}) => {
  const { slots, availableCount, totalCount } = useDateSlots(date);

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getTimeOfDay = (time: string): string => {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  // Group slots by time of day
  const groupedSlots = slots.reduce(
    (acc: Record<string, typeof slots>, slot: (typeof slots)[number]) => {
      const timeOfDay = getTimeOfDay(slot.start);
      if (!acc[timeOfDay]) {
        acc[timeOfDay] = [];
      }
      acc[timeOfDay].push(slot);
      return acc;
    },
    {} as Record<string, typeof slots>,
  );

  const timeOfDayOrder = ["Morning", "Afternoon", "Evening"];
  const sortedGroups = timeOfDayOrder.filter((tod) => groupedSlots[tod]);

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No slots available</p>
        <p className="text-sm text-gray-500">Please select a different date</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Available Times
          </h4>
          <p className="text-sm text-gray-600">
            {availableCount} of {totalCount} slots available
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Time Slots by Period */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {sortedGroups.map((timeOfDay) => (
          <div key={timeOfDay}>
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  timeOfDay === "Morning"
                    ? "bg-yellow-400"
                    : timeOfDay === "Afternoon"
                      ? "bg-orange-400"
                      : "bg-indigo-400"
                }`}
              />
              {timeOfDay}
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {groupedSlots[timeOfDay].map((slot) => {
                const isSelected = selectedTime === slot.start;
                const isAvailable = slot.available;
                const isFull = slot.bookingsCount >= slot.maxBookings;

                return (
                  <button
                    key={slot.start}
                    onClick={() => isAvailable && onTimeSelect(slot.start)}
                    disabled={!isAvailable || isFull}
                    className={`
                      relative px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                          : isAvailable && !isFull
                            ? "bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-600 hover:bg-blue-50"
                            : "bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{formatTime(slot.start)}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                      {!isAvailable && !isSelected && (
                        <span className="text-xs">(Booked)</span>
                      )}
                    </div>
                    {slot.maxBookings > 1 && (
                      <div className="text-xs mt-1 opacity-75">
                        {slot.maxBookings - slot.bookingsCount} spots left
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">
              Time slots are in your local timezone
            </p>
            <p>All tours are approximately 30 minutes long</p>
          </div>
        </div>
      </div>
    </div>
  );
};
