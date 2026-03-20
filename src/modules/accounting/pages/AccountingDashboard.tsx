import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  Clock,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  Filter,
  X,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../store";
import type { RootState } from "../../../store";
import { useAuth } from "../../auth/hooks/useAuth";
import type { ReportFilters } from "../api/accountingService";
import { FinancialReport } from "../components/FinancialReport";
import {
  fetchDashboardSummary,
  fetchAccountingProperties,
  setFilters,
} from "../store/accountingSlice";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  color,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      {trend && trend !== "neutral" && (
        <span
          className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            trend === "up"
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 inline" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 inline" />
          )}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-[#1A1A2E] font-['Manrope']">
      {value}
    </p>
    <p className="text-sm text-gray-500 mt-1 font-['Inter']">{label}</p>
  </div>
);

export const AccountingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ReportFilters>({});

  const { summary, properties, loading, filters, error } = useAppSelector(
    (state: RootState) => state.accounting,
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth/login", { replace: true });
      return;
    }
    if (isAuthenticated) {
      dispatch(fetchDashboardSummary());
      dispatch(fetchAccountingProperties());
    }
  }, [isAuthenticated, authLoading, dispatch, navigate]);

  const applyFilters = useCallback(() => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  }, [localFilters, dispatch]);

  const clearFilters = useCallback(() => {
    setLocalFilters({});
    dispatch(setFilters({}));
    setShowFilters(false);
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 print:static">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors print:hidden"
                aria-label="Back to dashboard"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-[#1A1A2E] font-['Manrope']">
                  Accounting & Financial Reporting
                </h1>
                <p className="text-xs text-gray-500 font-['Inter'] hidden sm:block">
                  Property management financial overview
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors print:hidden ${
                showFilters || Object.values(localFilters).some(Boolean)
                  ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Filter Panel - Progressive Disclosure */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Property
                </label>
                <select
                  value={localFilters.propertyId ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      propertyId: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
                >
                  <option value="">All Properties</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFilters.startDate ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFilters.endDate ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 text-sm font-medium bg-[#1A1A2E] text-white rounded-lg hover:bg-[#1A1A2E]/90 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <section>
          <h2 className="sr-only">Key Financial Metrics</h2>
          {loading.summary ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3" />
                  <div className="h-7 bg-gray-100 rounded w-24 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : summary ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Income"
                value={formatCurrency(summary.totalIncome)}
                icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                trend={summary.totalIncome > 0 ? "up" : "neutral"}
                color="bg-emerald-50"
              />
              <MetricCard
                label="Total Expenses"
                value={formatCurrency(summary.totalExpenses)}
                icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                trend={summary.totalExpenses > 0 ? "down" : "neutral"}
                color="bg-red-50"
              />
              <MetricCard
                label="Net Profit"
                value={formatCurrency(summary.netProfit)}
                icon={<BarChart3 className="w-5 h-5 text-[#FF6B35]" />}
                trend={summary.netProfit >= 0 ? "up" : "down"}
                color="bg-[#FF6B35]/10"
              />
              <MetricCard
                label="Occupancy Rate"
                value={`${summary.occupancyRate}%`}
                icon={<Building2 className="w-5 h-5 text-[#008080]" />}
                trend={summary.occupancyRate >= 50 ? "up" : "down"}
                color="bg-[#008080]/10"
              />
            </div>
          ) : null}
        </section>

        {/* Secondary Metrics */}
        {summary && !loading.summary && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <Building2 className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-[#1A1A2E]">
                {summary.totalProperties}
              </p>
              <p className="text-xs text-gray-500">Properties</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <FileText className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-[#1A1A2E]">
                {summary.activeLeases}
              </p>
              <p className="text-xs text-gray-500">Active Leases</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-amber-600">
                {summary.pendingPayments}
              </p>
              <p className="text-xs text-gray-500">Pending Payments</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-red-600">
                {summary.overduePayments}
              </p>
              <p className="text-xs text-gray-500">Overdue Payments</p>
            </div>
          </section>
        )}

        {/* Financial Reports */}
        <section>
          <h2 className="text-lg font-bold text-[#1A1A2E] font-['Manrope'] mb-4">
            Financial Reports
          </h2>
          <FinancialReport filters={filters} />
        </section>
      </main>
    </div>
  );
};
