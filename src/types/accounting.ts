// Accounting Module Types

export type TransactionType = 'income' | 'expense';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Transaction {
  id: string;
  propertyId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: Date;
  vendor?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  propertyId: string;
  items: InvoiceItem[];
  totalAmount: number;
  dueDate: Date;
  status: InvoiceStatus;
  createdAt: Date;
}

export interface ProfitLossData {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  monthlyBreakdown: MonthlyFinancial[];
  aiInsights: AiInsight[];
}

export interface MonthlyFinancial {
  month: string;
  income: number;
  expenses: number;
  netProfit: number;
}

export interface AiInsight {
  id: string;
  type: 'valuation' | 'recommendation' | 'prediction' | 'warning';
  title: string;
  description: string;
  impact?: string;
  confidence: number;
}

export interface Report {
  id: string;
  propertyId: string;
  type: 'profit_loss' | 'cash_flow' | 'balance_sheet';
  title: string;
  generatedAt: Date;
  data: ProfitLossData;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  incomeChange: number;
  expenseChange: number;
  occupancyRate: number;
  avgRentPerUnit: number;
}

export const INCOME_CATEGORIES = [
  'Rent',
  'Late Fees',
  'Pet Fees',
  'Parking',
  'Laundry',
  'Application Fees',
  'Other Income',
] as const;

export const EXPENSE_CATEGORIES = [
  'Mortgage',
  'Insurance',
  'Property Tax',
  'Maintenance',
  'Utilities',
  'Management Fees',
  'Legal Fees',
  'Advertising',
  'Landscaping',
  'Cleaning',
  'Supplies',
  'Other Expense',
] as const;
