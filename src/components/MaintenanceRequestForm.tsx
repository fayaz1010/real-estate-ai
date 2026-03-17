import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import apiClient from "@/api/client";
import {
  MAINTENANCE_SYSTEM_TYPES,
  MAINTENANCE_PRIORITIES,
} from "@/schemas/maintenance";
import type { Property } from "@/types";

interface MaintenanceRequestFormProps {
  properties: Property[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({
  properties,
  onSuccess,
  onCancel,
}) => {
  const [propertyId, setPropertyId] = useState("");
  const [systemType, setSystemType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!propertyId) errors.propertyId = "Please select a property";
    if (!systemType) errors.systemType = "Please select a category";
    if (!description.trim())
      errors.description = "Description is required";
    else if (description.length > 2000)
      errors.description = "Description must be under 2000 characters";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/maintenance", {
        propertyId,
        systemType,
        description: description.trim(),
        priority,
      });

      setSuccess(true);
      setPropertyId("");
      setSystemType("");
      setDescription("");
      setPriority("MEDIUM");
      setFile(null);
      setValidationErrors({});

      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const systemTypeLabels: Record<string, string> = {
    HVAC: "HVAC",
    PLUMBING: "Plumbing",
    ELECTRICAL: "Electrical",
    ROOFING: "Roofing",
    APPLIANCE: "Appliance",
    STRUCTURAL: "Structural",
  };

  const priorityLabels: Record<string, string> = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="New maintenance request"
    >
      <div
        className="rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        style={{ backgroundColor: "#FAF6F1" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#C4A882" }}
        >
          <h2
            className="font-bold text-lg"
            style={{ fontFamily: "DM Serif Display, serif", color: "#8B7355" }}
          >
            New Maintenance Request
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close form"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "#8B7355" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
            Request submitted successfully!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Property */}
          <div>
            <label
              htmlFor="mf-property"
              className="block text-sm font-medium mb-1"
              style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
            >
              Property <span className="text-red-500">*</span>
            </label>
            <select
              id="mf-property"
              value={propertyId}
              onChange={(e) => {
                setPropertyId(e.target.value);
                setValidationErrors((v) => ({ ...v, propertyId: "" }));
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                fontFamily: "Inter, sans-serif",
                borderColor: validationErrors.propertyId
                  ? "#ef4444"
                  : "#C4A882",
                color: "#2D2A26",
              }}
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.address.street}, {p.address.city}
                </option>
              ))}
            </select>
            {validationErrors.propertyId && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.propertyId}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="mf-category"
              className="block text-sm font-medium mb-1"
              style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="mf-category"
              value={systemType}
              onChange={(e) => {
                setSystemType(e.target.value);
                setValidationErrors((v) => ({ ...v, systemType: "" }));
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                fontFamily: "Inter, sans-serif",
                borderColor: validationErrors.systemType
                  ? "#ef4444"
                  : "#C4A882",
                color: "#2D2A26",
              }}
            >
              <option value="">Select a category</option>
              {MAINTENANCE_SYSTEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {systemTypeLabels[t] || t}
                </option>
              ))}
            </select>
            {validationErrors.systemType && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.systemType}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="mf-priority"
              className="block text-sm font-medium mb-1"
              style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
            >
              Priority
            </label>
            <select
              id="mf-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                fontFamily: "Inter, sans-serif",
                borderColor: "#C4A882",
                color: "#2D2A26",
              }}
            >
              {MAINTENANCE_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {priorityLabels[p] || p}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="mf-description"
              className="block text-sm font-medium mb-1"
              style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="mf-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setValidationErrors((v) => ({ ...v, description: "" }));
              }}
              placeholder="Describe the issue in detail..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{
                fontFamily: "Inter, sans-serif",
                borderColor: validationErrors.description
                  ? "#ef4444"
                  : "#C4A882",
                color: "#2D2A26",
              }}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
            <p
              className="text-xs mt-1"
              style={{ color: "#A0926B" }}
            >
              {description.length}/2000
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
            >
              Attachment (optional)
            </label>
            {file ? (
              <div
                className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: "#C4A882", color: "#2D2A26" }}
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove attachment"
                  className="ml-2 hover:opacity-70"
                  style={{ color: "#8B7355" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:opacity-80 transition-opacity block"
                style={{ borderColor: "#C4A882" }}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: "#A0926B" }} />
                <p className="text-xs" style={{ color: "#A0926B" }}>
                  Click to upload a photo
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#8B7355",
                backgroundColor: "transparent",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                fontFamily: "Inter, sans-serif",
                backgroundColor: "#C4A882",
              }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
