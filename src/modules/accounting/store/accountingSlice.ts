import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  accountingService,
  DashboardSummary,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  RentCollectionReport,
  ExpenseReport,
  PropertyOption,
  ReportFilters,
} from "../api/accountingService";

interface AccountingState {
  summary: DashboardSummary | null;
  incomeStatement: IncomeStatement | null;
  balanceSheet: BalanceSheet | null;
  cashFlow: CashFlowStatement | null;
  rentCollection: RentCollectionReport | null;
  expenseReport: ExpenseReport | null;
  properties: PropertyOption[];
  filters: ReportFilters;
  loading: {
    summary: boolean;
    incomeStatement: boolean;
    balanceSheet: boolean;
    cashFlow: boolean;
    rentCollection: boolean;
    expenseReport: boolean;
    properties: boolean;
  };
  error: string | null;
}

const initialState: AccountingState = {
  summary: null,
  incomeStatement: null,
  balanceSheet: null,
  cashFlow: null,
  rentCollection: null,
  expenseReport: null,
  properties: [],
  filters: {},
  loading: {
    summary: false,
    incomeStatement: false,
    balanceSheet: false,
    cashFlow: false,
    rentCollection: false,
    expenseReport: false,
    properties: false,
  },
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "accounting/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await accountingService.getDashboardSummary();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch summary",
      );
    }
  },
);

export const fetchIncomeStatement = createAsyncThunk(
  "accounting/fetchIncomeStatement",
  async (filters: ReportFilters | undefined, { rejectWithValue }) => {
    try {
      return await accountingService.getIncomeStatement(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch income statement",
      );
    }
  },
);

export const fetchBalanceSheet = createAsyncThunk(
  "accounting/fetchBalanceSheet",
  async (filters: ReportFilters | undefined, { rejectWithValue }) => {
    try {
      return await accountingService.getBalanceSheet(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch balance sheet",
      );
    }
  },
);

export const fetchCashFlow = createAsyncThunk(
  "accounting/fetchCashFlow",
  async (filters: ReportFilters | undefined, { rejectWithValue }) => {
    try {
      return await accountingService.getCashFlowStatement(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch cash flow",
      );
    }
  },
);

export const fetchRentCollection = createAsyncThunk(
  "accounting/fetchRentCollection",
  async (filters: ReportFilters | undefined, { rejectWithValue }) => {
    try {
      return await accountingService.getRentCollectionReport(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch rent collection",
      );
    }
  },
);

export const fetchExpenseReport = createAsyncThunk(
  "accounting/fetchExpenseReport",
  async (filters: ReportFilters | undefined, { rejectWithValue }) => {
    try {
      return await accountingService.getExpenseReport(filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch expense report",
      );
    }
  },
);

export const fetchAccountingProperties = createAsyncThunk(
  "accounting/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      return await accountingService.getProperties();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch properties",
      );
    }
  },
);

const accountingSlice = createSlice({
  name: "accounting",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.payload as string;
      })

      .addCase(fetchIncomeStatement.pending, (state) => {
        state.loading.incomeStatement = true;
      })
      .addCase(fetchIncomeStatement.fulfilled, (state, action) => {
        state.loading.incomeStatement = false;
        state.incomeStatement = action.payload;
      })
      .addCase(fetchIncomeStatement.rejected, (state, action) => {
        state.loading.incomeStatement = false;
        state.error = action.payload as string;
      })

      .addCase(fetchBalanceSheet.pending, (state) => {
        state.loading.balanceSheet = true;
      })
      .addCase(fetchBalanceSheet.fulfilled, (state, action) => {
        state.loading.balanceSheet = false;
        state.balanceSheet = action.payload;
      })
      .addCase(fetchBalanceSheet.rejected, (state, action) => {
        state.loading.balanceSheet = false;
        state.error = action.payload as string;
      })

      .addCase(fetchCashFlow.pending, (state) => {
        state.loading.cashFlow = true;
      })
      .addCase(fetchCashFlow.fulfilled, (state, action) => {
        state.loading.cashFlow = false;
        state.cashFlow = action.payload;
      })
      .addCase(fetchCashFlow.rejected, (state, action) => {
        state.loading.cashFlow = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRentCollection.pending, (state) => {
        state.loading.rentCollection = true;
      })
      .addCase(fetchRentCollection.fulfilled, (state, action) => {
        state.loading.rentCollection = false;
        state.rentCollection = action.payload;
      })
      .addCase(fetchRentCollection.rejected, (state, action) => {
        state.loading.rentCollection = false;
        state.error = action.payload as string;
      })

      .addCase(fetchExpenseReport.pending, (state) => {
        state.loading.expenseReport = true;
      })
      .addCase(fetchExpenseReport.fulfilled, (state, action) => {
        state.loading.expenseReport = false;
        state.expenseReport = action.payload;
      })
      .addCase(fetchExpenseReport.rejected, (state, action) => {
        state.loading.expenseReport = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAccountingProperties.pending, (state) => {
        state.loading.properties = true;
      })
      .addCase(fetchAccountingProperties.fulfilled, (state, action) => {
        state.loading.properties = false;
        state.properties = action.payload;
      })
      .addCase(fetchAccountingProperties.rejected, (state, action) => {
        state.loading.properties = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = accountingSlice.actions;
export default accountingSlice.reducer;
