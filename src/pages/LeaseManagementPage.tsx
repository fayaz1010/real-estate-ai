// FILE PATH: src/pages/LeaseManagementPage.tsx
// Lease Management Page - Create, view, sign, and track leases

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
  Download,
  ChevronRight,
  Users,
  Building,
  DollarSign,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeaseStatus = "Active" | "Pending" | "Expiring Soon" | "Expired";
type TabKey = "all" | "active" | "pending" | "expiring" | "expired";

interface Lease {
  id: string;
  property: string;
  address: string;
  tenant: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: LeaseStatus;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_LEASES: Lease[] = [
  { id: "LS-001", property: "Harbourview Penthouse", address: "42 Circular Quay, Sydney", tenant: "James Wilson", startDate: "2025-06-01", endDate: "2026-05-31", monthlyRent: 4200, status: "Active" },
  { id: "LS-002", property: "Riverside Apartment", address: "18 Southbank Blvd, Melbourne", tenant: "Sarah Chen", startDate: "2025-03-15", endDate: "2026-03-14", monthlyRent: 2800, status: "Active" },
  { id: "LS-003", property: "Parkside Terrace", address: "5 Hyde Park Ave, Perth", tenant: "Michael Brooks", startDate: "2025-09-01", endDate: "2026-08-31", monthlyRent: 3100, status: "Pending" },
  { id: "LS-004", property: "Ocean Breeze Villa", address: "77 Marine Parade, Gold Coast", tenant: "Emma Taylor", startDate: "2025-01-01", endDate: "2026-04-10", monthlyRent: 3600, status: "Expiring Soon" },
  { id: "LS-005", property: "Skyline Loft", address: "120 Collins St, Melbourne", tenant: "David Nguyen", startDate: "2024-07-01", endDate: "2025-06-30", monthlyRent: 2500, status: "Expired" },
  { id: "LS-006", property: "Garden Estate", address: "9 Botanical Dr, Brisbane", tenant: "Lisa Martinez", startDate: "2025-04-01", endDate: "2026-03-31", monthlyRent: 3400, status: "Active" },
  { id: "LS-007", property: "Sunset Ridge Home", address: "31 Panorama Cres, Adelaide", tenant: "Tom Anderson", startDate: "2025-10-01", endDate: "2026-09-30", monthlyRent: 2900, status: "Pending" },
  { id: "LS-008", property: "Metro Studio", address: "55 George St, Sydney", tenant: "Rachel Kim", startDate: "2024-12-01", endDate: "2025-11-30", monthlyRent: 1800, status: "Expired" },
  { id: "LS-009", property: "Lakeside Cottage", address: "14 Lakefront Rd, Canberra", tenant: "John Harper", startDate: "2025-02-01", endDate: "2026-04-15", monthlyRent: 2200, status: "Expiring Soon" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Leases" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "expired", label: "Expired" },
];

const TAB_TO_STATUS: Record<TabKey, LeaseStatus | null> = {
  all: null,
  active: "Active",
  pending: "Pending",
  expiring: "Expiring Soon",
  expired: "Expired",
};

function getStatusBadge(status: LeaseStatus): { classes: string; icon: React.ReactNode } {
  switch (status) {
    case "Active":
      return { classes: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> };
    case "Pending":
      return { classes: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" /> };
    case "Expiring Soon":
      return { classes: "bg-orange-100 text-orange-700", icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> };
    case "Expired":
      return { classes: "bg-red-100 text-red-700", icon: <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> };
  }
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export const LeaseManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeases = useMemo(() => {
    const statusFilter = TAB_TO_STATUS[activeTab];
    return MOCK_LEASES.filter((lease) => {
      const matchesStatus = statusFilter === null || lease.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        lease.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const stats = useMemo(() => {
    const active = MOCK_LEASES.filter((l) => l.status === "Active").length;
    const expiring = MOCK_LEASES.filter((l) => l.status === "Expiring Soon").length;
    const totalRent = MOCK_LEASES.filter((l) => l.status === "Active" || l.status === "Expiring Soon")
      .reduce((sum, l) => sum + l.monthlyRent, 0);
    const avgRent = totalRent / (active + expiring || 1);
    return { total: MOCK_LEASES.length, active, expiring, avgRent: Math.round(avgRent) };
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* Header */}
      <header className="bg-realestate-primary shadow-realestate-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
              <h1 className="text-xl sm:text-2xl font-space-grotesk font-bold text-white">
                Lease Management
              </h1>
            </div>
            <Link
              to="/leases/new"
              className="inline-flex items-center gap-2 bg-realestate-accent hover:bg-realestate-accent/90 text-realestate-primary font-inter font-semibold px-4 py-2 rounded-lg transition-colors shadow-realestate-sm text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Lease</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" role="list" aria-label="Lease statistics">
          {[
            { label: "Total Leases", value: stats.total, icon: <FileText className="w-5 h-5 text-realestate-accent" aria-hidden="true" />, color: "bg-realestate-primary/10" },
            { label: "Active", value: stats.active, icon: <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />, color: "bg-green-50" },
            { label: "Expiring in 30 Days", value: stats.expiring, icon: <AlertTriangle className="w-5 h-5 text-orange-500" aria-hidden="true" />, color: "bg-orange-50" },
            { label: "Average Rent", value: formatCurrency(stats.avgRent), icon: <DollarSign className="w-5 h-5 text-realestate-secondary" aria-hidden="true" />, color: "bg-realestate-secondary/10" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4" role="listitem">
              <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-2xl sm:text-3xl font-space-grotesk font-bold text-realestate-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-inter text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by property, tenant, or lease ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-inter text-realestate-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-realestate-accent/50 focus:border-realestate-accent transition-colors"
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
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-realestate-sm p-1 mb-6 overflow-x-auto" role="tablist" aria-label="Lease status tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-inter font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-realestate-primary text-white shadow-sm"
                  : "text-gray-500 hover:text-realestate-primary hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lease Cards */}
        {filteredLeases.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-inter text-gray-400">No leases found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Lease list">
            {filteredLeases.map((lease) => {
              const badge = getStatusBadge(lease.status);
              return (
                <div key={lease.id} className="card hover:shadow-realestate-md transition-shadow" role="listitem">
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-realestate-primary/10 shrink-0">
                            <Building className="w-5 h-5 text-realestate-primary" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-space-grotesk font-bold text-realestate-primary truncate">
                              {lease.property}
                            </h3>
                            <p className="text-xs font-inter text-gray-500 truncate">{lease.address}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs sm:text-sm font-inter text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                            {lease.tenant}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                            {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-realestate-primary">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                            {formatCurrency(lease.monthlyRent)}/mo
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-inter font-semibold ${badge.classes}`}>
                          {badge.icon}
                          {lease.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg border border-gray-200 hover:bg-realestate-accent/10 hover:border-realestate-accent/30 transition-colors"
                            aria-label={`View lease ${lease.id}`}
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-500" aria-hidden="true" />
                          </button>
                          <button
                            className="p-2 rounded-lg border border-gray-200 hover:bg-realestate-accent/10 hover:border-realestate-accent/30 transition-colors"
                            aria-label={`Download lease ${lease.id}`}
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-gray-500" aria-hidden="true" />
                          </button>
                          {(lease.status === "Expiring Soon" || lease.status === "Expired") && (
                            <Link
                              to={`/leases/${lease.id}/renew`}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-realestate-accent hover:bg-realestate-accent/90 text-realestate-primary text-xs font-inter font-semibold transition-colors"
                              aria-label={`Renew lease ${lease.id}`}
                            >
                              Renew
                              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Link>
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
    </div>
  );
};
