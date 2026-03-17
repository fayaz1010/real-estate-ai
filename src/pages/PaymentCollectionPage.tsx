// FILE PATH: src/pages/PaymentCollectionPage.tsx
// Payment Collection Page - View history, automated payments, manage methods

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  TrendingUp,
  ChevronRight,
  Building,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react";
import apiClient from "@/api/client";
import { getPaymentMethods, type PaymentMethod as StripePaymentMethod } from "@/modules/payments/api/paymentService";

// ─── Types ───────────────────────────────────────────────────────────────────

type DisplayStatus = "Received" | "Pending" | "Overdue";
type TabKey = "all" | "received" | "pending" | "overdue";

interface ApiPayment {
  id: string;
  leaseId: string;
  payerId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  stripePaymentIntentId: string | null;
  description: string | null;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
  lease: {
    property: {
      title: string;
      address?: string;
    };
  };
}

interface Payment {
  id: string;
  date: string;
  tenant: string;
  property: string;
  amount: number;
  status: DisplayStatus;
  method: string;
}

interface PaymentMethodDisplay {
  id: string;
  label: string;
  type: string;
  last4: string;
  isDefault: boolean;
}

// ─── API Status Mapping ─────────────────────────────────────────────────────

function mapApiStatus(status: string): DisplayStatus {
  switch (status) {
    case "PAID":
      return "Received";
    case "OVERDUE":
      return "Overdue";
    case "PAYMENT_PENDING":
    case "PARTIAL":
    default:
      return "Pending";
  }
}

function mapPaymentMethod(apiPayment: ApiPayment): string {
  if (apiPayment.stripePaymentIntentId) return "Stripe";
  return "Bank Transfer";
}

function mapApiPayment(p: ApiPayment): Payment {
  return {
    id: p.id,
    date: new Date(p.paidAt || p.dueDate).toISOString().split("T")[0],
    tenant: p.description || p.type,
    property: p.lease?.property?.title || "Unknown Property",
    amount: p.amount,
    status: mapApiStatus(p.status),
    method: mapPaymentMethod(p),
  };
}

