// ============================================================================
// FILE PATH: src/modules/inspections/components/InspectionCalendar/DayView.tsx
// Day View Calendar Component
// ============================================================================

import React from "react";

import { Inspection } from "../../types/inspection.types";

import { TimeSlot } from "./TimeSlot";

interface DayViewProps {
  date: Date;
  inspections: Inspection[];
  onInspectionClick?: (inspection: Inspection) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  inspections,
  onInspectionClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getInspectionsForHour = (hour: number) => {
    return inspections.filter((inspection) => {
      const inspectionHour = new Date(inspection.scheduledDate).getHours();
      return inspectionHour === hour;
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h3>

      <div className="space-y-1">
        {hours.map((hour) => {
          const hourInspections = getInspectionsForHour(hour);

          return (
            <div
              key={hour}
              className="flex gap-2 min-h-[60px] border-b border-gray-100"
            >
              <div className="w-20 text-sm text-gray-600 py-2">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 py-1">
                {hourInspections.map((inspection) => (
                  <TimeSlot
                    key={inspection.id}
                    inspection={inspection}
                    onClick={() => onInspectionClick?.(inspection)}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
