// FILE PATH: src/pages/InspectionsPage.tsx
// Inspections Calendar Page - Protected (Authenticated Users Only)

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle,
  XCircle,
  Grid,
  Columns,
  Home,
  ArrowLeft,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = "month" | "week" | "day";
type InspectionType = "In-Person" | "Virtual" | "Open House";
type InspectionStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

interface InspectionEvent {
  id: string;
  propertyName: string;
  address: string;
  date: Date;
  time: string;
  type: InspectionType;
  status: InspectionStatus;
  agent: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const MOCK_INSPECTIONS: InspectionEvent[] = [
  {
    id: "insp-001",
    propertyName: "Harbourview Penthouse",
    address: "42 Circular Quay, Sydney",
    date: new Date(currentYear, currentMonth, 3, 10, 0),
    time: "10:00 AM",
    type: "In-Person",
    status: "Completed",
    agent: "Sarah Mitchell",
  },
  {
    id: "insp-002",
    propertyName: "Riverside Apartment",
    address: "18 Southbank Blvd, Melbourne",
    date: new Date(currentYear, currentMonth, 7, 14, 30),
    time: "2:30 PM",
    type: "Virtual",
    status: "Completed",
    agent: "James Carter",
  },
  {
    id: "insp-003",
    propertyName: "Parkside Terrace",
    address: "5 Hyde Park Ave, Perth",
    date: new Date(currentYear, currentMonth, 12, 11, 0),
    time: "11:00 AM",
    type: "Open House",
    status: "Confirmed",
    agent: "Emily Zhang",
  },
  {
    id: "insp-004",
    propertyName: "Ocean Breeze Villa",
    address: "77 Marine Parade, Gold Coast",
    date: new Date(currentYear, currentMonth, today.getDate(), 9, 0),
    time: "9:00 AM",
    type: "In-Person",
    status: "Confirmed",
    agent: "Sarah Mitchell",
  },
  {
    id: "insp-005",
    propertyName: "Skyline Loft",
    address: "120 Collins St, Melbourne",
    date: new Date(currentYear, currentMonth, today.getDate(), 15, 0),
    time: "3:00 PM",
    type: "Virtual",
    status: "Pending",
    agent: "James Carter",
  },
  {
    id: "insp-006",
    propertyName: "Garden Estate",
    address: "9 Botanical Dr, Brisbane",
    date: new Date(currentYear, currentMonth, today.getDate() + 2, 10, 30),
    time: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
    agent: "Emily Zhang",
  },
  {
    id: "insp-007",
    propertyName: "Sunset Ridge Home",
    address: "31 Panorama Cres, Adelaide",
    date: new Date(currentYear, currentMonth, today.getDate() + 4, 13, 0),
    time: "1:00 PM",
    type: "Open House",
    status: "Pending",
    agent: "Sarah Mitchell",
  },
  {
    id: "insp-008",
    propertyName: "Metro Studio",
    address: "55 George St, Sydney",
    date: new Date(currentYear, currentMonth, today.getDate() + 5, 16, 0),
    time: "4:00 PM",
    type: "Virtual",
    status: "Confirmed",
    agent: "James Carter",
  },
  {
    id: "insp-009",
    propertyName: "Lakeside Cottage",
    address: "14 Lakefront Rd, Canberra",
    date: new Date(currentYear, currentMonth, 20, 9, 30),
    time: "9:30 AM",
    type: "In-Person",
    status: "Cancelled",
    agent: "Emily Zhang",
  },
  {
    id: "insp-010",
    propertyName: "Heritage Townhouse",
    address: "88 Queen St, Hobart",
    date: new Date(currentYear, currentMonth, 25, 11, 0),
    time: "11:00 AM",
    type: "In-Person",
    status: "Pending",
    agent: "Sarah Mitchell",
  },
  {
    id: "insp-011",
    propertyName: "Bayside Duplex",
    address: "6 Esplanade Way, Darwin",
    date: new Date(currentYear, currentMonth, 28, 14, 0),
    time: "2:00 PM",
    type: "Open House",
    status: "Confirmed",
    agent: "James Carter",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendar(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const days: Date[] = [];

  // Previous month fill
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Next month fill to complete 6 rows
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function getTypeIcon(type: InspectionType) {
  switch (type) {
    case "In-Person":
      return <MapPin className="w-3.5 h-3.5" aria-hidden="true" />;
    case "Virtual":
      return <Video className="w-3.5 h-3.5" aria-hidden="true" />;
    case "Open House":
      return <Users className="w-3.5 h-3.5" aria-hidden="true" />;
  }
}

function getTypeBadgeClasses(type: InspectionType): string {
  switch (type) {
    case "In-Person":
      return "bg-blue-100 text-blue-700";
    case "Virtual":
      return "bg-purple-100 text-purple-700";
    case "Open House":
      return "bg-teal-100 text-teal-700";
  }
}

function getStatusBadgeClasses(status: InspectionStatus): string {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Completed":
      return "bg-realestate-secondary/10 text-realestate-secondary";
    case "Cancelled":
      return "bg-red-100 text-red-700";
  }
}

function getStatusDotColor(status: InspectionStatus): string {
  switch (status) {
    case "Confirmed":
      return "bg-green-500";
    case "Pending":
      return "bg-realestate-accent";
    case "Completed":
      return "bg-realestate-secondary";
    case "Cancelled":
      return "bg-red-500";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

const InspectionsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar grid days
  const calendarDays = useMemo(
    () => getCalendar(displayYear, displayMonth),
    [displayYear, displayMonth]
  );

  // Inspections indexed by date string for fast lookup
  const inspectionsByDate = useMemo(() => {
    const map = new Map<string, InspectionEvent[]>();
    MOCK_INSPECTIONS.forEach((insp) => {
      const key = insp.date.toDateString();
      const list = map.get(key) || [];
      list.push(insp);
      map.set(key, list);
    });
    return map;
  }, []);

  // Quick stats for the displayed month
  const stats = useMemo(() => {
    const monthInspections = MOCK_INSPECTIONS.filter(
      (i) =>
        i.date.getMonth() === displayMonth &&
        i.date.getFullYear() === displayYear
    );
    return {
      total: monthInspections.length,
      completed: monthInspections.filter((i) => i.status === "Completed").length,
      upcoming: monthInspections.filter(
        (i) => i.status === "Confirmed" || i.status === "Pending"
      ).length,
      cancelled: monthInspections.filter((i) => i.status === "Cancelled").length,
    };
  }, [displayMonth, displayYear]);

  // Upcoming inspections (next 5 from today)
  const upcomingInspections = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return MOCK_INSPECTIONS
      .filter((i) => i.date >= now && i.status !== "Cancelled" && i.status !== "Completed")
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, []);

  // Navigation
  const goToPrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setDisplayMonth(currentMonth);
    setDisplayYear(currentYear);
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-realestate-primary shadow-realestate-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-realestate-secondary hover:text-realestate-accent transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
                <h1 className="text-xl sm:text-2xl font-space-grotesk font-bold text-white">
                  Inspections Calendar
                </h1>
              </div>
            </div>
            <Link
              to="/inspections/new"
              className="inline-flex items-center gap-2 bg-realestate-accent hover:bg-realestate-accent/90 text-realestate-primary font-inter font-semibold px-4 py-2 rounded-lg transition-colors shadow-realestate-sm text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Add Inspection</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Quick Stats ─────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          role="list"
          aria-label="Monthly inspection statistics"
        >
          {[
            {
              label: "Total This Month",
              value: stats.total,
              icon: <Calendar className="w-5 h-5 text-realestate-accent" aria-hidden="true" />,
              bg: "bg-realestate-primary/5",
              iconBg: "bg-realestate-primary",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />,
              bg: "bg-green-50",
              iconBg: "bg-green-600",
            },
            {
              label: "Upcoming",
              value: stats.upcoming,
              icon: <Calendar className="w-5 h-5 text-blue-400" aria-hidden="true" />,
              bg: "bg-blue-50",
              iconBg: "bg-blue-600",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              icon: <Calendar className="w-5 h-5 text-red-400" aria-hidden="true" />,
              bg: "bg-red-50",
              iconBg: "bg-red-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-realestate-sm p-4 border border-gray-100"
              role="listitem"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.iconBg}/10`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-space-grotesk font-bold text-realestate-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-inter text-gray-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── View Toggle & Month Navigation ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-realestate-sm"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-realestate-primary" aria-hidden="true" />
            </button>
            <h2 className="text-lg sm:text-xl font-space-grotesk font-bold text-realestate-primary min-w-[180px] text-center">
              {MONTH_NAMES[displayMonth]} {displayYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-realestate-sm"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-realestate-primary" aria-hidden="true" />
            </button>
            <button
              onClick={goToToday}
              className="ml-2 text-sm font-inter font-medium text-realestate-secondary hover:text-realestate-accent transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-realestate-sm p-1">
            {([
              { mode: "month" as ViewMode, icon: <Grid className="w-4 h-4" aria-hidden="true" />, label: "Month" },
              { mode: "week" as ViewMode, icon: <Columns className="w-4 h-4" aria-hidden="true" />, label: "Week" },
              { mode: "day" as ViewMode, icon: <Calendar className="w-4 h-4" aria-hidden="true" />, label: "Day" },
            ]).map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-inter font-medium transition-all ${
                  viewMode === mode
                    ? "bg-realestate-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-realestate-primary"
                }`}
                aria-pressed={viewMode === mode}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content Grid ───────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-realestate-md border border-gray-100 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-realestate-primary/5 border-b border-gray-100">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs sm:text-sm font-inter font-semibold text-realestate-primary py-3"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, idx) => {
                  const isCurrentMonth = date.getMonth() === displayMonth;
                  const isToday = isSameDay(date, today);
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                  const dayInspections = inspectionsByDate.get(date.toDateString()) || [];

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative min-h-[72px] sm:min-h-[100px] p-1.5 sm:p-2 border-b border-r border-gray-100 text-left
                        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:z-10
                        ${!isCurrentMonth ? "bg-gray-50/60" : "bg-white hover:bg-realestate-accent/5"}
                        ${isSelected ? "ring-2 ring-inset ring-realestate-accent bg-realestate-accent/5" : ""}
                      `}
                      aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${dayInspections.length > 0 ? `, ${dayInspections.length} inspection${dayInspections.length > 1 ? "s" : ""}` : ""}`}
                    >
                      {/* Date Number */}
                      <span
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-inter font-medium
                          ${isToday ? "bg-realestate-accent text-realestate-primary font-bold" : ""}
                          ${!isCurrentMonth ? "text-gray-300" : "text-realestate-primary"}
                        `}
                      >
                        {date.getDate()}
                      </span>

                      {/* Inspection Dots */}
                      {dayInspections.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {dayInspections.slice(0, 3).map((insp) => (
                            <span
                              key={insp.id}
                              className={`block w-2 h-2 rounded-full ${getStatusDotColor(insp.status)}`}
                              title={`${insp.time} - ${insp.propertyName}`}
                            />
                          ))}
                          {dayInspections.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-inter">
                              +{dayInspections.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Inspection preview on larger screens */}
                      <div className="hidden sm:block mt-1 space-y-0.5">
                        {dayInspections.slice(0, 2).map((insp) => (
                          <div
                            key={insp.id}
                            className={`text-[10px] leading-tight font-inter px-1 py-0.5 rounded truncate ${getStatusBadgeClasses(insp.status)}`}
                          >
                            {insp.time}
                          </div>
                        ))}
                        {dayInspections.length > 2 && (
                          <p className="text-[10px] text-gray-400 font-inter pl-1">
                            +{dayInspections.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Detail (Mobile) */}
            {selectedDate && (
              <div className="mt-4 lg:hidden">
                <SelectedDateInspections
                  date={selectedDate}
                  inspections={inspectionsByDate.get(selectedDate.toDateString()) || []}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-80 xl:w-96 space-y-6">
            {/* Selected Date (Desktop) */}
            {selectedDate && (
              <div className="hidden lg:block">
                <SelectedDateInspections
                  date={selectedDate}
                  inspections={inspectionsByDate.get(selectedDate.toDateString()) || []}
                />
              </div>
            )}

            {/* Upcoming Inspections */}
            <div className="bg-white rounded-xl shadow-realestate-md border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-realestate-accent" aria-hidden="true" />
                <h3 className="text-base font-space-grotesk font-bold text-realestate-primary">
                  Upcoming Inspections
                </h3>
              </div>

              {upcomingInspections.length === 0 ? (
                <p className="text-sm font-inter text-gray-400 text-center py-6">
                  No upcoming inspections
                </p>
              ) : (
                <ul className="space-y-3" role="list">
                  {upcomingInspections.map((insp) => (
                    <li
                      key={insp.id}
                      className="group p-3 rounded-lg border border-gray-100 hover:border-realestate-accent/30 hover:shadow-realestate-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-inter font-semibold text-realestate-primary leading-tight group-hover:text-realestate-secondary transition-colors">
                          {insp.propertyName}
                        </p>
                        <span
                          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold ${getStatusBadgeClasses(insp.status)}`}
                        >
                          {insp.status}
                        </span>
                      </div>
                      <p className="text-xs font-inter text-gray-500 mb-2">
                        {insp.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {insp.time}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-medium ${getTypeBadgeClasses(insp.type)}`}
                        >
                          {getTypeIcon(insp.type)}
                          {insp.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// ─── Sub-component: Selected Date Inspections ────────────────────────────────

interface SelectedDateInspectionsProps {
  date: Date;
  inspections: InspectionEvent[];
}

const SelectedDateInspections: React.FC<SelectedDateInspectionsProps> = ({
  date,
  inspections,
}) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-realestate-md border border-gray-100 p-5">
      <h3 className="text-sm font-space-grotesk font-bold text-realestate-primary mb-1">
        {formattedDate}
      </h3>
      <p className="text-xs font-inter text-gray-400 mb-4">
        {inspections.length} inspection{inspections.length !== 1 ? "s" : ""}
      </p>

      {inspections.length === 0 ? (
        <div className="text-center py-6">
          <Home className="w-8 h-8 text-gray-200 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-inter text-gray-400">
            No inspections scheduled
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {inspections.map((insp) => (
            <li
              key={insp.id}
              className="p-3 rounded-lg border border-gray-100 hover:border-realestate-accent/30 hover:shadow-realestate-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-inter font-semibold text-realestate-primary leading-tight">
                  {insp.propertyName}
                </p>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold ${getStatusBadgeClasses(insp.status)}`}
                >
                  {insp.status}
                </span>
              </div>
              <p className="text-xs font-inter text-gray-500 mb-1">
                {insp.address}
              </p>
              <div className="flex items-center gap-3 text-xs font-inter text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {insp.time}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeBadgeClasses(insp.type)}`}
                >
                  {getTypeIcon(insp.type)}
                  {insp.type}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InspectionsPage;
