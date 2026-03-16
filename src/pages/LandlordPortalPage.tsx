import { useState } from "react";
import { Link } from "react-router-dom";
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
  Calendar,
  Settings,
  Home,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock Data
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

const PORTFOLIO_STATS = [
  { label: "Total Properties", value: "12", change: "+2 this quarter", icon: Building, color: "text-[#2a5f73]", bg: "bg-[#b1dcf9]/20" },
  { label: "Occupancy Rate", value: "94%", change: "+3% vs last month", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Monthly Revenue", value: "$38,400", change: "+8% vs last month", icon: DollarSign, color: "text-[#3aa9c3]", bg: "bg-[#b1dcf9]/20" },
  { label: "Pending Maintenance", value: "5", change: "2 urgent", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
];

const PROPERTIES = [
  { id: 1, address: "42 Harbour View Drive", type: "Apartment Complex", units: 8, occupied: 8, rent: 3200, image: "" },
  { id: 2, address: "15 Coastal Boulevard", type: "Single Family", units: 1, occupied: 1, rent: 2800, image: "" },
  { id: 3, address: "88 Sunset Terrace", type: "Duplex", units: 2, occupied: 1, rent: 1900, image: "" },
  { id: 4, address: "7 Palm Street", type: "Townhouse", units: 4, occupied: 4, rent: 2400, image: "" },
  { id: 5, address: "120 Marina Way", type: "Apartment Complex", units: 12, occupied: 11, rent: 4500, image: "" },
  { id: 6, address: "33 Reef Crescent", type: "Single Family", units: 1, occupied: 0, rent: 2200, image: "" },
];

const TENANTS = [
  { id: 1, name: "Sarah Mitchell", property: "42 Harbour View Drive, Unit 3A", leaseEnd: "2026-09-15", status: "active" as const, paymentStatus: "paid" as const },
  { id: 2, name: "James Cooper", property: "15 Coastal Boulevard", leaseEnd: "2026-12-01", status: "active" as const, paymentStatus: "paid" as const },
  { id: 3, name: "Emily Chen", property: "88 Sunset Terrace, Unit 1", leaseEnd: "2026-06-30", status: "expiring" as const, paymentStatus: "late" as const },
  { id: 4, name: "David Brown", property: "7 Palm Street, Unit 2", leaseEnd: "2027-03-01", status: "active" as const, paymentStatus: "paid" as const },
  { id: 5, name: "Maria Lopez", property: "120 Marina Way, Unit 8B", leaseEnd: "2026-04-15", status: "expiring" as const, paymentStatus: "paid" as const },
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

const AI_INSIGHTS = [
  { id: 1, title: "Lease Renewal Opportunity", description: "Emily Chen's lease expires in 3 months. Market analysis suggests offering a 3% rent increase with early renewal discount to retain the tenant.", action: "View Details", icon: FileText, severity: "info" as const },
  { id: 2, title: "Vacancy Alert", description: "33 Reef Crescent has been vacant for 18 days. Comparable properties rent within 12 days. Consider reducing asking price by 5% or enhancing listing photos.", action: "Optimize Listing", icon: AlertTriangle, severity: "warning" as const },
  { id: 3, title: "Revenue Optimization", description: "Portfolio analysis shows 3 properties are 10-15% below market rate. Adjusting rents at next renewal could add $4,800 annual revenue.", action: "View Analysis", icon: TrendingUp, severity: "success" as const },
  { id: 4, title: "Maintenance Forecast", description: "HVAC system at 120 Marina Way is predicted to need servicing within 21 days based on seasonal patterns and equipment age.", action: "Schedule Service", icon: Calendar, severity: "warning" as const },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const severityStyles: Record<string, string> = {
  info: "border-l-[#3aa9c3] bg-[#b1dcf9]/10",
  warning: "border-l-amber-500 bg-amber-50",
  success: "border-l-emerald-500 bg-emerald-50",
};

const paymentBadge: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  late: { label: "Late", className: "bg-red-100 text-red-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
};

const leaseBadge: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  expiring: { label: "Expiring Soon", className: "bg-amber-100 text-amber-700" },
  expired: { label: "Expired", className: "bg-red-100 text-red-700" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LandlordPortalPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#2a5f73] text-white" role="navigation" aria-label="Landlord portal navigation">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-montserrat text-xl font-bold tracking-tight">Landlord Portal</h2>
          <p className="text-sm text-white/60 font-open-sans mt-1">Property Management</p>
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-open-sans transition-colors ${
                      isActive ? "bg-white/15 text-white font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            Back to Main Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-montserrat text-2xl font-bold text-gray-900">Portfolio Overview</h1>
              <p className="text-sm text-gray-500 font-open-sans mt-1">Welcome back. Here is your property summary.</p>
            </div>
            <Link
              to="/landlord/properties/new"
              className="btn-primary inline-flex items-center gap-2 bg-[#2a5f73] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a5f73]/90 transition-colors"
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
              {PORTFOLIO_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="card bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-open-sans">{stat.label}</p>
                        <p className="text-2xl font-bold font-montserrat text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                      </div>
                      <div className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Properties Grid */}
          <section aria-label="Properties list">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat text-lg font-semibold text-gray-900">Properties</h2>
              <Link to="/landlord/properties" className="text-sm text-[#3aa9c3] hover:text-[#2a5f73] font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PROPERTIES.map((property) => {
                const occupancyPercent = property.units > 0 ? Math.round((property.occupied / property.units) * 100) : 0;
                return (
                  <div key={property.id} className="card-elevated bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-[#2a5f73]/20 to-[#b1dcf9]/40 flex items-center justify-center">
                      <Building className="w-10 h-10 text-[#2a5f73]/40" aria-hidden="true" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-montserrat font-semibold text-gray-900 text-sm">{property.address}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{property.type}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-semibold text-[#2a5f73]">${property.rent.toLocaleString()}/mo</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${occupancyPercent === 100 ? "bg-emerald-100 text-emerald-700" : occupancyPercent === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                          {property.occupied}/{property.units} occupied
                        </span>
                      </div>
                      <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#3aa9c3] h-1.5 rounded-full" style={{ width: `${occupancyPercent}%` }} role="progressbar" aria-valuenow={occupancyPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${occupancyPercent}% occupied`} />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link to={`/landlord/properties/${property.id}`} className="flex-1 text-center text-xs font-medium text-[#2a5f73] border border-[#2a5f73]/20 rounded-lg py-1.5 hover:bg-[#2a5f73]/5 transition-colors">
                          <Eye className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tenants Section */}
          <section aria-label="Tenant summary">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat text-lg font-semibold text-gray-900">Tenants</h2>
              <Link to="/landlord/tenants" className="text-sm text-[#3aa9c3] hover:text-[#2a5f73] font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="card bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-4 py-3 font-medium text-gray-500 font-open-sans">Tenant</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 font-open-sans hidden sm:table-cell">Property</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 font-open-sans hidden md:table-cell">Lease Ends</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 font-open-sans">Lease</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 font-open-sans">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TENANTS.map((tenant) => (
                      <tr key={tenant.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{tenant.name}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{tenant.property}</td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{tenant.leaseEnd}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${leaseBadge[tenant.status].className}`}>
                            {leaseBadge[tenant.status].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentBadge[tenant.paymentStatus].className}`}>
                            {paymentBadge[tenant.paymentStatus].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Financial Overview */}
          <section aria-label="Financial overview">
            <h2 className="font-montserrat text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Chart Placeholder */}
              <div className="card bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-semibold text-gray-900 text-sm">Monthly Revenue</h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> +8.2%
                  </span>
                </div>
                <div className="h-48 bg-gradient-to-t from-[#b1dcf9]/20 to-transparent rounded-lg flex items-end justify-between gap-1 px-2 pb-2">
                  {[62, 68, 55, 72, 78, 74, 82, 85, 80, 90, 88, 96].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#3aa9c3]/70 rounded-t hover:bg-[#2a5f73] transition-colors" style={{ height: `${h}%` }} role="img" aria-label={`Month ${i + 1} revenue bar`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center font-open-sans">Jan - Dec 2026 (projected)</p>
              </div>

              {/* Expense Breakdown */}
              <div className="card bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-montserrat font-semibold text-gray-900 text-sm mb-4">Expense Breakdown</h3>
                <div className="space-y-3">
                  {EXPENSE_BREAKDOWN.map((expense) => (
                    <div key={expense.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 font-open-sans">{expense.category}</span>
                        <span className="font-medium text-gray-900">${expense.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#2a5f73] h-1.5 rounded-full" style={{ width: `${expense.percentage}%` }} role="progressbar" aria-valuenow={expense.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${expense.category}: ${expense.percentage}%`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI Insights */}
          <section aria-label="AI insights and recommendations">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#3aa9c3]" aria-hidden="true" />
                AI Insights
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_INSIGHTS.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.id} className={`card rounded-xl border-l-4 p-5 ${severityStyles[insight.severity]}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[#2a5f73] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-montserrat font-semibold text-gray-900 text-sm">{insight.title}</h3>
                        <p className="text-sm text-gray-600 font-open-sans mt-1 leading-relaxed">{insight.description}</p>
                        <button className="mt-3 text-sm font-medium text-[#2a5f73] hover:text-[#3aa9c3] transition-colors flex items-center gap-1">
                          {insight.action} <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
