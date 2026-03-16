// PLACEHOLDER FILE: src/modules/inspections/components/InspectionCalendar/CalendarView.tsx
// TODO: Add your implementation here

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import React from "react";

import { useInspectionCalendar } from "../../hooks/useInspectionCalendar";

import { DayView } from "./DayView";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";

export const CalendarView: React.FC = () => {
  const {
    view,
    periodLabel,
    previousPeriod,
    nextPeriod,
    goToToday,
    changeView,
    currentDate,
    getInspectionsForDate,
  } = useInspectionCalendar();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Inspections Calendar
          </h2>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={previousPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 min-w-[250px] text-center">
              {periodLabel}
            </h3>
            <button
              onClick={nextPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next period"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => changeView("month")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === "month"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => changeView("week")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === "week"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => changeView("day")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === "day"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {view === "month" && <MonthView />}
        {view === "week" && <WeekView />}
        {view === "day" && (
          <DayView
            date={currentDate}
            inspections={getInspectionsForDate(currentDate)}
          />
        )}
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded" />
            <span className="text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
