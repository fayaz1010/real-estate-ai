import {
  Building,
  Users,
  DollarSign,
  FileText,
  BarChart,
  TrendingUp,
  Plus,
  Eye,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle,
  Settings,
  Home,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import apiClient from "@/api/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Property {
  id: number;
  title: string;
  address: string;
  type: string;
  units: number;
  occupied: number;
  rent: number;
  status: string;
  image?: string;
}

interface Tenant {
  id: number;
  name: string;
  property: string;
  leaseEnd: string;
  status: "active" | "expiring" | "expired";
  paymentStatus: "paid" | "late" | "pending";
}

interface AiInsight {
  id: number;
  title: string;
  description: string;
  action: string;
  severity: "info" | "warning" | "success";
}

interface PortfolioStats {
  totalProperties: number;
  occupancyRate: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/landlord" },
  { label: "Properties", icon: Building, href: "/landlord/properties" },
  { label: "Tenants", icon: Users, href: "/landlord/tenants" },
  { label: "Finances", icon: DollarSign, href: "/landlord/finances" },
  { label: "Leases", icon: FileText, href: "/landlord/leases" },
  { label: "Maintenance", icon: Settings, href: "/landlord/maintenance" },
  { label: "Reports", icon: BarChart, href: "/landlord/reports" },
  { label: "Settings", icon: Settings, href: "/landlord/settings" },
];

const EXPENSE_BREAKDOWN = [
  { category: "Mortgage Payments", amount: 18200, percentage: 47 },
  { category: "Maintenance & Repairs", amount: 4600, percentage: 12 },
  { category: "Insurance", amount: 3100, percentage: 8 },
  { category: "Property Tax", amount: 5400, percentage: 14 },
  { category: "Management Fees", amount: 2900, percentage: 7 },
  { category: "Utilities", amount: 1800, percentage: 5 },
  { category: "Other", amount: 2400, percentage: 7 },
];

