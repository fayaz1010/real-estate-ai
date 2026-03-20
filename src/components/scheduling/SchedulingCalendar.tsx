// FILE PATH: src/components/scheduling/SchedulingCalendar.tsx
// Smart Scheduling & Booking System - Calendar View Component

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Wrench,
  Search,
  Users,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import React, { useState, useMemo } from "react";

import type { Booking, BookingType } from "../../types/scheduling";

// ─── Constants ───────────────────────────────────────────────────────────────

type CalendarView = "month" | "week" | "day";

const BOOKING_TYPE_COLORS: Record<
  BookingType,
  { bg: string; text: string; border: string }
> = {
  viewing: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  inspection: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
  },
  maintenance: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  meeting: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
  },
};

const BOOKING_TYPE_ICONS: Record<BookingType, React.ReactNode> = {
  viewing: <Eye className="w-3 h-3" aria-hidden="true" />,
  inspection: <Search className="w-3 h-3" aria-hidden="true" />,
  maintenance: <Wrench className="w-3 h-3" aria-hidden="true" />,
  meeting: <Users className="w-3 h-3" aria-hidden="true" />,
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getWeekDays(date: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SchedulingCalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  onDateClick?: (date: Date) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({
  bookings,
  onBookingClick,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const today = useMemo(() => new Date(), []);

  // ─── Navigation ──────────────────────────────────────────────────────────

  const navigate = (direction: -1 | 1) => {
    const next = new Date(currentDate);
    if (view === "month") next.setMonth(next.getMonth() + direction);
    else if (view === "week") next.setDate(next.getDate() + 7 * direction);
    else next.setDate(next.getDate() + direction);
    setCurrentDate(next);
  };

  const goToToday = () => setCurrentDate(new Date());

  // ─── Bookings by date ────────────────────────────────────────────────────

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      const key = new Date(b.startTime).toDateString();
      const arr = map.get(key) || [];
      arr.push(b);
      map.set(key, arr);
    });
    return map;
  }, [bookings]);

  const getBookingsForDate = (date: Date): Booking[] =>
    bookingsByDate.get(date.toDateString()) || [];

  // ─── Title ───────────────────────────────────────────────────────────────

  const title = useMemo(() => {
    if (view === "month")
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    if (view === "week") {
      const week = getWeekDays(currentDate);
      const start = week[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = week[6].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${start} – ${end}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [currentDate, view]);

  // ─── Month View ──────────────────────────────────────────────────────────

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    const startDay = days[0].getDay();
    const cells: (Date | null)[] = Array(startDay).fill(null).concat(days);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-[#1A1A2E] font-['Inter']"
          >
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date)
            return (
              <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
            );
          const dayBookings = getBookingsForDate(date);
          const isToday = isSameDay(date, today);
          return (
            <div
              key={date.toISOString()}
              className={`bg-white min-h-[100px] p-1.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday ? "ring-2 ring-inset ring-[#008080]" : ""
              }`}
              onClick={() => onDateClick?.(date)}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full font-['Inter'] ${
                  isToday ? "bg-[#1A1A2E] text-white" : "text-[#1A1A2E]"
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayBookings.slice(0, 3).map((b) => {
                  const colors = BOOKING_TYPE_COLORS[b.type];
                  return (
                    <button
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(b);
                        onBookingClick?.(b);
                      }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] truncate ${colors.bg} ${colors.text} border ${colors.border} hover:opacity-80 transition-opacity font-['Inter']`}
                    >
                      {formatTime(new Date(b.startTime))} {b.title || b.type}
                    </button>
                  );
                })}
                {dayBookings.length > 3 && (
                  <span className="text-[10px] text-gray-500 font-['Inter'] pl-1">
                    +{dayBookings.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Week View ───────────────────────────────────────────────────────────

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm

    return (
      <div className="overflow-auto rounded-lg border border-gray-200">
        <div className="grid grid-cols-8 min-w-[700px]">
          {/* Header */}
          <div className="bg-gray-50 border-b border-r border-gray-200 p-2" />
          {weekDays.map((d) => (
            <div
              key={d.toISOString()}
              className={`bg-gray-50 border-b border-r border-gray-200 p-2 text-center ${
                isSameDay(d, today) ? "bg-[#008080]/5" : ""
              }`}
            >
              <div className="text-xs font-semibold text-[#1A1A2E] font-['Inter']">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-lg font-bold font-['Manrope'] ${
                  isSameDay(d, today) ? "text-[#008080]" : "text-[#1A1A2E]"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-r border-b border-gray-200 p-1 text-right">
                <span className="text-[10px] text-gray-500 font-['Inter']">
                  {hour > 12
                    ? `${hour - 12}PM`
                    : hour === 12
                      ? "12PM"
                      : `${hour}AM`}
                </span>
              </div>
              {weekDays.map((d) => {
                const dayBookings = getBookingsForDate(d).filter((b) => {
                  const h = new Date(b.startTime).getHours();
                  return h === hour;
                });
                return (
                  <div
                    key={`${d.toISOString()}-${hour}`}
                    className="border-r border-b border-gray-200 p-0.5 min-h-[48px] cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      const clicked = new Date(d);
                      clicked.setHours(hour, 0, 0, 0);
                      onDateClick?.(clicked);
                    }}
                  >
                    {dayBookings.map((b) => {
                      const colors = BOOKING_TYPE_COLORS[b.type];
                      return (
                        <button
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                            onBookingClick?.(b);
                          }}
                          className={`w-full text-left px-1 py-0.5 rounded text-[10px] truncate ${colors.bg} ${colors.text} border ${colors.border} font-['Inter']`}
                        >
                          {b.title || b.type}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // ─── Day View ────────────────────────────────────────────────────────────

  const renderDayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 7);
    const dayBookings = getBookingsForDate(currentDate);

    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {hours.map((hour) => {
          const hourBookings = dayBookings.filter(
            (b) => new Date(b.startTime).getHours() === hour,
          );
          return (
            <div
              key={hour}
              className="flex border-b border-gray-200 last:border-b-0"
            >
              <div className="w-20 flex-shrink-0 p-2 text-right border-r border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500 font-['Inter']">
                  {hour > 12
                    ? `${hour - 12}:00 PM`
                    : hour === 12
                      ? "12:00 PM"
                      : `${hour}:00 AM`}
                </span>
              </div>
              <div
                className="flex-1 p-1 min-h-[56px] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  const clicked = new Date(currentDate);
                  clicked.setHours(hour, 0, 0, 0);
                  onDateClick?.(clicked);
                }}
              >
                {hourBookings.map((b) => {
                  const colors = BOOKING_TYPE_COLORS[b.type];
                  return (
                    <button
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(b);
                        onBookingClick?.(b);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${colors.bg} ${colors.text} border ${colors.border} font-['Inter']`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {BOOKING_TYPE_ICONS[b.type]}
                        {b.title || b.type}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-75">
                        {formatTime(new Date(b.startTime))} –{" "}
                        {formatTime(new Date(b.endTime))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Booking Detail Modal ────────────────────────────────────────────────

  const renderBookingModal = () => {
    if (!selectedBooking) return null;
    const b = selectedBooking;
    const colors = BOOKING_TYPE_COLORS[b.type];

    return (
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedBooking(null)}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} font-['Inter']`}
              >
                {BOOKING_TYPE_ICONS[b.type]}
                {b.type.charAt(0).toUpperCase() + b.type.slice(1)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold font-['Inter'] ${
                  b.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : b.status === "completed"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </span>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-[#1A1A2E] font-['Manrope'] mb-3">
            {b.title ||
              `${b.type.charAt(0).toUpperCase() + b.type.slice(1)} Booking`}
          </h3>

          {b.description && (
            <p className="text-sm text-gray-600 font-['Inter'] mb-4">
              {b.description}
            </p>
          )}

          <div className="space-y-3 text-sm font-['Inter']">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-[#008080]" aria-hidden="true" />
              <span>
                {new Date(b.startTime).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                {formatTime(new Date(b.startTime))} –{" "}
                {formatTime(new Date(b.endTime))}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-[#008080]" aria-hidden="true" />
              <span>Property: {b.propertyId}</span>
            </div>

            {b.attendees.length > 0 && (
              <div className="flex items-start gap-2 text-gray-700">
                <Users
                  className="w-4 h-4 text-[#008080] mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  {b.attendees.map((a) => (
                    <div key={a.id} className="text-xs">
                      {a.name}{" "}
                      <span className="text-gray-400">
                        ({a.role.replace("_", " ")})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {b.notes && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">Notes</p>
                <p className="text-sm text-gray-700">{b.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-[#1A1A2E] transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-[#1A1A2E] font-['Manrope'] min-w-[200px] text-center">
            {title}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-[#1A1A2E] transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white transition-colors font-['Inter']"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {(["month", "week", "day"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-['Inter'] ${
                view === v
                  ? "bg-[#1A1A2E] text-white"
                  : "text-gray-600 hover:text-[#1A1A2E]"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {(Object.keys(BOOKING_TYPE_COLORS) as BookingType[]).map((type) => {
          const c = BOOKING_TYPE_COLORS[type];
          return (
            <span
              key={type}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text} font-['Inter']`}
            >
              {BOOKING_TYPE_ICONS[type]}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          );
        })}
      </div>

      {/* Calendar View */}
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}

      {/* Booking Detail Modal */}
      {renderBookingModal()}
    </div>
  );
};

export default SchedulingCalendar;
