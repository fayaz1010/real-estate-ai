// PLACEHOLDER FILE: src/modules/inspections/components/Availability/RecurringSchedule.tsx
// TODO: Add your implementation here

import { Plus, Edit, Trash2, Clock, Calendar, Power } from "lucide-react";
import React, { useState } from "react";

import { useAvailability } from "../../hooks/useAvailability";
import { RecurringSchedule as RecurringScheduleType } from "../../types/inspection.types";

interface RecurringScheduleProps {
  propertyId: string;
}

export const RecurringSchedule: React.FC<RecurringScheduleProps> = ({
  propertyId,
}) => {
  const {
    recurringSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
    isLoading: _isLoading,
  } = useAvailability();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    daysOfWeek: [] as number[],
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
    bufferTime: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const handleDayToggle = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort((a, b) => a - b),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = "Select at least one day";
    }
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const scheduleData = {
        propertyId,
        landlordId: "current-user-id", // Replace with actual user ID
        ...formData,
        excludedDates: [],
        isActive: true,
      };

      if (editingId) {
        await updateSchedule(editingId, formData);
      } else {
        await createSchedule(scheduleData);
      }

      // Reset form
      setShowForm(false);
      setEditingId(null);
      setFormData({
        daysOfWeek: [],
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
        bufferTime: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    } catch (error) {
      setErrors({ submit: "Failed to save schedule. Please try again." });
    }
  };

  const handleEdit = (schedule: RecurringScheduleType) => {
    setEditingId(schedule.id);
    setFormData({
      daysOfWeek: schedule.daysOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDuration: schedule.slotDuration,
      bufferTime: schedule.bufferTime,
      startDate: schedule.startDate,
      endDate: schedule.endDate || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(scheduleId);
      } catch (error) {
        alert("Failed to delete schedule");
      }
    }
  };

  const handleToggle = async (scheduleId: string, currentStatus: boolean) => {
    try {
      await toggleSchedule(scheduleId, !currentStatus);
    } catch (error) {
      alert("Failed to toggle schedule");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recurring Schedules
          </h3>
          <p className="text-sm text-gray-600">
            Set your regular weekly availability for inspections
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Schedules List */}
      {recurringSchedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">No schedules set</p>
          <p className="text-sm text-gray-500 mb-4">
            Create a recurring schedule to allow inspection bookings
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recurringSchedules.map((schedule: RecurringScheduleType) => (
            <div
              key={schedule.id}
              className={`p-6 rounded-lg border-2 ${
                schedule.isActive
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      schedule.isActive ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 ${
                        schedule.isActive ? "text-green-600" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {schedule.daysOfWeek
                        .map((day) => daysOfWeek[day].label.slice(0, 3))
                        .join(", ")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(schedule.id, schedule.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      schedule.isActive
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-200"
                    }`}
                    title={schedule.isActive ? "Disable" : "Enable"}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Slot Duration</p>
                  <p className="font-medium text-gray-900">
                    {schedule.slotDuration} min
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Buffer Time</p>
                  <p className="font-medium text-gray-900">
                    {schedule.bufferTime} min
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(schedule.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">End Date</p>
                  <p className="font-medium text-gray-900">
                    {schedule.endDate
                      ? new Date(schedule.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {editingId ? "Edit Schedule" : "Add Recurring Schedule"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Days of Week */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Days *
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-colors
                        ${
                          formData.daysOfWeek.includes(day.value)
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
                {errors.daysOfWeek && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.daysOfWeek}
                  </p>
                )}
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Duration & Buffer */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slot Duration (minutes) *
                  </label>
                  <select
                    value={formData.slotDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slotDuration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buffer Time (minutes)
                  </label>
                  <select
                    value={formData.bufferTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bufferTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>No buffer</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Schedule" : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
