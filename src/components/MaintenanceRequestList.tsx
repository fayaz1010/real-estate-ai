import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wrench,
} from "lucide-react";
import apiClient from "@/api/client";
import type { MaintenanceRequest } from "@/types";
import {
  MaintenanceRequestStatus,
  MaintenanceSystemType,
  MaintenancePriority,
} from "@/types";

interface MaintenanceRequestListProps {
  requests: MaintenanceRequest[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<
  MaintenanceRequestStatus,
  { label: string; colorClass: string; icon: React.ReactNode }
> = {
  [MaintenanceRequestStatus.OPEN]: {
    label: "Open",
    colorClass: "bg-amber-100 text-amber-800",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  [MaintenanceRequestStatus.IN_PROGRESS]: {
    label: "In Progress",
    colorClass: "bg-blue-100 text-blue-800",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  [MaintenanceRequestStatus.COMPLETED]: {
    label: "Completed",
    colorClass: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  [MaintenanceRequestStatus.CLOSED]: {
    label: "Closed",
    colorClass: "bg-slate-100 text-slate-600",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const PRIORITY_STYLES: Record<MaintenancePriority, string> = {
  [MaintenancePriority.HIGH]: "text-red-600 font-semibold",
  [MaintenancePriority.MEDIUM]: "text-amber-600",
  [MaintenancePriority.LOW]: "text-slate-500",
};

const SYSTEM_TYPE_LABELS: Record<MaintenanceSystemType, string> = {
  [MaintenanceSystemType.HVAC]: "HVAC",
  [MaintenanceSystemType.PLUMBING]: "Plumbing",
  [MaintenanceSystemType.ELECTRICAL]: "Electrical",
  [MaintenanceSystemType.ROOFING]: "Roofing",
  [MaintenanceSystemType.APPLIANCE]: "Appliance",
  [MaintenanceSystemType.STRUCTURAL]: "Structural",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: MaintenanceRequestStatus.OPEN, label: "Open" },
  { value: MaintenanceRequestStatus.IN_PROGRESS, label: "In Progress" },
  { value: MaintenanceRequestStatus.COMPLETED, label: "Completed" },
  { value: MaintenanceRequestStatus.CLOSED, label: "Closed" },
];

const NEXT_STATUS: Record<string, MaintenanceRequestStatus | null> = {
  [MaintenanceRequestStatus.OPEN]: MaintenanceRequestStatus.IN_PROGRESS,
  [MaintenanceRequestStatus.IN_PROGRESS]: MaintenanceRequestStatus.COMPLETED,
  [MaintenanceRequestStatus.COMPLETED]: MaintenanceRequestStatus.CLOSED,
  [MaintenanceRequestStatus.CLOSED]: null,
};

const ITEMS_PER_PAGE = 10;

export const MaintenanceRequestList: React.FC<MaintenanceRequestListProps> = ({
  requests,
  loading,
  error,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const filtered = statusFilter
    ? requests.filter((r) => r.status === statusFilter)
    : requests;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusUpdate = async (
    id: string,
    newStatus: MaintenanceRequestStatus
  ) => {
    setUpdatingId(id);
    setUpdateError(null);
    try {
      await apiClient.patch(`/maintenance/${id}`, { status: newStatus });
      onRefresh();
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#8B7355" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={onRefresh}
          className="text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
          style={{ color: "#8B7355", border: "1px solid #C4A882" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            fontFamily: "Inter, sans-serif",
            borderColor: "#C4A882",
            color: "#2D2A26",
          }}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="text-sm ml-auto"
          style={{ fontFamily: "Inter, sans-serif", color: "#A0926B" }}
        >
          {filtered.length} request{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Update Error */}
      {updateError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {updateError}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Wrench
            className="w-10 h-10 mx-auto mb-3 opacity-30"
            style={{ color: "#A0926B" }}
          />
          <p
            className="text-sm"
            style={{ fontFamily: "Inter, sans-serif", color: "#A0926B" }}
          >
            No maintenance requests found.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Maintenance requests">
          {paginated.map((req) => {
            const sc = STATUS_CONFIG[req.status];
            const nextStatus = NEXT_STATUS[req.status];
            return (
              <li
                key={req.id}
                className="rounded-xl border p-4 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#C4A882",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#A0926B" }}
                      >
                        {req.id.slice(0, 8)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.colorClass}`}
                      >
                        {sc.icon} {sc.label}
                      </span>
                      <span
                        className={`text-xs ${PRIORITY_STYLES[req.priority]}`}
                      >
                        {req.priority} Priority
                      </span>
                    </div>

                    {/* Category */}
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{
                        fontFamily: "DM Serif Display, serif",
                        color: "#2D2A26",
                      }}
                    >
                      {SYSTEM_TYPE_LABELS[req.systemType] || req.systemType}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm line-clamp-2 mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: "#2D2A26",
                        opacity: 0.8,
                      }}
                    >
                      {req.description}
                    </p>

                    {/* Meta */}
                    <div
                      className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
                      style={{ color: "#A0926B" }}
                    >
                      <span>Property: {req.propertyId.slice(0, 8)}...</span>
                      <span>Submitted: {formatDate(req.createdAt)}</span>
                      {req.assignedVendor && (
                        <span>Vendor: {req.assignedVendor}</span>
                      )}
                    </div>
                  </div>

                  {/* Status update action */}
                  {nextStatus && (
                    <button
                      onClick={() => handleStatusUpdate(req.id, nextStatus)}
                      disabled={updatingId === req.id}
                      className="self-start shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
                      style={{ backgroundColor: "#8B7355" }}
                      aria-label={`Move to ${STATUS_CONFIG[nextStatus].label}`}
                    >
                      {updatingId === req.id && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      Move to {STATUS_CONFIG[nextStatus].label}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border hover:opacity-80 transition-opacity disabled:opacity-30"
            style={{ borderColor: "#C4A882", color: "#8B7355" }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span
            className="text-sm px-3"
            style={{ fontFamily: "Inter, sans-serif", color: "#2D2A26" }}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border hover:opacity-80 transition-opacity disabled:opacity-30"
            style={{ borderColor: "#C4A882", color: "#8B7355" }}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
};
