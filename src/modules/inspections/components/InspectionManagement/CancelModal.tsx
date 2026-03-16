// ============================================================================
// FILE PATH: src/modules/inspections/components/InspectionManagement/CancelModal.tsx
// Cancel Inspection Modal Component
// ============================================================================

import { X, AlertCircle } from "lucide-react";
import React, { useState } from "react";

import { useInspections } from "../../hooks/useInspections";
import { Inspection } from "../../types/inspection.types";

interface CancelModalProps {
  inspection: Inspection;
  isOpen: boolean;
  onClose: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  inspection,
  isOpen,
  onClose,
}) => {
  const { cancel } = useInspections();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setIsSubmitting(true);
    try {
      await cancel(inspection.id, reason);
      onClose();
    } catch (error) {
      console.error("Failed to cancel inspection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Cancel Inspection
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Are you sure you want to cancel this inspection? This action cannot
            be undone.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Cancellation *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide a reason..."
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep Inspection
          </button>
          <button
            onClick={handleCancel}
            disabled={isSubmitting || !reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? "Cancelling..." : "Cancel Inspection"}
          </button>
        </div>
      </div>
    </div>
  );
};
