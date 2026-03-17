// FILE PATH: src/pages/LeaseManagementPage.tsx
// Lease Management Page - Create, view, and manage leases via backend API

import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  X,
  ChevronRight,
  Users,
  Building,
  DollarSign,
  Loader2,
  AlertCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";

import type { Lease } from "@/modules/leases/api/leaseService";
import {
  fetchLeases,
  createLease,
  updateLeaseStatus,
  terminateLease,
  clearError,
} from "@/modules/leases/store/leaseSlice";
import { useAppDispatch, useAppSelector } from "@/store";

// ─── Types ───────────────────────────────────────────────────────────────────

type BackendStatus = Lease["status"];
type TabKey = "all" | "active" | "pending" | "expired" | "terminated" | "draft";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Leases" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "draft", label: "Draft" },
  { key: "expired", label: "Expired" },
  { key: "terminated", label: "Terminated" },
];

const TAB_TO_STATUS: Record<TabKey, BackendStatus | null> = {
  all: null,
  active: "ACTIVE",
  pending: "PENDING_SIGNATURES",
  draft: "DRAFT",
  expired: "EXPIRED",
  terminated: "TERMINATED",
};

function getStatusBadge(status: BackendStatus): {
  classes: string;
  icon: React.ReactNode;
  label: string;
} {
  switch (status) {
    case "ACTIVE":
      return {
        classes: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Active",
      };
    case "PENDING_SIGNATURES":
      return {
        classes: "bg-yellow-100 text-yellow-700",
        icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Pending",
      };
    case "DRAFT":
      return {
        classes: "bg-blue-100 text-blue-700",
        icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Draft",
      };
    case "EXPIRED":
      return {
        classes: "bg-orange-100 text-orange-700",
        icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Expired",
      };
    case "TERMINATED":
      return {
        classes: "bg-red-100 text-red-700",
        icon: <Calendar className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Terminated",
      };
    case "RENEWED":
      return {
        classes: "bg-purple-100 text-purple-700",
        icon: <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />,
        label: "Renewed",
      };
  }
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTenantName(lease: Lease): string {
  if (lease.tenant) {
    return `${lease.tenant.firstName} ${lease.tenant.lastName}`;
  }
  return lease.tenantId;
}

function getPropertyName(lease: Lease): string {
  return lease.property?.title || lease.propertyId;
}

function getPropertyAddress(lease: Lease): string {
  return lease.property?.address || "";
}

// ─── Create/Edit Modal ──────────────────────────────────────────────────────

interface LeaseFormData {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  depositAmount: string;
  lateFeeAmount: string;
  lateFeeGraceDays: string;
}

const emptyForm: LeaseFormData = {
  propertyId: "",
  tenantId: "",
  startDate: "",
  endDate: "",
  monthlyRent: "",
  depositAmount: "",
  lateFeeAmount: "0",
  lateFeeGraceDays: "5",
};

interface LeaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaseFormData) => void;
  isSubmitting: boolean;
  initialData?: LeaseFormData;
  title: string;
}