function mapStripePaymentMethod(m: StripePaymentMethod): PaymentMethodDisplay {
  if (m.type === "card" && m.card) {
    return {
      id: m.id,
      label: `${m.card.brand.charAt(0).toUpperCase() + m.card.brand.slice(1)} ending in ${m.card.last4}`,
      type: "Credit Card",
      last4: m.card.last4,
      isDefault: m.isDefault,
    };
  }
  if (m.type === "bank_account" && m.bankAccount) {
    return {
      id: m.id,
      label: `${m.bankAccount.bankName} ${m.bankAccount.accountType}`,
      type: "Bank",
      last4: m.bankAccount.last4,
      isDefault: m.isDefault,
    };
  }
  return {
    id: m.id,
    label: m.type,
    type: m.type,
    last4: "N/A",
    isDefault: m.isDefault,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<DisplayStatus, string> = {
  Received: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
};

const StatusIcon: React.FC<{ status: DisplayStatus }> = ({ status }) => {
  if (status === "Received") return <CheckCircle className="w-4 h-4" />;
  if (status === "Pending") return <Clock className="w-4 h-4" />;
  return <AlertTriangle className="w-4 h-4" />;
};

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Payments" },
  { key: "received", label: "Received" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Overdue" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const PaymentCollectionPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ data: ApiPayment[] }>("/payments/my-payments");
      setPayments((data.data || []).map(mapApiPayment));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods.map(mapStripePaymentMethod));
    } catch {
      // Payment methods are non-critical; silently fall back to empty
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
  }, []);

  const filtered = useMemo(() => {
    let list = payments;
    if (activeTab !== "all") {
      const statusMap: Record<TabKey, DisplayStatus | null> = { all: null, received: "Received", pending: "Pending", overdue: "Overdue" };
      list = list.filter((p) => p.status === statusMap[activeTab]);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.tenant.toLowerCase().includes(q) || p.property.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, searchQuery, payments]);

  const totalCollected = payments.filter((p) => p.status === "Received").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === "Overdue").reduce((s, p) => s + p.amount, 0);
  const total = totalCollected + totalPending + totalOverdue;
  const collectionRate = total > 0 ? Math.round((totalCollected / total) * 100) : 0;

  const stats = [
    { label: "Total Collected", value: fmt(totalCollected), icon: DollarSign, color: "text-green-600 bg-green-50" },
    { label: "Pending", value: fmt(totalPending), icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Overdue", value: fmt(totalOverdue), icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "Collection Rate", value: `${collectionRate}%`, icon: TrendingUp, color: "text-realestate-primary bg-realestate-accent/20" },
  ];

  if (loading) {
    return (
      <div className="section-container py-8 flex flex-col items-center justify-center min-h-[400px] gap-4" style={{ backgroundColor: "#FAF6F1" }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
        <p className="text-sm" style={{ color: "#2D2A26", fontFamily: "Inter, sans-serif" }}>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container py-8 flex flex-col items-center justify-center min-h-[400px] gap-4" style={{ backgroundColor: "#FAF6F1" }}>
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-600" style={{ fontFamily: "Inter, sans-serif" }}>{error}</p>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#8B7355" }}
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="section-container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-sm text-realestate-secondary hover:underline flex items-center gap-1 mb-2">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
          </Link>
          <h1 className="text-display text-realestate-primary">Payment Collection</h1>
          <p className="text-gray-500 mt-1">Manage rent payments, methods, and automation.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start" aria-label="Record new payment">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-heading text-xl font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="card-elevated p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 px-5 pt-4 gap-3">
          <nav className="flex gap-1" role="tablist" aria-label="Payment status filter">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.key ? "bg-realestate-primary text-white" : "text-gray-500 hover:text-realestate-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 pb-3 sm:pb-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenant or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-realestate-secondary"
                aria-label="Search payments"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" aria-label="Filter payments">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" aria-label="Download report">
              <Download className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Payment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">No payments found.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {p.tenant}</td>
                    <td className="px-5 py-3"><span className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /> {p.property}</span></td>
                    <td className="px-5 py-3 text-right font-medium">{fmt(p.amount)}</td>
                    <td className="px-5 py-3 text-gray-500">{p.method}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                        <StatusIcon status={p.status} /> {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Payment Methods + Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="card-elevated p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-lg font-semibold text-realestate-primary">Payment Methods</h2>
            <button className="btn-accent text-xs flex items-center gap-1" aria-label="Add payment method">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <ul className="space-y-3" aria-label="Saved payment methods">
            {paymentMethods.length === 0 ? (
              <li className="text-sm text-gray-400 text-center py-4">No payment methods saved yet.</li>
            ) : (
              paymentMethods.map((m) => (
                <li key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-realestate-secondary/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-realestate-secondary" />
                    <div>
                      <p className="font-medium text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.type}{m.last4 !== "N/A" ? ` ending ${m.last4}` : ""}</p>
                    </div>
                  </div>
                  {m.isDefault && (
                    <span className="text-xs bg-realestate-accent/30 text-realestate-primary px-2 py-0.5 rounded-full font-medium">Default</span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Automated Payment Settings */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-heading text-lg font-semibold text-realestate-primary">Automated Payments</h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-realestate-secondary" />
              <div>
                <p className="font-medium text-sm">Auto-collect on due date</p>
                <p className="text-xs text-gray-400">Automatically charge tenants on their rent due date.</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={autoPayEnabled}
              onClick={() => setAutoPayEnabled((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoPayEnabled ? "bg-realestate-primary" : "bg-gray-300"}`}
              aria-label="Toggle automated payments"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoPayEnabled ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Reminders sent 3 days before due date</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Late fee applied after 7-day grace period</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Receipts emailed automatically on payment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentCollectionPage;
