import {
  DollarSign,
  Calendar,
  Download,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import { useState, useEffect } from "react";

import { tenantPortalModuleService } from "../api/tenantPortalService";

import { cn, formatCurrency } from "@/lib/utils";
import type { PaymentHistoryItem, UpcomingPayment } from "@/types/tenantPortal";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    Promise.all([
      tenantPortalModuleService.getPaymentHistory(),
      tenantPortalModuleService.getUpcomingPayments(),
    ])
      .then(([historyData, upcomingData]) => {
        const sorted = [...historyData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setPayments(sorted);
        setUpcoming(upcomingData);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleSort = () => {
    setSortAsc((prev) => !prev);
    setPayments((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortAsc ? -diff : diff;
      });
      return sorted;
    });
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const blob = await tenantPortalModuleService.downloadReceipt(paymentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Receipt download failed silently
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" role="status">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-tenant-primary mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-sm text-gray-500 font-open-sans">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20" role="alert">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <AlertTriangle
            className="w-12 h-12 text-amber-500 mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="font-montserrat text-xl font-bold text-tenant-primary mb-2">
            Error
          </h2>
          <p className="text-gray-500 text-sm font-open-sans">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-tenant-primary">
          Payment History
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-open-sans">
          Manage your payments securely
        </p>
      </header>

      {/* Upcoming Payments */}
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-heading">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-5 h-5 text-tenant-primary"
                  aria-hidden="true"
                />
                <h2
                  id="upcoming-heading"
                  className="font-montserrat text-lg font-semibold text-tenant-primary"
                >
                  Upcoming Payments
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm font-open-sans"
                aria-label="Upcoming payments"
              >
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Due Date</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcoming.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-tenant-primary">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.paymentMethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Past Payments */}
      <section aria-labelledby="history-heading">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign
                  className="w-5 h-5 text-tenant-primary"
                  aria-hidden="true"
                />
                <h2
                  id="history-heading"
                  className="font-montserrat text-lg font-semibold text-tenant-primary"
                >
                  Past Payments
                </h2>
              </div>
              <button
                type="button"
                onClick={toggleSort}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-tenant-primary transition-colors font-open-sans"
                aria-label={`Sort by date ${sortAsc ? "newest first" : "oldest first"}`}
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                {sortAsc ? "Oldest first" : "Newest first"}
              </button>
            </div>
          </div>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm font-open-sans"
                aria-label="Payment history"
              >
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium">Payment Method</th>
                    <th className="px-6 py-3 font-medium text-center">
                      Status
                    </th>
                    <th className="px-6 py-3 font-medium text-center">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "inline-block text-xs font-medium px-2.5 py-0.5 rounded-full",
                            statusBadge(item.status),
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.receiptUrl && item.id ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(item.id!)}
                            className="inline-flex items-center gap-1 text-xs text-tenant-secondary hover:text-tenant-primary transition-colors"
                            aria-label={`Download receipt for payment on ${formatDate(item.date)}`}
                          >
                            <Download
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            Download
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8 font-open-sans">
              No payment history yet.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-gray-400 font-open-sans">
          Your AI Property Manager — Never Miss a Beat
        </p>
      </footer>
    </div>
  );
};
