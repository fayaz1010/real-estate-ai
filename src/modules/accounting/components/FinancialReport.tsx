import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../store";
import type { RootState } from "../../../store";
import type { ReportFilters } from "../api/accountingService";
import {
  fetchIncomeStatement,
  fetchBalanceSheet,
  fetchCashFlow,
  fetchRentCollection,
  fetchExpenseReport,
} from "../store/accountingSlice";

type ReportTab =
  | "income"
  | "balance"
  | "cashflow"
  | "rent"
  | "expenses";

interface FinancialReportProps {
  filters: ReportFilters;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const TABS: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
  { key: "income", label: "Income Statement", icon: <TrendingUp className="w-4 h-4" /> },
  { key: "balance", label: "Balance Sheet", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "cashflow", label: "Cash Flow", icon: <DollarSign className="w-4 h-4" /> },
  { key: "rent", label: "Rent Collection", icon: <FileText className="w-4 h-4" /> },
  { key: "expenses", label: "Expenses", icon: <PieChart className="w-4 h-4" /> },
];

function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-8 bg-gray-100 rounded animate-pulse mb-2" />
      ))}
    </>
  );
}

function exportCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ filters }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ReportTab>("income");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    income: true,
    expenses: true,
  });

  const {
    incomeStatement,
    balanceSheet,
    cashFlow,
    rentCollection,
    expenseReport,
    loading,
  } = useAppSelector((state: RootState) => state.accounting);

  useEffect(() => {
    const f = filters;
    if (activeTab === "income") dispatch(fetchIncomeStatement(f));
    else if (activeTab === "balance") dispatch(fetchBalanceSheet(f));
    else if (activeTab === "cashflow") dispatch(fetchCashFlow(f));
    else if (activeTab === "rent") dispatch(fetchRentCollection(f));
    else if (activeTab === "expenses") dispatch(fetchExpenseReport(f));
  }, [activeTab, filters, dispatch]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportCSV = useCallback(() => {
    if (activeTab === "income" && incomeStatement) {
      const headers = ["Type", "Category", "Amount", "Count"];
      const rows = [
        ...incomeStatement.income.map((i) => ["Income", i.category, String(i.amount), String(i.count)]),
        ...incomeStatement.expenses.map((e) => ["Expense", e.category, String(e.amount), String(e.count)]),
      ];
      exportCSV(headers, rows, "income-statement.csv");
    } else if (activeTab === "rent" && rentCollection) {
      const headers = ["Property", "Tenant", "Amount", "Due Date", "Status"];
      const rows = rentCollection.payments.map((p) => [
        p.propertyTitle,
        p.tenantName,
        String(p.amount),
        formatDate(p.dueDate),
        p.status,
      ]);
      exportCSV(headers, rows, "rent-collection.csv");
    } else if (activeTab === "expenses" && expenseReport) {
      const headers = ["Property", "Category", "Amount", "Date", "Description"];
      const rows = expenseReport.transactions.map((t) => [
        t.propertyTitle,
        t.category,
        String(t.amount),
        formatDate(t.date),
        t.description ?? "",
      ]);
      exportCSV(headers, rows, "expense-report.csv");
    }
  }, [activeTab, incomeStatement, rentCollection, expenseReport]);

  const isLoading = useMemo(() => {
    if (activeTab === "income") return loading.incomeStatement;
    if (activeTab === "balance") return loading.balanceSheet;
    if (activeTab === "cashflow") return loading.cashFlow;
    if (activeTab === "rent") return loading.rentCollection;
    return loading.expenseReport;
  }, [activeTab, loading]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#091a2b] text-white shadow-md"
                : "bg-white text-[#091a2b] hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#005163] border border-[#005163] rounded-lg hover:bg-[#005163]/5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#005163] border border-[#005163] rounded-lg hover:bg-[#005163]/5 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <SkeletonRows count={5} />
          </div>
        ) : (
          <>
            {/* Income Statement */}
            {activeTab === "income" && incomeStatement && (
              <div className="divide-y divide-gray-100">
                {/* Income Section */}
                <div>
                  <button
                    onClick={() => toggleSection("income")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-[#091a2b] font-['Montserrat']">Revenue</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(incomeStatement.totalIncome)}
                      </span>
                      {expandedSections.income ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedSections.income && (
                    <div className="px-4 pb-4">
                      {incomeStatement.income.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-100">
                              <th className="pb-2 font-medium">Category</th>
                              <th className="pb-2 font-medium text-right">Amount</th>
                              <th className="pb-2 font-medium text-right">Transactions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incomeStatement.income.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-50 last:border-0">
                                <td className="py-2.5 text-[#091a2b]">{item.category}</td>
                                <td className="py-2.5 text-right text-emerald-600 font-medium">
                                  {formatCurrency(item.amount)}
                                </td>
                                <td className="py-2.5 text-right text-gray-500">{item.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-400 text-sm py-2">No income recorded for this period.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Expenses Section */}
                <div>
                  <button
                    onClick={() => toggleSection("expenses")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-[#091a2b] font-['Montserrat']">Expenses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-red-600">
                        {formatCurrency(incomeStatement.totalExpenses)}
                      </span>
                      {expandedSections.expenses ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedSections.expenses && (
                    <div className="px-4 pb-4">
                      {incomeStatement.expenses.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-100">
                              <th className="pb-2 font-medium">Category</th>
                              <th className="pb-2 font-medium text-right">Amount</th>
                              <th className="pb-2 font-medium text-right">Transactions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incomeStatement.expenses.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-50 last:border-0">
                                <td className="py-2.5 text-[#091a2b]">{item.category}</td>
                                <td className="py-2.5 text-right text-red-600 font-medium">
                                  {formatCurrency(item.amount)}
                                </td>
                                <td className="py-2.5 text-right text-gray-500">{item.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-400 text-sm py-2">No expenses recorded for this period.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Net Income */}
                <div className="p-4 bg-[#f1f3f4]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#091a2b] font-['Montserrat']">Net Income</span>
                    <span
                      className={`font-bold text-lg ${
                        incomeStatement.netIncome >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(incomeStatement.netIncome)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Sheet */}
            {activeTab === "balance" && balanceSheet && (
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <h3 className="font-semibold text-[#091a2b] font-['Montserrat'] mb-3">Assets</h3>
                  {balanceSheet.assets.length > 0 ? (
                    <table className="w-full text-sm mb-2">
                      <tbody>
                        {balanceSheet.assets.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 text-[#091a2b]">{item.name}</td>
                            <td className="py-2.5 text-right font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 text-sm">No assets found.</p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-sm">
                    <span>Total Assets</span>
                    <span>{formatCurrency(balanceSheet.totalAssets)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#091a2b] font-['Montserrat'] mb-3">Liabilities</h3>
                  {balanceSheet.liabilities.length > 0 ? (
                    <table className="w-full text-sm mb-2">
                      <tbody>
                        {balanceSheet.liabilities.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 text-[#091a2b]">{item.name}</td>
                            <td className="py-2.5 text-right font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 text-sm">No liabilities found.</p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-sm">
                    <span>Total Liabilities</span>
                    <span>{formatCurrency(balanceSheet.totalLiabilities)}</span>
                  </div>
                </div>
                <div className="p-4 bg-[#f1f3f4]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#091a2b] font-['Montserrat']">Owner&apos;s Equity</span>
                    <span
                      className={`font-bold text-lg ${
                        balanceSheet.equity >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(balanceSheet.equity)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Flow Statement */}
            {activeTab === "cashflow" && cashFlow && (
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <h3 className="font-semibold text-[#091a2b] font-['Montserrat'] mb-3">
                    Operating Activities
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Inflows</p>
                      <p className="font-semibold text-emerald-600">
                        {formatCurrency(cashFlow.operating.inflows)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Outflows</p>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(cashFlow.operating.outflows)}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Net</p>
                      <p
                        className={`font-semibold ${
                          cashFlow.operating.net >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(cashFlow.operating.net)}
                      </p>
                    </div>
                  </div>
                </div>

                {cashFlow.months.length > 0 && (
                  <div className="p-4">
                    <h3 className="font-semibold text-[#091a2b] font-['Montserrat'] mb-3">
                      Monthly Breakdown
                    </h3>
                    <div className="space-y-3">
                      {cashFlow.months.map((m) => {
                        const maxVal = Math.max(
                          ...cashFlow.months.map((mo) =>
                            Math.max(mo.income, mo.expenses),
                          ),
                          1,
                        );
                        return (
                          <div key={m.month}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{m.month}</span>
                              <span
                                className={`font-medium ${
                                  m.net >= 0 ? "text-emerald-600" : "text-red-600"
                                }`}
                              >
                                {formatCurrency(m.net)}
                              </span>
                            </div>
                            <div className="flex gap-1 h-2">
                              <div
                                className="bg-emerald-400 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(m.income / maxVal) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-red-400 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(m.expenses / maxVal) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                        Income
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                        Expenses
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rent Collection Report */}
            {activeTab === "rent" && rentCollection && (
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Total Due</p>
                      <p className="font-semibold text-[#091a2b] text-sm">
                        {formatCurrency(rentCollection.totalDue)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Collected</p>
                      <p className="font-semibold text-emerald-600 text-sm">
                        {formatCurrency(rentCollection.totalCollected)}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Pending</p>
                      <p className="font-semibold text-amber-600 text-sm">
                        {formatCurrency(rentCollection.totalPending)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Overdue</p>
                      <p className="font-semibold text-red-600 text-sm">
                        {formatCurrency(rentCollection.totalOverdue)}
                      </p>
                    </div>
                  </div>

                  {/* Collection Rate Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Collection Rate</span>
                      <span className="font-medium text-[#091a2b]">
                        {rentCollection.collectionRate}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${rentCollection.collectionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {rentCollection.payments.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 bg-gray-50">
                          <th className="px-4 py-3 font-medium">Property</th>
                          <th className="px-4 py-3 font-medium">Tenant</th>
                          <th className="px-4 py-3 font-medium text-right">Amount</th>
                          <th className="px-4 py-3 font-medium">Due Date</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rentCollection.payments.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-[#091a2b] font-medium max-w-[200px] truncate">
                              {p.propertyTitle}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{p.tenantName}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.amount)}</td>
                            <td className="px-4 py-3 text-gray-500">{formatDate(p.dueDate)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  p.status === "PAID"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : p.status === "OVERDUE"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {p.status.replace("PAYMENT_", "")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {rentCollection.payments.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No rent payments found for this period.
                  </div>
                )}
              </div>
            )}

            {/* Expense Report */}
            {activeTab === "expenses" && expenseReport && (
              <div className="divide-y divide-gray-100">
                {expenseReport.categories.length > 0 && (
                  <div className="p-4">
                    <h3 className="font-semibold text-[#091a2b] font-['Montserrat'] mb-3">
                      By Category
                    </h3>
                    <div className="space-y-3">
                      {expenseReport.categories.map((cat) => {
                        const pct =
                          expenseReport.total > 0
                            ? (cat.amount / expenseReport.total) * 100
                            : 0;
                        return (
                          <div key={cat.category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{cat.category}</span>
                              <span className="font-medium text-[#091a2b]">
                                {formatCurrency(cat.amount)}{" "}
                                <span className="text-gray-400 text-xs">
                                  ({Math.round(pct)}%)
                                </span>
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#3b4876] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between pt-3 mt-3 border-t border-gray-200 font-semibold text-sm">
                      <span>Total Expenses</span>
                      <span className="text-red-600">
                        {formatCurrency(expenseReport.total)}
                      </span>
                    </div>
                  </div>
                )}

                {expenseReport.transactions.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 bg-gray-50">
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Property</th>
                          <th className="px-4 py-3 font-medium">Category</th>
                          <th className="px-4 py-3 font-medium text-right">Amount</th>
                          <th className="px-4 py-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseReport.transactions.map((tx) => (
                          <tr
                            key={tx.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-500">{formatDate(tx.date)}</td>
                            <td className="px-4 py-3 text-[#091a2b] font-medium max-w-[160px] truncate">
                              {tx.propertyTitle}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{tx.category}</td>
                            <td className="px-4 py-3 text-right font-medium text-red-600">
                              {formatCurrency(tx.amount)}
                            </td>
                            <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                              {tx.description ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {expenseReport.categories.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No expenses found for this period.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
