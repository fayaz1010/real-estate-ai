// FILE PATH: src/pages/TenantPortalPage.tsx
// Tenant Portal Page - Lease, Payments, Maintenance & Events Dashboard

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CreditCard,
  Wrench,
  Bell,
  Calendar,
  Home,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const TENANT = { firstName: "Alex", lastName: "Johnson", unit: "Unit 4B" };

const LEASE = {
  property: "1420 Ocean Blvd, Santa Monica, CA 90401",
  unit: "Unit 4B",
  rentAmount: 2850,
  leaseStart: "2025-08-01",
  leaseEnd: "2026-07-31",
  nextPaymentDue: "2026-04-01",
  status: "Active" as const,
};

const PAYMENTS: {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Failed";
}[] = [
  { id: "PMT-1041", date: "2026-03-01", amount: 2850, method: "ACH Transfer", status: "Paid" },
  { id: "PMT-1028", date: "2026-02-01", amount: 2850, method: "ACH Transfer", status: "Paid" },
  { id: "PMT-1015", date: "2026-01-01", amount: 2850, method: "Credit Card", status: "Paid" },
  { id: "PMT-1002", date: "2025-12-01", amount: 2850, method: "ACH Transfer", status: "Paid" },
];

const MAINTENANCE: {
  id: string;
  title: string;
  submitted: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
}[] = [
  { id: "MR-312", title: "Leaking kitchen faucet", submitted: "2026-03-10", status: "In Progress", priority: "Medium" },
  { id: "MR-298", title: "Replace HVAC filter", submitted: "2026-02-22", status: "Resolved", priority: "Low" },
  { id: "MR-305", title: "Broken window latch — bedroom", submitted: "2026-03-03", status: "Open", priority: "High" },
];

const EVENTS: { id: string; title: string; date: string; type: string }[] = [
  { id: "EVT-1", title: "Rent Due", date: "2026-04-01", type: "payment" },
  { id: "EVT-2", title: "Annual Inspection", date: "2026-04-15", type: "inspection" },
  { id: "EVT-3", title: "Lease Renewal Window Opens", date: "2026-05-01", type: "lease" },
];

const NAV_ITEMS = [
  { label: "Overview", icon: Home, href: "#overview" },
  { label: "Lease", icon: FileText, href: "#lease" },
  { label: "Payments", icon: CreditCard, href: "#payments" },
  { label: "Maintenance", icon: Wrench, href: "#maintenance" },
  { label: "Events", icon: Calendar, href: "#events" },
  { label: "Notifications", icon: Bell, href: "#notifications" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusColor = (s: string) => {
  switch (s) {
    case "Paid":
    case "Resolved":
    case "Active":
      return "bg-emerald-100 text-emerald-700";
    case "Pending":
    case "In Progress":
      return "bg-amber-100 text-amber-700";
    case "Open":
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case "High":
      return "text-red-600";
    case "Medium":
      return "text-amber-600";
    default:
      return "text-gray-500";
  }
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const fmtCurrency = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TenantPortalPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-open-sans">
      {/* ---- Mobile sidebar toggle ---- */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden bg-realestate-primary text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
      >
        {sidebarOpen ? <ChevronRight className="w-5 h-5 rotate-180" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* ---- Sidebar ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-realestate-primary text-white transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Tenant navigation"
      >
        <div className="p-6">
          <h2 className="font-montserrat text-xl font-bold tracking-tight">Tenant Portal</h2>
          <p className="text-realestate-accent/80 text-sm mt-1">
            {TENANT.firstName} {TENANT.lastName}
          </p>
        </div>
        <nav className="mt-2">
          <ul role="list" className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4 text-realestate-accent" aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-realestate-accent/70 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* ---- Overlay for mobile sidebar ---- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---- Main Content ---- */}
      <main className="md:ml-64 p-4 sm:p-6 lg:p-8" role="main">
        {/* Welcome Header */}
        <header id="overview" className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-realestate-primary">
            Welcome back, {TENANT.firstName}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s an overview of your tenancy at {LEASE.unit}.
          </p>
        </header>

        {/* ---- Lease Summary Card ---- */}
        <section id="lease" aria-labelledby="lease-heading" className="mb-8">
          <h2 id="lease-heading" className="font-montserrat text-lg font-semibold text-realestate-primary mb-3">
            Active Lease
          </h2>
          <div className="card-elevated bg-white rounded-xl p-5 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Property</p>
              <p className="text-sm font-medium text-gray-800 mt-1">{LEASE.property}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Monthly Rent</p>
              <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-realestate-secondary" aria-hidden="true" />
                {fmtCurrency(LEASE.rentAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Lease Period</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {fmtDate(LEASE.leaseStart)} &ndash; {fmtDate(LEASE.leaseEnd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Next Payment Due</p>
              <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />
                {fmtDate(LEASE.nextPaymentDue)}
              </p>
              <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(LEASE.status)}`}>
                {LEASE.status}
              </span>
            </div>
          </div>
        </section>

        {/* ---- Recent Payments ---- */}
        <section id="payments" aria-labelledby="payments-heading" className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 id="payments-heading" className="font-montserrat text-lg font-semibold text-realestate-primary">
              Recent Payments
            </h2>
            <Link
              to="#"
              className="text-sm text-realestate-secondary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="card bg-white rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Payment history">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PAYMENTS.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">{fmtDate(p.date)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-gray-500">{p.id}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{p.method}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-right font-medium">{fmtCurrency(p.amount)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---- Maintenance Requests ---- */}
        <section id="maintenance" aria-labelledby="maintenance-heading" className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 id="maintenance-heading" className="font-montserrat text-lg font-semibold text-realestate-primary">
              Maintenance Requests
            </h2>
            <button type="button" className="btn-primary text-sm bg-realestate-secondary text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              + New Request
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MAINTENANCE.map((m) => {
              const StatusIcon = m.status === "Resolved" ? CheckCircle : m.status === "In Progress" ? Clock : AlertTriangle;
              return (
                <article key={m.id} className="card bg-white rounded-xl p-5 flex flex-col gap-3" aria-label={`Request ${m.id}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-gray-400">{m.id}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(m.status)}`}>
                      <StatusIcon className="w-3 h-3" aria-hidden="true" />
                      {m.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{m.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Submitted {fmtDate(m.submitted)}</span>
                    <span className={`font-medium ${priorityColor(m.priority)}`}>{m.priority}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---- Upcoming Events ---- */}
        <section id="events" aria-labelledby="events-heading" className="mb-8">
          <h2 id="events-heading" className="font-montserrat text-lg font-semibold text-realestate-primary mb-3">
            Upcoming Events &amp; Reminders
          </h2>
          <ul role="list" className="card bg-white rounded-xl divide-y divide-gray-100">
            {EVENTS.map((e) => (
              <li key={e.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-realestate-accent/20 flex items-center justify-center">
                  {e.type === "payment" && <DollarSign className="w-5 h-5 text-realestate-primary" aria-hidden="true" />}
                  {e.type === "inspection" && <Wrench className="w-5 h-5 text-realestate-primary" aria-hidden="true" />}
                  {e.type === "lease" && <FileText className="w-5 h-5 text-realestate-primary" aria-hidden="true" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                  <p className="text-xs text-gray-500">{fmtDate(e.date)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
