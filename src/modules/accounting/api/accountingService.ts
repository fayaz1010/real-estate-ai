import { z } from "zod";

import { tokenManager } from "../../auth/utils/tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

// ==========================================
// Response Schemas (Zod)
// ==========================================

const CategoryAmountSchema = z.object({
  category: z.string(),
  amount: z.number(),
  count: z.number(),
});

export const DashboardSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  netProfit: z.number(),
  occupancyRate: z.number(),
  totalProperties: z.number(),
  activeLeases: z.number(),
  pendingPayments: z.number(),
  overduePayments: z.number(),
});

export const IncomeStatementSchema = z.object({
  income: z.array(CategoryAmountSchema),
  expenses: z.array(CategoryAmountSchema),
  totalIncome: z.number(),
  totalExpenses: z.number(),
  netIncome: z.number(),
});

const BalanceSheetItemSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

export const BalanceSheetSchema = z.object({
  assets: z.array(BalanceSheetItemSchema),
  liabilities: z.array(BalanceSheetItemSchema),
  totalAssets: z.number(),
  totalLiabilities: z.number(),
  equity: z.number(),
});

const CashFlowMonthSchema = z.object({
  month: z.string(),
  income: z.number(),
  expenses: z.number(),
  net: z.number(),
});

export const CashFlowStatementSchema = z.object({
  operating: z.object({
    inflows: z.number(),
    outflows: z.number(),
    net: z.number(),
  }),
  months: z.array(CashFlowMonthSchema),
});

const RentPaymentRowSchema = z.object({
  id: z.string(),
  propertyTitle: z.string(),
  propertyId: z.string(),
  tenantName: z.string(),
  tenantEmail: z.string(),
  amount: z.number(),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().nullable(),
  status: z.string(),
});

export const RentCollectionReportSchema = z.object({
  totalDue: z.number(),
  totalCollected: z.number(),
  totalPending: z.number(),
  totalOverdue: z.number(),
  collectionRate: z.number(),
  payments: z.array(RentPaymentRowSchema),
});

const ExpenseTransactionSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  propertyTitle: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  description: z.string().nullable(),
});

export const ExpenseReportSchema = z.object({
  categories: z.array(CategoryAmountSchema),
  total: z.number(),
  transactions: z.array(ExpenseTransactionSchema),
});

const PropertyOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
});

export const PropertiesListSchema = z.array(PropertyOptionSchema);

// ==========================================
// Inferred Types
// ==========================================

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type IncomeStatement = z.infer<typeof IncomeStatementSchema>;
export type BalanceSheet = z.infer<typeof BalanceSheetSchema>;
export type CashFlowStatement = z.infer<typeof CashFlowStatementSchema>;
export type RentCollectionReport = z.infer<typeof RentCollectionReportSchema>;
export type ExpenseReport = z.infer<typeof ExpenseReportSchema>;
export type PropertyOption = z.infer<typeof PropertyOptionSchema>;

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
}

// ==========================================
// Service
// ==========================================

function buildQuery(filters?: ReportFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.propertyId) params.set("propertyId", filters.propertyId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...tokenManager.getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ||
        "Request failed",
    );
  }

  const json = await response.json();
  const data = (json as { data?: unknown }).data ?? json;
  return schema.parse(data);
}

class AccountingService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return apiGet("/accounting/summary", DashboardSummarySchema);
  }

  async getIncomeStatement(filters?: ReportFilters): Promise<IncomeStatement> {
    return apiGet(
      `/accounting/income-statement${buildQuery(filters)}`,
      IncomeStatementSchema,
    );
  }

  async getBalanceSheet(filters?: ReportFilters): Promise<BalanceSheet> {
    return apiGet(
      `/accounting/balance-sheet${buildQuery(filters)}`,
      BalanceSheetSchema,
    );
  }

  async getCashFlowStatement(
    filters?: ReportFilters,
  ): Promise<CashFlowStatement> {
    return apiGet(
      `/accounting/cash-flow${buildQuery(filters)}`,
      CashFlowStatementSchema,
    );
  }

  async getRentCollectionReport(
    filters?: ReportFilters,
  ): Promise<RentCollectionReport> {
    return apiGet(
      `/accounting/rent-collection${buildQuery(filters)}`,
      RentCollectionReportSchema,
    );
  }

  async getExpenseReport(filters?: ReportFilters): Promise<ExpenseReport> {
    return apiGet(
      `/accounting/expenses${buildQuery(filters)}`,
      ExpenseReportSchema,
    );
  }

  async getProperties(): Promise<PropertyOption[]> {
    return apiGet("/accounting/properties", PropertiesListSchema);
  }
}

export const accountingService = new AccountingService();
