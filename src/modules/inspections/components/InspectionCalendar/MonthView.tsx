// PLACEHOLDER FILE: src/modules/inspections/components/InspectionCalendar/MonthView.tsx
// TODO: Add your implementation here

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useInspectionCalendar } from "../../hooks/useInspectionCalendar";
import { Inspection } from "../../types/inspection.types";

export const MonthView: React.FC = () => {
  const navigate = useNavigate();
  const { monthDays } = useInspectionCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "confirmed":
      case "checked_in":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-600";
      case "cancelled":
      case "no_show":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleDateClick = (date: Date, inspections: Inspection[]) => {
    setSelectedDate(date);
    if (inspections.length === 1) {
      navigate(`/inspections/${inspections[0].id}`);
    }
  };

  return (
    <div>
      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          const isSelected =
            selectedDate?.toDateString() === day.date.toDateString();

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day.date, day.inspections)}
              className={`
                min-h-[100px] p-2 rounded-lg border transition-all
                ${!day.isCurrentMonth ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"}
                ${day.isToday ? "ring-2 ring-blue-600" : ""}
                ${isSelected ? "ring-2 ring-blue-400" : ""}
                ${day.hasInspections ? "hover:shadow-md cursor-pointer" : "cursor-default"}
              `}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                    ${day.isToday ? "text-blue-600 font-bold" : ""}
                  `}
                >
                  {day.date.getDate()}
                </span>
                {day.inspections.length > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-1.5 rounded-full">
                    {day.inspections.length}
                  </span>
                )}
              </div>

              {/* Inspections */}
              <div className="space-y-1">
                {day.inspections.slice(0, 3).map((inspection) => {
                  const time = new Date(
                    inspection.scheduledDate,
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <div
                      key={inspection.id}
                      className={`
                        text-xs text-white px-1.5 py-1 rounded truncate
                        ${getStatusColor(inspection.status)}
                      `}
                      title={`${time} - ${inspection.property?.title || "Property"}`}
                    >
                      {time}
                    </div>
                  );
                })}
                {day.inspections.length > 3 && (
                  <div className="text-xs text-gray-600 text-center">
                    +{day.inspections.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>
          {monthDays
            .find((d) => d.date.toDateString() === selectedDate.toDateString())
            ?.inspections.map((inspection) => (
              <div
                key={inspection.id}
                onClick={() => navigate(`/inspections/${inspection.id}`)}
                className="p-3 bg-white rounded-lg mb-2 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {inspection.property?.title || "Property Inspection"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(inspection.scheduledDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </p>
                  </div>
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium text-white
                      ${getStatusColor(inspection.status)}
                    `}
                  >
                    {inspection.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
