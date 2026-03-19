// PLACEHOLDER FILE: components\ApplicationReview\ApprovalWorkflow.tsx
// TODO: Add your implementation here

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

import { useApplicationReview } from "../../hooks/useApplicationReview";
import { Application } from "../../types/application.types";

interface ApprovalWorkflowProps {
  application: Application;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ application }) => {
  const { approve, reject, requestMoreInfo, addNotes } = useApplicationReview();

  const [action, setAction] = useState<
    "approve" | "reject" | "request_info" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [landlordNotes, setLandlordNotes] = useState(
    application.landlordNotes || "",
  );
  const [conditions, setConditions] = useState<string[]>(
    application.conditions || [],
  );
  const [newCondition, setNewCondition] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requiredFields] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const rejectionReasons = [
    "Insufficient income",
    "Poor credit history",
    "Negative rental history",
    "Background check concerns",
    "Incomplete application",
    "Property no longer available",
    "Other",
  ];

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await approve(
        application.id,
        conditions.length > 0 ? conditions : undefined,
      );
      alert("Application approved successfully!");
    } catch (error) {
      alert("Failed to approve application");
    } finally {
      setProcessing(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection");
      return;
    }

    setProcessing(true);
    try {
      await reject(application.id, rejectionReason);
      alert("Application rejected");
    } catch (error) {
      alert("Failed to reject application");
    } finally {
      setProcessing(false);
      setAction(null);
    }
  };

  const handleRequestInfo = async () => {
    if (!requestMessage) {
      alert("Please provide a message");
      return;
    }

    setProcessing(true);
    try {
      await requestMoreInfo(application.id, requestMessage, requiredFields);
      alert("Request sent to applicant");
    } catch (error) {
      alert("Failed to send request");
    } finally {
      setProcessing(false);
      setAction(null);
    }
  };

  const handleSaveNotes = async () => {
    setProcessing(true);
    try {
      await addNotes(application.id, landlordNotes);
      alert("Notes saved");
    } catch (error) {
      alert("Failed to save notes");
    } finally {
      setProcessing(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const canTakeAction = [
    "submitted",
    "under_review",
    "verification_pending",
  ].includes(application.status);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Application Actions
        </h3>
        <p className="text-sm text-gray-600">
          Review the application and take appropriate action
        </p>
      </div>

      {/* Current Status */}
      <div
        className={`rounded-lg p-4 ${
          application.status === "approved" ||
          application.status === "conditionally_approved"
            ? "bg-green-50 border border-green-200"
            : application.status === "rejected"
              ? "bg-red-50 border border-red-200"
              : "bg-blue-50 border border-blue-200"
        }`}
      >
        <p className="font-medium text-gray-900 mb-1">Current Status</p>
        <p className="text-sm capitalize">
          {application.status.replace("_", " ")}
        </p>
        {application.reviewedAt && (
          <p className="text-xs text-gray-600 mt-2">
            Reviewed on {new Date(application.reviewedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Landlord Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Private Notes (Only visible to you)
        </label>
        <textarea
          value={landlordNotes}
          onChange={(e) => setLandlordNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Add notes about this applicant..."
        />
        <button
          onClick={handleSaveNotes}
          disabled={processing}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          Save Notes
        </button>
      </div>

      {/* Action Buttons */}
      {canTakeAction && !action && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setAction("approve")}
            className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-green-900 mb-1">
              Approve Application
            </h4>
            <p className="text-sm text-green-700">Accept this applicant</p>
          </button>

          <button
            onClick={() => setAction("request_info")}
            className="p-6 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-left"
          >
            <MessageSquare className="w-8 h-8 text-yellow-600 mb-3" />
            <h4 className="font-semibold text-yellow-900 mb-1">
              Request More Info
            </h4>
            <p className="text-sm text-yellow-700">
              Ask for additional details
            </p>
          </button>

          <button
            onClick={() => setAction("reject")}
            className="p-6 border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors text-left"
          >
            <XCircle className="w-8 h-8 text-red-600 mb-3" />
            <h4 className="font-semibold text-red-900 mb-1">
              Reject Application
            </h4>
            <p className="text-sm text-red-700">Decline this applicant</p>
          </button>
        </div>
      )}

      {/* Approval Form */}
      {action === "approve" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-900 mb-4">
            Approve Application
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add any conditions that must be met before move-in
              </p>

              <div className="space-y-2 mb-3">
                {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded p-3 border border-green-200"
                  >
                    <span className="text-sm">{condition}</span>
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCondition()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Provide proof of renters insurance"
                />
                <button
                  onClick={addCondition}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {processing ? "Processing..." : "Confirm Approval"}
              </button>
              <button
                onClick={() => setAction(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Form */}
      {action === "reject" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-4">
            Reject Application
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-3"
              >
                <option value="">Select a reason</option>
                {rejectionReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {rejectionReason === "Other" && (
                <textarea
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Please specify the reason..."
                />
              )}
            </div>

            <div className="bg-red-100 border border-red-300 rounded p-3">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  This action cannot be undone. The applicant will be notified
                  of the rejection.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {processing ? "Processing..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => setAction(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request More Info Form */}
      {action === "request_info" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-4">
            Request Additional Information
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Applicant *
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                rows={4}
                placeholder="Explain what additional information or documents you need..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRequestInfo}
                disabled={processing || !requestMessage}
                className="flex-1 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium"
              >
                {processing ? "Sending..." : "Send Request"}
              </button>
              <button
                onClick={() => setAction(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
