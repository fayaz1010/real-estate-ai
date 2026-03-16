// FILE PATH: src/components/scheduling/UpcomingBookings.tsx
// Smart Scheduling & Booking System - Upcoming Bookings List

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Users,
  Eye,
  Wrench,
  Search,
  ChevronRight,
  XCircle,
  CalendarClock,
  CheckCircle,
} from "lucide-react";
import type { Booking, BookingType } from "../../types/scheduling";

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<BookingType, { icon: React.ReactNode; bg: string; text: string }> = {
  viewing:     { icon: <Eye className="w-4 h-4" />,    bg: "bg-blue-100",   text: "text-blue-700" },
  inspection:  { icon: <Search className="w-4 h-4" />, bg: "bg-orange-100", text: "text-orange-700" },
  maintenance: { icon: <Wrench className="w-4 h-4" />, bg: "bg-green-100",  text: "text-green-700" },
  meeting:     { icon: <Users className="w-4 h-4" />,  bg: "bg-purple-100", text: "text-purple-700" },
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancel?: (bookingId: string) => void;
  onReschedule?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancel,
  onReschedule,
  onViewDetails,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const upcoming = [...bookings]
    .filter((b) => b.status !== "cancelled" && b.status !== "completed")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleCancel = (id: string) => {
    if (cancellingId === id) {
      onCancel?.(id);
      setCancellingId(null);
    } else {
      setCancellingId(id);
    }
  };

  if (upcoming.length === 0) {
    return (
      <div className="text-center py-10">
        <CalendarClock className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm text-gray-500 font-['Open_Sans']">No upcoming bookings</p>
        <p className="text-xs text-gray-400 font-['Open_Sans'] mt-1">
          Create a new booking to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-[#091a2b] font-['Montserrat'] mb-4">
        Upcoming Bookings
      </h3>
      <div className="space-y-3">
        {upcoming.map((booking) => {
          const config = TYPE_CONFIG[booking.type];
          const start = new Date(booking.startTime);
          const end = new Date(booking.endTime);
          const isConfirmed = booking.status === "confirmed";

          return (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Type Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-[#091a2b] font-['Open_Sans'] truncate">
                        {booking.title || `${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Booking`}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-['Open_Sans']">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {start.toLocaleDateString("en-US", {
                            month: "short", day: "numeric",
                          })}{" "}
                          {start.toLocaleTimeString("en-US", {
                            hour: "numeric", minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {end.toLocaleTimeString("en-US", {
                            hour: "numeric", minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" aria-hidden="true" />
                          {booking.propertyId}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Open_Sans'] ${
                        isConfirmed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isConfirmed ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Attendees */}
                  {booking.attendees.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 font-['Open_Sans']">
                      <Users className="w-3 h-3" aria-hidden="true" />
                      {booking.attendees.map((a) => a.name).join(", ")}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onViewDetails?.(booking)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#005163] hover:text-[#091a2b] transition-colors font-['Open_Sans']"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onReschedule?.(booking)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b4876] hover:text-[#091a2b] transition-colors font-['Open_Sans']"
                    >
                      <CalendarClock className="w-3 h-3" /> Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors font-['Open_Sans'] ${
                        cancellingId === booking.id
                          ? "text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      {cancellingId === booking.id ? "Confirm Cancel" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingBookings;