const PRICING_TIERS = [
  {
    name: "Professional",
    price: "$79/mo",
    features: [
      "Up to 50 units",
      "Advanced reporting",
      "Tenant screening",
      "Online rent collection",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "$149/mo",
    features: [
      "Up to 200 units",
      "AI-powered insights",
      "Workflow automation",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    features: [
      "Unlimited units",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const severityStyles: Record<string, string> = {
  info: "border-l-[#8B7355] bg-[#FAF6F1]",
  warning: "border-l-amber-500 bg-amber-50",
  success: "border-l-emerald-500 bg-emerald-50",
};

const insightIcons: Record<string, typeof FileText> = {
  info: FileText,
  warning: AlertTriangle,
  success: TrendingUp,
};

const paymentBadge: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  late: { label: "Late", className: "bg-red-100 text-red-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
};

const leaseBadge: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  expiring: {
    label: "Expiring Soon",
    className: "bg-amber-100 text-amber-700",
  },
  expired: { label: "Expired", className: "bg-red-100 text-red-700" },
};

function deriveStats(properties: Property[]): PortfolioStats {
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + (p.units || 1), 0);
  const totalOccupied = properties.reduce(
    (sum, p) => sum + (p.occupied ?? (p.status === "vacant" ? 0 : 1)),
    0,
  );
  const occupancyRate =
    totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;
  const monthlyRevenue = properties.reduce((sum, p) => sum + (p.rent || 0), 0);
  return {
    totalProperties,
    occupancyRate,
    monthlyRevenue,
    pendingMaintenance: 0,
  };
}

function normalizeProperty(raw: Record<string, unknown>): Property {
  return {
    id: (raw.id as number) || 0,
    title:
      (raw.title as string) || (raw.address as string) || "Untitled Property",
    address: (raw.address as string) || (raw.title as string) || "",
    type: (raw.type as string) || (raw.propertyType as string) || "Residential",
    units: (raw.units as number) || 1,
    occupied:
      (raw.occupied as number) ?? ((raw.status as string) === "vacant" ? 0 : 1),
    rent: (raw.rent as number) || (raw.price as number) || 0,
    status: (raw.status as string) || "active",
    image: (raw.image as string) || (raw.images as string[])?.at(0) || "",
  };
}

function normalizeTenant(raw: Record<string, unknown>): Tenant {
  const leaseEnd =
    (raw.leaseEnd as string) || (raw.leaseEndDate as string) || "";
  let status: Tenant["status"] = "active";
  if (leaseEnd) {
    const daysUntilEnd = Math.floor(
      (new Date(leaseEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (daysUntilEnd < 0) status = "expired";
    else if (daysUntilEnd < 90) status = "expiring";
  }
  return {
    id: (raw.id as number) || 0,
    name:
      (raw.name as string) ||
      `${raw.firstName || ""} ${raw.lastName || ""}`.trim() ||
      "Unknown Tenant",
    property:
      (raw.property as string) ||
      (raw.propertyAddress as string) ||
      (raw.unit as string) ||
      "",
    leaseEnd,
    status: (raw.status as Tenant["status"]) || status,
    paymentStatus: (raw.paymentStatus as Tenant["paymentStatus"]) || "pending",
  };
}

function normalizeInsight(
  raw: Record<string, unknown>,
  index: number,
): AiInsight {
  return {
    id: (raw.id as number) || index + 1,
    title: (raw.title as string) || "AI Insight",
    description: (raw.description as string) || (raw.message as string) || "",
    action: (raw.action as string) || "View Details",
    severity: (raw.severity as AiInsight["severity"]) || "info",
  };
}

// ---------------------------------------------------------------------------
// Skeleton Components
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#C4A882]/20 shadow-sm overflow-hidden animate-pulse">
      <div className="h-32 bg-[#C4A882]/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#C4A882]/20 rounded w-3/4" />
        <div className="h-3 bg-[#C4A882]/10 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-4 bg-[#C4A882]/20 rounded w-1/4" />
          <div className="h-4 bg-[#C4A882]/10 rounded w-1/4" />
        </div>
        <div className="h-1.5 bg-[#C4A882]/10 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-b border-[#C4A882]/10 animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-[#C4A882]/20 rounded w-24" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-4 bg-[#C4A882]/10 rounded w-32" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-4 bg-[#C4A882]/10 rounded w-20" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 bg-[#C4A882]/10 rounded-full w-16" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 bg-[#C4A882]/10 rounded-full w-12" />
      </td>
    </tr>
  );
}

function SkeletonInsight() {
  return (
    <div className="rounded-xl border-l-4 border-l-[#C4A882]/30 bg-[#FAF6F1] p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-[#C4A882]/20 rounded mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#C4A882]/20 rounded w-1/3" />
          <div className="h-3 bg-[#C4A882]/10 rounded w-full" />
          <div className="h-3 bg-[#C4A882]/10 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#C4A882]/20 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-[#C4A882]/10 rounded w-24" />
          <div className="h-7 bg-[#C4A882]/20 rounded w-16" />
          <div className="h-3 bg-[#C4A882]/10 rounded w-20" />
        </div>
        <div className="w-10 h-10 bg-[#C4A882]/10 rounded-lg" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error Banner
// ---------------------------------------------------------------------------

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle
          className="w-5 h-5 text-red-500 flex-shrink-0"
          aria-hidden="true"
        />
        <p className="text-sm text-red-700 font-[Inter]">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LandlordPortalPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState<string | null>(null);

  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setPropertiesLoading(true);
    setPropertiesError(null);
    try {
      const response = await apiClient.get("/properties");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setProperties(
        data.map((p: Record<string, unknown>) => normalizeProperty(p)),
      );
    } catch (err) {
      setPropertiesError(
        err instanceof Error ? err.message : "Failed to load properties",
      );
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  const fetchTenants = useCallback(async () => {
    setTenantsLoading(true);
    setTenantsError(null);
    try {
      const response = await apiClient.get("/tenants");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setTenants(data.map((t: Record<string, unknown>) => normalizeTenant(t)));
    } catch (err) {
      setTenantsError(
        err instanceof Error ? err.message : "Failed to load tenants",
      );
    } finally {
      setTenantsLoading(false);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const response = await apiClient.get("/ai/insights");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.insights || [];
      if (Array.isArray(data) && data.length > 0) {
        setInsights(
          data.map((i: Record<string, unknown>, idx: number) =>
            normalizeInsight(i, idx),
          ),
        );
      } else {
        setInsights([
          {
            id: 1,
            title: "AI Insights Coming Soon",
            description:
              "AI-powered insights are currently being configured. Once active, you will receive actionable recommendations for rent optimization, vacancy reduction, and maintenance forecasting.",
            action: "Learn More",
            severity: "info",
          },
        ]);
      }
    } catch {
      setInsights([
        {
          id: 1,
          title: "AI Insights Unavailable",
          description:
            "AI-powered insights are currently unavailable. This feature analyzes your portfolio to provide recommendations on rent pricing, tenant retention, and maintenance planning.",
          action: "Learn More",
          severity: "info",
        },
      ]);
      setInsightsLoading(false);
      return;
    }
    setInsightsLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchTenants();
    fetchInsights();
  }, [fetchProperties, fetchTenants, fetchInsights]);

  const stats = deriveStats(properties);

  const PORTFOLIO_STATS = [
    {
      label: "Total Properties",
      value: String(stats.totalProperties),
      change: `${stats.totalProperties} in portfolio`,
      icon: Building,
      color: "text-[#8B7355]",
      bg: "bg-[#C4A882]/15",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      change: "across all units",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: "total rent roll",
      icon: DollarSign,
      color: "text-[#A0926B]",
      bg: "bg-[#C4A882]/15",
    },
    {
      label: "Pending Maintenance",
      value: String(stats.pendingMaintenance),
      change: "open requests",
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF6F1]">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex w-64 flex-col bg-[#8B7355] text-white"
        role="navigation"
        aria-label="Landlord portal navigation"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="font-['DM_Serif_Display'] text-xl tracking-tight">
            Landlord Portal
          </h2>
          <p className="text-sm text-white/60 font-['Inter'] mt-1">
            Property Management
          </p>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeNav;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setActiveNav(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-['Inter'] transition-colors ${
                      isActive
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            Back to Main Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-[#C4A882]/20 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Serif_Display'] text-2xl text-[#2D2A26]">
                Portfolio Overview
              </h1>
              <p className="text-sm text-[#A0926B] font-['Inter'] mt-1">
                Welcome back. Here is your property summary.
              </p>
            </div>
            <Link
              to="/landlord/properties/new"
              className="inline-flex items-center gap-2 bg-[#8B7355] text-white px-4 py-2.5 rounded-lg text-sm font-medium font-['Inter'] hover:bg-[#8B7355]/90 transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Property
            </Link>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Portfolio Stats */}
          <section aria-label="Portfolio statistics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {propertiesLoading ? (
                <>
                  <SkeletonStat />
                  <SkeletonStat />
                  <SkeletonStat />
                  <SkeletonStat />
                </>
              ) : (
                PORTFOLIO_STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl p-5 border border-[#C4A882]/20 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#A0926B] font-['Inter']">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold font-['DM_Serif_Display'] text-[#2D2A26] mt-1">
                            {stat.value}
                          </p>
                          <p className="text-xs text-[#C4A882] mt-1 font-['Inter']">
                            {stat.change}
                          </p>
                        </div>
                        <div
                          className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Properties Error */}
          {propertiesError && (
            <ErrorBanner message={propertiesError} onRetry={fetchProperties} />
          )}

          {/* Properties Grid */}
          <section aria-label="Properties list">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['DM_Serif_Display'] text-lg text-[#2D2A26]">
                Properties
              </h2>
              <Link
                to="/landlord/properties"
                className="text-sm text-[#8B7355] hover:text-[#A0926B] font-medium font-['Inter'] flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {propertiesLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : properties.length === 0 && !propertiesError ? (
                <div className="col-span-full bg-white rounded-xl border border-[#C4A882]/20 p-8 text-center">
                  <Building
                    className="w-10 h-10 text-[#C4A882] mx-auto"
                    aria-hidden="true"
                  />
                  <p className="text-[#2D2A26] font-['Inter'] font-medium mt-3">
                    No properties yet
                  </p>
                  <p className="text-sm text-[#A0926B] font-['Inter'] mt-1">
                    Add your first property to get started.
                  </p>
                  <Link
                    to="/landlord/properties/new"
                    className="inline-flex items-center gap-2 mt-4 bg-[#8B7355] text-white px-4 py-2 rounded-lg text-sm font-medium font-['Inter'] hover:bg-[#8B7355]/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Add Property
                  </Link>
                </div>
              ) : (
                properties.slice(0, 6).map((property) => {
                  const occupancyPercent =
                    property.units > 0
                      ? Math.round((property.occupied / property.units) * 100)
                      : 0;
                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-xl border border-[#C4A882]/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-32 bg-gradient-to-br from-[#8B7355]/15 to-[#C4A882]/25 flex items-center justify-center">
                        {property.image ? (
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building
                            className="w-10 h-10 text-[#8B7355]/40"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-['DM_Serif_Display'] text-[#2D2A26] text-sm">
                          {property.address || property.title}
                        </h3>
                        <p className="text-xs text-[#A0926B] font-['Inter'] mt-0.5">
                          {property.type}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-semibold text-[#8B7355] font-['Inter']">
                            ${property.rent.toLocaleString()}/mo
                          </span>
                          <span
                            className={`text-xs font-medium font-['Inter'] px-2 py-0.5 rounded-full ${occupancyPercent === 100 ? "bg-emerald-100 text-emerald-700" : occupancyPercent === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {property.occupied}/{property.units} occupied
                          </span>
                        </div>
                        <div className="mt-3 w-full bg-[#C4A882]/15 rounded-full h-1.5">
                          <div
                            className="bg-[#8B7355] h-1.5 rounded-full transition-all"
                            style={{ width: `${occupancyPercent}%` }}
                            role="progressbar"
                            aria-valuenow={occupancyPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${occupancyPercent}% occupied`}
                          />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/landlord/properties/${property.id}`}
                            className="flex-1 text-center text-xs font-medium font-['Inter'] text-[#8B7355] border border-[#8B7355]/20 rounded-lg py-1.5 hover:bg-[#8B7355]/5 transition-colors"
                          >
                            <Eye
                              className="w-3.5 h-3.5 inline mr-1"
                              aria-hidden="true"
                            />
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Tenants Error */}
          {tenantsError && (
            <ErrorBanner message={tenantsError} onRetry={fetchTenants} />
          )}

          {/* Tenants Section */}
          <section aria-label="Tenant summary">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['DM_Serif_Display'] text-lg text-[#2D2A26]">
                Tenants
              </h2>
              <Link
                to="/landlord/tenants"
                className="text-sm text-[#8B7355] hover:text-[#A0926B] font-medium font-['Inter'] flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-[#C4A882]/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-[#C4A882]/15 bg-[#FAF6F1]/50">
                      <th className="text-left px-4 py-3 font-medium text-[#A0926B] font-['Inter']">
                        Tenant
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-[#A0926B] font-['Inter'] hidden sm:table-cell">
                        Property
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-[#A0926B] font-['Inter'] hidden md:table-cell">
                        Lease Ends
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-[#A0926B] font-['Inter']">
                        Lease
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-[#A0926B] font-['Inter']">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantsLoading ? (
                      <>
                        <SkeletonTableRow />
                        <SkeletonTableRow />
                        <SkeletonTableRow />
                        <SkeletonTableRow />
                        <SkeletonTableRow />
                      </>
                    ) : tenants.length === 0 && !tenantsError ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <Users
                            className="w-8 h-8 text-[#C4A882] mx-auto"
                            aria-hidden="true"
                          />
                          <p className="text-[#2D2A26] font-['Inter'] font-medium mt-2">
                            No tenants yet
                          </p>
                          <p className="text-sm text-[#A0926B] font-['Inter'] mt-1">
                            Tenants will appear here once added.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      tenants.map((tenant) => (
                        <tr
                          key={tenant.id}
                          className="border-b border-[#C4A882]/10 hover:bg-[#FAF6F1]/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[#2D2A26] font-['Inter']">
                            {tenant.name}
                          </td>
                          <td className="px-4 py-3 text-[#A0926B] font-['Inter'] hidden sm:table-cell">
                            {tenant.property}
                          </td>
                          <td className="px-4 py-3 text-[#A0926B] font-['Inter'] hidden md:table-cell">
                            {tenant.leaseEnd}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium font-['Inter'] px-2 py-0.5 rounded-full ${leaseBadge[tenant.status]?.className || leaseBadge.active.className}`}
                            >
                              {leaseBadge[tenant.status]?.label ||
                                tenant.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium font-['Inter'] px-2 py-0.5 rounded-full ${paymentBadge[tenant.paymentStatus]?.className || paymentBadge.pending.className}`}
                            >
                              {paymentBadge[tenant.paymentStatus]?.label ||
                                tenant.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Financial Overview */}
          <section aria-label="Financial overview">
            <h2 className="font-['DM_Serif_Display'] text-lg text-[#2D2A26] mb-4">
              Financial Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-xl border border-[#C4A882]/20 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['DM_Serif_Display'] text-[#2D2A26] text-sm">
                    Monthly Revenue
                  </h3>
                  <span className="text-xs text-emerald-600 font-medium font-['Inter'] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    +8.2%
                  </span>
                </div>
                <div className="h-48 bg-gradient-to-t from-[#C4A882]/10 to-transparent rounded-lg flex items-end justify-between gap-1 px-2 pb-2">
                  {[62, 68, 55, 72, 78, 74, 82, 85, 80, 90, 88, 96].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#8B7355]/60 rounded-t hover:bg-[#8B7355] transition-colors"
                        style={{ height: `${h}%` }}
                        role="img"
                        aria-label={`Month ${i + 1} revenue bar`}
                      />
                    ),
                  )}
                </div>
                <p className="text-xs text-[#C4A882] mt-2 text-center font-['Inter']">
                  Jan - Dec 2026 (projected)
                </p>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl border border-[#C4A882]/20 shadow-sm p-5">
                <h3 className="font-['DM_Serif_Display'] text-[#2D2A26] text-sm mb-4">
                  Expense Breakdown
                </h3>
                <div className="space-y-3">
                  {EXPENSE_BREAKDOWN.map((expense) => (
                    <div key={expense.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#A0926B] font-['Inter']">
                          {expense.category}
                        </span>
                        <span className="font-medium text-[#2D2A26] font-['Inter']">
                          ${expense.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-[#C4A882]/15 rounded-full h-1.5">
                        <div
                          className="bg-[#8B7355] h-1.5 rounded-full"
                          style={{ width: `${expense.percentage}%` }}
                          role="progressbar"
                          aria-valuenow={expense.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${expense.category}: ${expense.percentage}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI Insights Error */}
          {insightsError && (
            <ErrorBanner message={insightsError} onRetry={fetchInsights} />
          )}

          {/* AI Insights */}
          <section aria-label="AI insights and recommendations">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['DM_Serif_Display'] text-lg text-[#2D2A26] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C4A882]" aria-hidden="true" />
                AI Insights
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insightsLoading ? (
                <>
                  <SkeletonInsight />
                  <SkeletonInsight />
                  <SkeletonInsight />
                  <SkeletonInsight />
                </>
              ) : (
                insights.map((insight) => {
                  const Icon = insightIcons[insight.severity] || FileText;
                  return (
                    <div
                      key={insight.id}
                      className={`rounded-xl border-l-4 p-5 ${severityStyles[insight.severity] || severityStyles.info}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className="w-5 h-5 text-[#8B7355] mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['DM_Serif_Display'] text-[#2D2A26] text-sm">
                            {insight.title}
                          </h3>
                          <p className="text-sm text-[#A0926B] font-['Inter'] mt-1 leading-relaxed">
                            {insight.description}
                          </p>
                          <button className="mt-3 text-sm font-medium font-['Inter'] text-[#8B7355] hover:text-[#C4A882] transition-colors flex items-center gap-1">
                            {insight.action}{" "}
                            <ChevronRight
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Upgrade CTA */}
          <section aria-label="Pricing plans">
            <div className="bg-gradient-to-br from-[#8B7355] to-[#A0926B] rounded-xl p-6 lg:p-8">
              <h2 className="font-['DM_Serif_Display'] text-xl text-white text-center">
                Unlock More with RealEstate AI
              </h2>
              <p className="text-sm text-white/80 font-['Inter'] text-center mt-2 max-w-lg mx-auto">
                Upgrade your plan to access advanced analytics, AI-powered
                insights, workflow automation, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {PRICING_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`rounded-xl p-5 ${
                      tier.highlighted
                        ? "bg-white text-[#2D2A26] shadow-lg ring-2 ring-[#C4A882]"
                        : "bg-white/10 text-white backdrop-blur-sm"
                    }`}
                  >
                    <h3
                      className={`font-['DM_Serif_Display'] text-lg ${tier.highlighted ? "text-[#8B7355]" : ""}`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`text-2xl font-bold font-['Inter'] mt-1 ${tier.highlighted ? "text-[#2D2A26]" : ""}`}
                    >
                      {tier.price}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className={`text-sm font-['Inter'] flex items-center gap-2 ${tier.highlighted ? "text-[#A0926B]" : "text-white/80"}`}
                        >
                          <CheckCircle
                            className="w-4 h-4 flex-shrink-0"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/pricing"
                      className={`mt-4 block text-center text-sm font-medium font-['Inter'] py-2 rounded-lg transition-colors ${
                        tier.highlighted
                          ? "bg-[#8B7355] text-white hover:bg-[#8B7355]/90"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {tier.highlighted ? "Get Started" : "Learn More"}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
