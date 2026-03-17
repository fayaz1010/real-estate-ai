// FILE PATH: src/pages/DashboardPage.tsx
// Dashboard Page - Property Management Dashboard with AI Insights

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Home,
  Building,
  ClipboardList,
  FileText,
  CreditCard,
  Hammer,
  BarChart,
  Settings,
  LogOut,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Star,
  Plus,
  Eye,
  Send,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { TrialBanner } from "../modules/trial/components/TrialBanner";
import type { RootState } from "../store";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const STATS = [
  {
    label: "Total Properties",
    value: 48,
    change: "+12%",
    trend: "up" as const,
    icon: Building,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active Leases",
    value: 36,
    change: "+4%",
    trend: "up" as const,
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Pending Applications",
    value: 14,
    change: "-2%",
    trend: "down" as const,
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Upcoming Inspections",
    value: 7,
    change: "+3",
    trend: "up" as const,
    icon: ClipboardList,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

const AI_INSIGHTS = [
  {
    id: 1,
    type: "maintenance" as const,
    title: "Predictive Maintenance Alert",
    description:
      "HVAC system at 42 Elm Street is predicted to require servicing within 14 days based on usage patterns and seasonal data.",
    action: "Schedule Service",
    icon: Hammer,
    severity: "warning",
  },
  {
    id: 2,
    type: "vacancy" as const,
    title: "Vacancy Risk Detected",
    description:
      "Unit 5B at Harbour View Apartments has a 78% probability of vacancy next month. Consider offering a renewal incentive.",
    action: "Create Offer",
    icon: AlertTriangle,
    severity: "critical",
  },
  {
    id: 3,
    type: "rent" as const,
    title: "Rent Optimization Opportunity",
    description:
      "Market analysis suggests 12 properties in the CBD portfolio are under-priced by an average of 8.5%. Potential additional annual revenue: $42,300.",
    action: "View Analysis",
    icon: DollarSign,
    severity: "info",
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    action: "Property Listed",
    detail: "23 Ocean Drive listed for $650/week",
    time: "12 min ago",
    icon: Building,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    action: "Application Received",
    detail: "Sarah Mitchell applied for Unit 3A, Parkview",
    time: "34 min ago",
    icon: FileText,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    id: 3,
    action: "Inspection Completed",
    detail: "Routine inspection at 8 Bridge Road - all clear",
    time: "1 hr ago",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    action: "Lease Signed",
    detail: "James Cooper signed 12-month lease for Unit 7",
    time: "2 hrs ago",
    icon: FileText,
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    id: 5,
    action: "Maintenance Resolved",
    detail: "Plumbing repair completed at 15 Willow Lane",
    time: "3 hrs ago",
    icon: Hammer,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: 6,
    action: "Payment Received",
    detail: "Rent payment of $2,400 from T. Nguyen",
    time: "4 hrs ago",
    icon: CreditCard,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
  },
  {
    id: 7,
    action: "Application Rejected",
    detail: "Application for 90 King St did not meet criteria",
    time: "5 hrs ago",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Add Property",
    icon: Plus,
    href: "/dashboard/properties/new",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Schedule Inspection",
    icon: Calendar,
    href: "/dashboard/inspections/new",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    label: "Review Applications",
    icon: Eye,
    href: "/dashboard/applications",
    color: "bg-amber-600 hover:bg-amber-700",
  },
  {
    label: "Send Notification",
    icon: Send,
    href: "/dashboard/notifications",
    color: "bg-violet-600 hover:bg-violet-700",
  },
];

const REVENUE_DATA = [
  { month: "Sep", value: 65 },
  { month: "Oct", value: 72 },
  { month: "Nov", value: 68 },
  { month: "Dec", value: 80 },
  { month: "Jan", value: 85 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 92 },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/dashboard", active: true },
  { label: "Properties", icon: Building, href: "/dashboard/properties", active: false },
  { label: "Inspections", icon: ClipboardList, href: "/dashboard/inspections", active: false },
  { label: "Applications", icon: FileText, href: "/dashboard/applications", active: false },
  { label: "Leases", icon: FileText, href: "/dashboard/leases", active: false },
  { label: "Payments", icon: CreditCard, href: "/dashboard/payments", active: false },
  { label: "Maintenance", icon: Hammer, href: "/dashboard/maintenance", active: false },
  { label: "Reports", icon: BarChart, href: "/dashboard/reports", active: false },
  { label: "Settings", icon: Settings, href: "/dashboard/settings", active: false },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    critical: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
  };
  const labels: Record<string, string> = {
    warning: "Warning",
    critical: "Critical",
    info: "Insight",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[severity] ?? styles.info}`}
    >
      {labels[severity] ?? "Info"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// DashboardPage Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { user, userName, logout } = useAuth();
  const trialExpirationDate = useSelector(
    (state: RootState) => state.auth.trialExpirationDate,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = userName ?? user?.firstName ?? "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F9FF] font-inter">
      {/* ----------------------------------------------------------------- */}
      {/* Mobile sidebar overlay */}
      {/* ----------------------------------------------------------------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Sidebar */}
      {/* ----------------------------------------------------------------- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-realestate-primary
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-realestate-accent">
              <Building className="h-5 w-5 text-realestate-primary" />
            </div>
            <span className="font-space-grotesk text-lg font-bold text-white tracking-tight">
              RealEstateAI
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-200
                  ${
                    item.active
                      ? "bg-realestate-accent/15 text-realestate-accent"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    item.active
                      ? "text-realestate-accent"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                {item.label}
                {item.active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-realestate-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-realestate-secondary text-white text-sm font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-white/50 truncate">{user?.email ?? "user@example.com"}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* Main content area */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-realestate-sm">
          {/* Left: hamburger + search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, tenants, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-realestate-accent focus:ring-2 focus:ring-realestate-accent/20 transition-all"
              />
            </div>
          </div>

          {/* Right: notifications + avatar */}
          <div className="flex items-center gap-3 ml-4">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-realestate-primary text-white text-xs font-semibold">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
            </div>
          </div>
        </header>

        {/* Trial Banner */}
        {trialExpirationDate && (
          <TrialBanner trialExpirationDate={trialExpirationDate} />
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="font-space-grotesk text-2xl font-bold text-realestate-primary">
              Welcome back, {user?.firstName ?? "User"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here is what is happening with your properties today.
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Stats Overview */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-5 shadow-realestate-sm hover:shadow-realestate-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-4 font-space-grotesk text-2xl font-bold text-realestate-primary">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* AI Insights Widget */}
          {/* -------------------------------------------------------------- */}
          <div className="rounded-xl bg-gradient-to-br from-realestate-primary to-[#1e2a33] p-6 shadow-realestate-lg">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-realestate-accent/20">
                <Star className="h-5 w-5 text-realestate-accent" />
              </div>
              <h2 className="font-space-grotesk text-lg font-bold text-white">
                AI Recommendations
              </h2>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-realestate-accent/15 px-3 py-1 text-xs font-medium text-realestate-accent">
                <Activity className="h-3 w-3" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AI_INSIGHTS.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={insight.id}
                    className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-5 w-5 text-realestate-accent" />
                      <SeverityBadge severity={insight.severity} />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{insight.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">
                      {insight.description}
                    </p>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-realestate-accent/15 px-3 py-1.5 text-xs font-semibold text-realestate-accent hover:bg-realestate-accent/25 transition-colors">
                      {insight.action}
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Two-column: Activity Feed + Quick Actions & Revenue */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-realestate-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-space-grotesk text-lg font-bold text-realestate-primary">
                  Recent Activity
                </h2>
                <Link
                  to="/dashboard/activity"
                  className="text-xs font-semibold text-realestate-secondary hover:text-realestate-accent transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-1">
                {RECENT_ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${activity.bgColor}`}
                      >
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                      </div>
                      <span className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column: Quick Actions + Revenue */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="rounded-xl bg-white p-6 shadow-realestate-sm">
                <h2 className="font-space-grotesk text-lg font-bold text-realestate-primary mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.label}
                        to={action.href}
                        className={`flex flex-col items-center gap-2 rounded-lg ${action.color} p-4 text-white transition-all hover:scale-[1.03] active:scale-[0.98]`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-semibold text-center leading-tight">
                          {action.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="rounded-xl bg-white p-6 shadow-realestate-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-space-grotesk text-lg font-bold text-realestate-primary">
                    Revenue
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +18.2%
                  </span>
                </div>

                <div className="flex items-end gap-2 h-40">
                  {REVENUE_DATA.map((d) => {
                    const heightPercent = (d.value / maxRevenue) * 100;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full relative rounded-t-md overflow-hidden" style={{ height: `${heightPercent}%` }}>
                          <div
                            className="absolute inset-0 rounded-t-md"
                            style={{
                              background: `linear-gradient(to top, #576E6A, #E5B80B)`,
                              opacity: 0.85,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">{d.month}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs text-gray-500">This Month</p>
                    <p className="font-space-grotesk text-lg font-bold text-realestate-primary">
                      $124,500
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Target</p>
                    <p className="font-space-grotesk text-lg font-bold text-gray-400">$135,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white px-5 py-3 shadow-realestate-sm text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              System healthy
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              142 active tenants
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              AI engine running
            </span>
            <span className="ml-auto">Last updated: just now</span>
          </div>
        </main>
      </div>
    </div>
  );
}
