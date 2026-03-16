// PLACEHOLDER FILE: src/modules/inspections/components/Availability/BlackoutDates.tsx
// TODO: Add your implementation here

import React, { useState } from 'react';
import { Plus, Trash2, XCircle, Calendar } from 'lucide-react';
import { useAvailability } from '../../hooks/useAvailability';
import { BlackoutDate } from '../../types/inspection.types';

interface BlackoutDatesProps {
  propertyId: string;
}

export const BlackoutDates: React.FC<BlackoutDatesProps> = ({ propertyId }) => {
  const { blackoutDates, createBlackout, deleteBlackout } = useAvailability();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createBlackout({
        propertyId,
        landlordId: 'current-user-id', // Replace with actual user ID
        ...formData,
      });

      // Reset form
      setShowForm(false);
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      setErrors({ submit: 'Failed to create blackout date. Please try again.' });
    }
  };

  const handleDelete = async (blackoutId: string) => {
    if (window.confirm('Are you sure you want to remove this blackout period?')) {
      try {
        await deleteBlackout(blackoutId);
      } catch (error) {
        alert('Failed to delete blackout date');
      }
    }
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (startDate === endDate) {
      return start.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  const getDaysCount = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const isUpcoming = (startDate: string): boolean => {
    return new Date(startDate) > new Date();
  };

  const upcomingBlackouts = blackoutDates.filter((b: BlackoutDate) => isUpcoming(b.startDate));
  const pastBlackouts = blackoutDates.filter((b: BlackoutDate) => !isUpcoming(b.startDate));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Blackout Dates</h3>
          <p className="text-sm text-gray-600">
            Block specific dates when inspections cannot be scheduled
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Blackout
        </button>
      </div>

      {/* Upcoming Blackouts */}
      {upcomingBlackouts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Upcoming Blackouts
          </h4>
          <div className="space-y-3">
            {upcomingBlackouts.map((blackout: BlackoutDate) => (
              <div
                key={blackout.id}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {formatDateRange(blackout.startDate, blackout.endDate)}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        {blackout.reason}
                      </p>
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        {getDaysCount(blackout.startDate, blackout.endDate)} day
                        {getDaysCount(blackout.startDate, blackout.endDate) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(blackout.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Blackouts */}
      {pastBlackouts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Past Blackouts
          </h4>
          <div className="space-y-3">
            {pastBlackouts.map((blackout: BlackoutDate) => (
              <div
                key={blackout.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-700 mb-1">
                        {formatDateRange(blackout.startDate, blackout.endDate)}
                      </h5>
                      <p className="text-sm text-gray-600">{blackout.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(blackout.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {blackoutDates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">No blackout dates</p>
          <p className="text-sm text-gray-500 mb-4">
            Add blackout dates to block specific periods from bookings
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Blackout Date
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Add Blackout Period
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Date Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>

              {/* Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="e.g., Vacation, Maintenance, Holiday..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <div className="flex justify-between mt-1">
                  {errors.reason && (
                    <p className="text-sm text-red-600">{errors.reason}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.reason.length}/200
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                Tenants will not be able to book inspections during this period.
                Existing bookings will not be affected.
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
                    setFormData({ startDate: '', endDate: '', reason: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Blackout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};