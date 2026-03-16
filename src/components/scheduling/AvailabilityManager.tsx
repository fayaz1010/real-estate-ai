// FILE PATH: src/components/scheduling/AvailabilityManager.tsx
// Smart Scheduling & Booking System - Availability Management Component

import React, { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  CalendarOff,
  RotateCcw,
  Check,
} from "lucide-react";
import type { RecurringAvailability, BlackoutDate } from "../../types/scheduling";

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface AvailabilityManagerProps {
  onSave?: (
    recurring: RecurringAvailability[],
    blackouts: BlackoutDate[],
  ) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ onSave }) => {
  const [recurring, setRecurring] = useState<RecurringAvailability[]>([
    { id: "rec-1", dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { id: "rec-2", dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { id: "rec-3", dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { id: "rec-4", dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    { id: "rec-5", dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
  ]);
  const [blackouts, setBlackouts] = useState<BlackoutDate[]>([]);
  const [newBlackoutDate, setNewBlackoutDate] = useState("");
  const [newBlackoutReason, setNewBlackoutReason] = useState("");
  const [saved, setSaved] = useState(false);

  // ─── Recurring Availability ──────────────────────────────────────────────

  const addRecurring = () => {
    const id = `rec-${Date.now()}`;
    setRecurring([...recurring, { id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const removeRecurring = (id: string) =>
    setRecurring(recurring.filter((r) => r.id !== id));

  const updateRecurring = (
    id: string,
    field: keyof Omit<RecurringAvailability, "id">,
    value: string | number,
  ) => {
    setRecurring(
      recurring.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  // ─── Blackout Dates ─────────────────────────────────────────────────────

  const addBlackout = () => {
    if (!newBlackoutDate) return;
    setBlackouts([
      ...blackouts,
      {
        id: `bo-${Date.now()}`,
        date: new Date(newBlackoutDate),
        reason: newBlackoutReason.trim() || undefined,
      },
    ]);
    setNewBlackoutDate("");
    setNewBlackoutReason("");
  };

  const removeBlackout = (id: string) =>
    setBlackouts(blackouts.filter((b) => b.id !== id));

  // ─── Save ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    onSave?.(recurring, blackouts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ─── Styles ──────────────────────────────────────────────────────────────

  const fieldClasses =
    "px-3 py-2 border border-[#091a2b]/20 rounded-lg text-sm text-[#091a2b] font-['Open_Sans'] focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent bg-white";

  const labelClasses =
    "block text-sm font-semibold text-[#091a2b] font-['Open_Sans'] mb-1.5";

  // ─── Weekly Availability Grid ────────────────────────────────────────────

  const renderWeeklyGrid = () => {
    const availByDay = new Map<number, RecurringAvailability[]>();
    recurring.forEach((r) => {
      const arr = availByDay.get(r.dayOfWeek) || [];
      arr.push(r);
      availByDay.set(r.dayOfWeek, arr);
    });

    return (
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAYS_OF_WEEK.map((day) => {
          const slots = availByDay.get(day.value) || [];
          const hasAvailability = slots.length > 0;
          return (
            <div
              key={day.value}
              className={`text-center p-2 rounded-lg text-xs font-['Open_Sans'] ${
                hasAvailability
                  ? "bg-[#091a2b]/5 border border-[#091a2b]/20"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <span className={`font-semibold ${hasAvailability ? "text-[#091a2b]" : "text-gray-400"}`}>
                {day.label.slice(0, 3)}
              </span>
              {slots.map((s) => (
                <div key={s.id} className="text-[10px] text-[#005163] mt-1">
                  {s.startTime}–{s.endTime}
                </div>
              ))}
              {!hasAvailability && (
                <div className="text-[10px] text-gray-400 mt-1">Unavailable</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Recurring Availability */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-[#091a2b] font-['Montserrat'] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#005163]" aria-hidden="true" />
            Recurring Availability
          </h4>
          <button
            type="button"
            onClick={addRecurring}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#005163] hover:text-[#091a2b] transition-colors font-['Open_Sans']"
          >
            <Plus className="w-3.5 h-3.5" /> Add Slot
          </button>
        </div>

        {renderWeeklyGrid()}

        <div className="space-y-2">
          {recurring.map((r) => (
            <div key={r.id} className="flex items-center gap-2 flex-wrap">
              <select
                value={r.dayOfWeek}
                onChange={(e) => updateRecurring(r.id, "dayOfWeek", Number(e.target.value))}
                className={fieldClasses + " w-36"}
                aria-label="Day of week"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                <input
                  type="time"
                  value={r.startTime}
                  onChange={(e) => updateRecurring(r.id, "startTime", e.target.value)}
                  className={fieldClasses + " w-28"}
                  aria-label="Start time"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="time"
                  value={r.endTime}
                  onChange={(e) => updateRecurring(r.id, "endTime", e.target.value)}
                  className={fieldClasses + " w-28"}
                  aria-label="End time"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRecurring(r.id)}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                aria-label="Remove slot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blackout Dates */}
      <div>
        <h4 className="text-base font-bold text-[#091a2b] font-['Montserrat'] flex items-center gap-2 mb-3">
          <CalendarOff className="w-4 h-4 text-red-500" aria-hidden="true" />
          Blackout Dates
        </h4>
        <p className="text-xs text-gray-500 font-['Open_Sans'] mb-3">
          Block off specific dates when you are unavailable for bookings.
        </p>

        <div className="flex items-end gap-2 mb-3 flex-wrap">
          <div>
            <label className={labelClasses} htmlFor="blackout-date">Date</label>
            <input
              id="blackout-date"
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="blackout-reason">Reason (optional)</label>
            <input
              id="blackout-reason"
              type="text"
              value={newBlackoutReason}
              onChange={(e) => setNewBlackoutReason(e.target.value)}
              placeholder="e.g. Holiday"
              className={fieldClasses + " w-48"}
            />
          </div>
          <button
            type="button"
            onClick={addBlackout}
            disabled={!newBlackoutDate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-40 transition-colors font-['Open_Sans']"
          >
            <Plus className="w-3.5 h-3.5" /> Add Blackout
          </button>
        </div>

        {blackouts.length > 0 && (
          <div className="space-y-1.5">
            {blackouts
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-2 text-sm font-['Open_Sans']">
                    <CalendarOff className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
                    <span className="font-medium text-red-800">
                      {new Date(b.date).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                    {b.reason && <span className="text-red-600 text-xs">— {b.reason}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlackout(b.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove blackout"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        )}
        {blackouts.length === 0 && (
          <p className="text-xs text-gray-400 font-['Open_Sans'] italic">No blackout dates set.</p>
        )}
      </div>

      {/* Save */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#091a2b] text-white text-sm font-semibold rounded-lg hover:bg-[#005163] transition-colors font-['Open_Sans']"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved!" : "Save Availability"}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityManager;