const LeaseFormModal: React.FC<LeaseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  title,
}) => {
  const [form, setForm] = useState<LeaseFormData>(initialData || emptyForm);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setForm(initialData || emptyForm);
    setValidationErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: keyof LeaseFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.propertyId.trim()) errors.propertyId = "Property ID is required";
    if (!form.tenantId.trim()) errors.tenantId = "Tenant ID is required";
    if (!form.startDate) errors.startDate = "Start date is required";
    if (!form.endDate) errors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
      errors.endDate = "End date must be after start date";
    }
    const rent = parseFloat(form.monthlyRent);
    if (!form.monthlyRent || isNaN(rent) || rent <= 0) {
      errors.monthlyRent = "Monthly rent must be a positive number";
    }
    const deposit = parseFloat(form.depositAmount);
    if (!form.depositAmount || isNaN(deposit) || deposit < 0) {
      errors.depositAmount = "Deposit must be a non-negative number";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-inter text-[#2D2A26] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C4A882]/50 focus:border-[#C4A882] transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF6F1] rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold font-['DM_Serif_Display'] text-[#2D2A26]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
              Property ID
            </label>
            <input
              type="text"
              value={form.propertyId}
              onChange={(e) => handleChange("propertyId", e.target.value)}
              className={inputClass}
              placeholder="Enter property UUID"
            />
            {validationErrors.propertyId && (
              <p className="mt-1 text-xs text-red-600 font-inter">
                {validationErrors.propertyId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
              Tenant ID
            </label>
            <input
              type="text"
              value={form.tenantId}
              onChange={(e) => handleChange("tenantId", e.target.value)}
              className={inputClass}
              placeholder="Enter tenant UUID"
            />
            {validationErrors.tenantId && (
              <p className="mt-1 text-xs text-red-600 font-inter">
                {validationErrors.tenantId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={inputClass}
              />
              {validationErrors.startDate && (
                <p className="mt-1 text-xs text-red-600 font-inter">
                  {validationErrors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className={inputClass}
              />
              {validationErrors.endDate && (
                <p className="mt-1 text-xs text-red-600 font-inter">
                  {validationErrors.endDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                Monthly Rent ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.monthlyRent}
                onChange={(e) => handleChange("monthlyRent", e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
              {validationErrors.monthlyRent && (
                <p className="mt-1 text-xs text-red-600 font-inter">
                  {validationErrors.monthlyRent}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                Deposit ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.depositAmount}
                onChange={(e) => handleChange("depositAmount", e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
              {validationErrors.depositAmount && (
                <p className="mt-1 text-xs text-red-600 font-inter">
                  {validationErrors.depositAmount}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                Late Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.lateFeeAmount}
                onChange={(e) => handleChange("lateFeeAmount", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
                Grace Days
              </label>
              <input
                type="number"
                min="0"
                value={form.lateFeeGraceDays}
                onChange={(e) =>
                  handleChange("lateFeeGraceDays", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C4A882] hover:bg-[#C4A882]/90 text-[#2D2A26] text-sm font-inter font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              )}
              {isSubmitting ? "Saving..." : "Save Lease"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Terminate Confirmation Modal ────────────────────────────────────────────

interface TerminateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
  leaseName: string;
}

const TerminateModal: React.FC<TerminateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  leaseName,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF6F1] rounded-xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold font-['DM_Serif_Display'] text-[#2D2A26]">
              Terminate Lease
            </h2>
          </div>

          <p className="text-sm font-inter text-gray-600 mb-4">
            Are you sure you want to terminate the lease for{" "}
            <span className="font-semibold text-[#2D2A26]">{leaseName}</span>?
            This action cannot be undone.
          </p>

          <label className="block text-sm font-inter font-medium text-[#2D2A26] mb-1">
            Termination Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-inter text-[#2D2A26] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-colors resize-none"
            rows={3}
            placeholder="Enter reason for termination..."
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting || !reason.trim()}
              onClick={() => onConfirm(reason.trim())}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-inter font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              )}
              {isSubmitting ? "Terminating..." : "Terminate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Status Update Modal ─────────────────────────────────────────────────────

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: BackendStatus) => void;
  isSubmitting: boolean;
  currentStatus: BackendStatus;
}

const STATUS_OPTIONS: { value: BackendStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_SIGNATURES", label: "Pending Signatures" },
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expired" },
  { value: "RENEWED", label: "Renewed" },
];

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  currentStatus,
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<BackendStatus>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF6F1] rounded-xl shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h2 className="text-lg font-bold font-['DM_Serif_Display'] text-[#2D2A26] mb-4">
            Update Status
          </h2>

          <div className="space-y-2">
            {STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedStatus === opt.value
                    ? "border-[#C4A882] bg-[#C4A882]/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="leaseStatus"
                  value={opt.value}
                  checked={selectedStatus === opt.value}
                  onChange={() => setSelectedStatus(opt.value)}
                  className="accent-[#8B7355]"
                />
                <span className="text-sm font-inter text-[#2D2A26]">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting || selectedStatus === currentStatus}
              onClick={() => onConfirm(selectedStatus)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C4A882] hover:bg-[#C4A882]/90 text-[#2D2A26] text-sm font-inter font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              )}
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const LeaseManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leases, loading, error } = useAppSelector((state) => state.leases);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [terminateTarget, setTerminateTarget] = useState<Lease | null>(null);
  const [statusTarget, setStatusTarget] = useState<Lease | null>(null);

  useEffect(() => {
    dispatch(fetchLeases("landlord"));
  }, [dispatch]);

  const handleCreateLease = useCallback(
    async (formData: LeaseFormData) => {
      const result = await dispatch(
        createLease({
          propertyId: formData.propertyId,
          tenantId: formData.tenantId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          monthlyRent: parseFloat(formData.monthlyRent),
          depositAmount: parseFloat(formData.depositAmount),
          lateFeeAmount: parseFloat(formData.lateFeeAmount) || 0,
          lateFeeGraceDays: parseInt(formData.lateFeeGraceDays) || 5,
        }),
      );
      if (createLease.fulfilled.match(result)) {
        setShowCreateModal(false);
      }
    },
    [dispatch],
  );

  const handleTerminate = useCallback(
    async (reason: string) => {
      if (!terminateTarget) return;
      const result = await dispatch(
        terminateLease({ id: terminateTarget.id, reason }),
      );
      if (terminateLease.fulfilled.match(result)) {
        setTerminateTarget(null);
      }
    },
    [dispatch, terminateTarget],
  );

  const handleStatusUpdate = useCallback(
    async (status: BackendStatus) => {
      if (!statusTarget) return;
      const result = await dispatch(
        updateLeaseStatus({ id: statusTarget.id, data: { status } }),
      );
      if (updateLeaseStatus.fulfilled.match(result)) {
        setStatusTarget(null);
      }
    },
    [dispatch, statusTarget],
  );

  const filteredLeases = useMemo(() => {
    const statusFilter = TAB_TO_STATUS[activeTab];
    return leases.filter((lease) => {
      const matchesStatus =
        statusFilter === null || lease.status === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        getPropertyName(lease).toLowerCase().includes(query) ||
        getTenantName(lease).toLowerCase().includes(query) ||
        lease.id.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, searchQuery, leases]);

  const stats = useMemo(() => {
    const active = leases.filter((l) => l.status === "ACTIVE").length;
    const expiring = leases.filter((l) => l.status === "EXPIRED").length;
    const activeLeases = leases.filter(
      (l) => l.status === "ACTIVE" || l.status === "PENDING_SIGNATURES",
    );
    const totalRent = activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0);
    const avgRent = activeLeases.length
      ? Math.round(totalRent / activeLeases.length)
      : 0;
    return { total: leases.length, active, expiring, avgRent };
  }, [leases]);

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Header */}
      <header className="bg-[#8B7355] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#C4A882]" aria-hidden="true" />
              <h1 className="text-xl sm:text-2xl font-['DM_Serif_Display'] font-bold text-white">
                Lease Management
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-[#C4A882] hover:bg-[#C4A882]/90 text-[#2D2A26] font-inter font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Lease</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm font-inter text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="p-1 rounded hover:bg-red-100 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          role="list"
          aria-label="Lease statistics"
        >
          {[
            {
              label: "Total Leases",
              value: stats.total,
              icon: (
                <FileText
                  className="w-5 h-5 text-[#C4A882]"
                  aria-hidden="true"
                />
              ),
              color: "bg-[#8B7355]/10",
            },
            {
              label: "Active",
              value: stats.active,
              icon: (
                <CheckCircle
                  className="w-5 h-5 text-green-500"
                  aria-hidden="true"
                />
              ),
              color: "bg-green-50",
            },
            {
              label: "Expired",
              value: stats.expiring,
              icon: (
                <AlertTriangle
                  className="w-5 h-5 text-orange-500"
                  aria-hidden="true"
                />
              ),
              color: "bg-orange-50",
            },
            {
              label: "Average Rent",
              value: formatCurrency(stats.avgRent),
              icon: (
                <DollarSign
                  className="w-5 h-5 text-[#A0926B]"
                  aria-hidden="true"
                />
              ),
              color: "bg-[#A0926B]/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
              role="listitem"
            >
              <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-['DM_Serif_Display'] font-bold text-[#2D2A26]">
                {loading.list ? "—" : stat.value}
              </p>
              <p className="text-xs sm:text-sm font-inter text-gray-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by property, tenant, or lease ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter text-[#2D2A26] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C4A882]/50 focus:border-[#C4A882] transition-colors"
              aria-label="Search leases"
            />
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Filter leases"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filters
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm p-1 mb-6 overflow-x-auto"
          role="tablist"
          aria-label="Lease status tabs"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-inter font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-[#8B7355] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#8B7355] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading.list ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              className="w-10 h-10 text-[#8B7355] animate-spin mb-4"
              aria-hidden="true"
            />
            <p className="text-sm font-inter text-gray-500">
              Loading leases...
            </p>
          </div>
        ) : filteredLeases.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText
              className="w-12 h-12 text-gray-200 mx-auto mb-3"
              aria-hidden="true"
            />
            <p className="text-sm font-inter text-gray-400">
              {leases.length === 0
                ? "No leases yet. Create your first lease to get started."
                : "No leases found matching your criteria."}
            </p>
            {leases.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C4A882] hover:bg-[#C4A882]/90 text-[#2D2A26] text-sm font-inter font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create Lease
              </button>
            )}
          </div>
        ) : (
          /* Lease Cards */
          <div className="space-y-4" role="list" aria-label="Lease list">
            {filteredLeases.map((lease) => {
              const badge = getStatusBadge(lease.status);
              return (
                <div
                  key={lease.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  role="listitem"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-[#8B7355]/10 shrink-0">
                            <Building
                              className="w-5 h-5 text-[#8B7355]"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-['DM_Serif_Display'] font-bold text-[#2D2A26] truncate">
                              {getPropertyName(lease)}
                            </h3>
                            <p className="text-xs font-inter text-gray-500 truncate">
                              {getPropertyAddress(lease)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs sm:text-sm font-inter text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Users
                              className="w-3.5 h-3.5 text-gray-400"
                              aria-hidden="true"
                            />
                            {getTenantName(lease)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar
                              className="w-3.5 h-3.5 text-gray-400"
                              aria-hidden="true"
                            />
                            {formatDate(lease.startDate)} -{" "}
                            {formatDate(lease.endDate)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-[#2D2A26]">
                            <DollarSign
                              className="w-3.5 h-3.5 text-gray-400"
                              aria-hidden="true"
                            />
                            {formatCurrency(lease.monthlyRent)}/mo
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-inter font-semibold ${badge.classes}`}
                        >
                          {badge.icon}
                          {badge.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg border border-gray-200 hover:bg-[#C4A882]/10 hover:border-[#C4A882]/30 transition-colors"
                            aria-label={`View lease ${lease.id}`}
                            title="View"
                          >
                            <Eye
                              className="w-4 h-4 text-gray-500"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            onClick={() => setStatusTarget(lease)}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-[#C4A882]/10 hover:border-[#C4A882]/30 transition-colors"
                            aria-label={`Edit status for lease ${lease.id}`}
                            title="Update Status"
                          >
                            <Edit3
                              className="w-4 h-4 text-gray-500"
                              aria-hidden="true"
                            />
                          </button>
                          {lease.status !== "TERMINATED" && (
                            <button
                              onClick={() => setTerminateTarget(lease)}
                              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                              aria-label={`Terminate lease ${lease.id}`}
                              title="Terminate"
                            >
                              <Trash2
                                className="w-4 h-4 text-gray-500"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                          {(lease.status === "EXPIRED" ||
                            lease.status === "TERMINATED") && (
                            <button
                              onClick={() =>
                                dispatch(
                                  updateLeaseStatus({
                                    id: lease.id,
                                    data: { status: "RENEWED" },
                                  }),
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#C4A882] hover:bg-[#C4A882]/90 text-[#2D2A26] text-xs font-inter font-semibold transition-colors"
                              aria-label={`Renew lease ${lease.id}`}
                            >
                              Renew
                              <ChevronRight
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <LeaseFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLease}
        isSubmitting={loading.create}
        title="Create New Lease"
      />

      <TerminateModal
        isOpen={!!terminateTarget}
        onClose={() => setTerminateTarget(null)}
        onConfirm={handleTerminate}
        isSubmitting={loading.delete}
        leaseName={terminateTarget ? getPropertyName(terminateTarget) : ""}
      />

      {statusTarget && (
        <StatusUpdateModal
          isOpen={!!statusTarget}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusUpdate}
          isSubmitting={loading.update}
          currentStatus={statusTarget.status}
        />
      )}
    </div>
  );
};
