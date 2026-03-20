import { FileText, Download, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { getInvoices, formatPrice } from "@/services/billingService";
import type { Invoice } from "@/types/billing";

const STATUS_STYLES: Record<Invoice["status"], string> = {
  paid: "bg-realestate-success/10 text-realestate-success",
  unpaid: "bg-yellow-100 text-yellow-700",
  past_due: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<Invoice["status"], string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  past_due: "Past Due",
};

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInvoices()
      .then(setInvoices)
      .catch(() => setError("Failed to load invoices."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4"
        role="alert"
      >
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="font-body text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-body text-sm text-gray-500">
          No invoices yet. They will appear here after your first billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-4 font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Date
            </th>
            <th className="text-left py-3 px-4 font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Plan
            </th>
            <th className="text-right py-3 px-4 font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Amount
            </th>
            <th className="text-center py-3 px-4 font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="text-right py-3 pl-4 font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-3.5 pr-4 font-body text-sm text-gray-700">
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-3.5 px-4 font-body text-sm text-gray-700">
                {invoice.planName}
              </td>
              <td className="py-3.5 px-4 font-body text-sm text-gray-700 text-right">
                {formatPrice(invoice.amount)}
              </td>
              <td className="py-3.5 px-4 text-center">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[invoice.status]}`}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="py-3.5 pl-4 text-right">
                <button
                  className="text-realestate-secondary hover:text-realestate-primary transition-colors"
                  aria-label="Download receipt"
                >
                  <Download className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
