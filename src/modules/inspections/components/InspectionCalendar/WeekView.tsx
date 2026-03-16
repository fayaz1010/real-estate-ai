// PLACEHOLDER FILE: src/modules/inspections/components/InspectionCalendar/WeekView.tsx
// TODO: Add your implementation here

import React from "react";
import { useNavigate } from "react-router-dom";

import { useInspectionCalendar } from "../../hooks/useInspectionCalendar";

import { TimeSlot } from "./TimeSlot";

export const WeekView: React.FC = () => {
  const navigate = useNavigate();
  const { weekDays } = useInspectionCalendar();

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const getInspectionsForHour = (date: Date, hour: number) => {
    return weekDays
      .find((d) => d.date.toDateString() === date.toDateString())
      ?.inspections.filter((inspection) => {
        const inspectionHour = new Date(inspection.scheduledDate).getHours();
        return inspectionHour === hour;
      });
  };

  const formatHour = (hour: number): string => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${ampm}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Day Headers */}
        <div className="grid grid-cols-8 gap-2 mb-2 sticky top-0 bg-white z-10">
          <div className="text-sm font-semibold text-gray-600 py-2">Time</div>
          {weekDays.map((day) => (
            <div
              key={day.date.toISOString()}
              className={`text-center py-2 rounded-lg ${
                day.isToday ? "bg-blue-100" : ""
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">
                {day.date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-2xl font-bold ${
                  day.isToday ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {day.date.getDate()}
              </div>
              {day.inspections.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {day.inspections.length} inspection
                  {day.inspections.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="space-y-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 gap-2 border-t border-gray-200"
            >
              {/* Hour Label */}
              <div className="text-sm text-gray-600 py-3 text-right pr-2">
                {formatHour(hour)}
              </div>

              {/* Day Columns */}
              {weekDays.map((day) => {
                const inspections = getInspectionsForHour(day.date, hour);

                return (
                  <div
                    key={`${day.date.toISOString()}-${hour}`}
                    className="min-h-[60px] p-1 hover:bg-gray-50 transition-colors"
                  >
                    {inspections && inspections.length > 0 && (
                      <div className="space-y-1">
                        {inspections.map((inspection) => (
                          <TimeSlot
                            key={inspection.id}
                            inspection={inspection}
                            onClick={() =>
                              navigate(`/inspections/${inspection.id}`)
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {weekDays.every((day) => day.inspections.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">
              No inspections scheduled this week
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="text-blue-600 hover:underline text-sm"
            >
              Browse properties to schedule an inspection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
