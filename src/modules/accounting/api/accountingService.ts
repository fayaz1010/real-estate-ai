import { z } from "zod";

import apiClient from "@/api/client";

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

function buildParams(
  filters?: ReportFilters,
): Record<string, string> | undefined {
  if (!filters) return undefined;
  const params: Record<string, string> = {};
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.propertyId) params.propertyId = filters.propertyId;
  return Object.keys(params).length > 0 ? params : undefined;
}

async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  filters?: ReportFilters,
): Promise<T> {
  const response = await apiClient.get(path, { params: buildParams(filters) });
  const data = response.data?.data ?? response.data;
  return schema.parse(data);
}

class AccountingService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return apiGet("/accounting/summary", DashboardSummarySchema);
  }

  async getIncomeStatement(filters?: ReportFilters): Promise<IncomeStatement> {
    return apiGet(
      "/accounting/income-statement",
      IncomeStatementSchema,
      filters,
    );
  }

  async getBalanceSheet(filters?: ReportFilters): Promise<BalanceSheet> {
    return apiGet("/accounting/balance-sheet", BalanceSheetSchema, filters);
  }

  async getCashFlowStatement(
    filters?: ReportFilters,
  ): Promise<CashFlowStatement> {
    return apiGet("/accounting/cash-flow", CashFlowStatementSchema, filters);
  }

  async getRentCollectionReport(
    filters?: ReportFilters,
  ): Promise<RentCollectionReport> {
    return apiGet(
      "/accounting/rent-collection",
      RentCollectionReportSchema,
      filters,
    );
  }

  async getExpenseReport(filters?: ReportFilters): Promise<ExpenseReport> {
    return apiGet("/accounting/expenses", ExpenseReportSchema, filters);
  }

  async getProperties(): Promise<PropertyOption[]> {
    return apiGet("/accounting/properties", PropertiesListSchema);
  }
}

export const accountingService = new AccountingService();
