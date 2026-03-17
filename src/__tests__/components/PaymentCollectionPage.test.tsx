import { screen, waitFor } from "@testing-library/react";
import React from "react";

import { render } from "../test-utils";

// ─── Mock lucide-react icons ────────────────────────────────────────────────

jest.mock("lucide-react", () => {
  const actual: Record<string, unknown> = {};
  const icons = [
    "DollarSign", "CreditCard", "Calendar", "CheckCircle", "Clock",
    "AlertTriangle", "Search", "Filter", "Download", "Plus", "TrendingUp",
    "ChevronRight", "Building", "Users", "Loader2", "RefreshCw",
  ];
  icons.forEach((name) => {
    actual[name] = (props: any) =>
      React.createElement("svg", { "data-testid": `icon-${name}`, ...props });
  });
  return actual;
});

// ─── Mock API Client ────────────────────────────────────────────────────────

const mockApiGet = jest.fn();
jest.mock("@/api/client", () => ({
  __esModule: true,
  default: {
    get: (...args: any[]) => mockApiGet(...args),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// ─── Mock Payment Service ───────────────────────────────────────────────────

jest.mock("@/modules/payments/api/paymentService", () => ({
  getPaymentMethods: jest.fn().mockResolvedValue([]),
  createPaymentIntent: jest.fn(),
  confirmPaymentIntent: jest.fn(),
  addPaymentMethod: jest.fn(),
  setDefaultPaymentMethod: jest.fn(),
  removePaymentMethod: jest.fn(),
  getOutstandingBalance: jest.fn(),
  getSubscriptionDetails: jest.fn(),
}));

// ─── Test Data ──────────────────────────────────────────────────────────────

const mockApiPayments = [
  {
    id: "pay-1",
    leaseId: "lease-1",
    payerId: "user-1",
    type: "RENT",
    status: "PAID",
    amount: 2000,
    currency: "USD",
    dueDate: "2025-07-01T00:00:00.000Z",
    paidAt: "2025-06-28T00:00:00.000Z",
    stripePaymentIntentId: "pi_123",
    description: "Rent for July 2025",
    receiptUrl: null,
    createdAt: "2025-06-15T00:00:00.000Z",
    updatedAt: "2025-06-28T00:00:00.000Z",
    lease: {
      property: { title: "Downtown Apartment", address: "123 Main St" },
    },
  },
  {
    id: "pay-2",
    leaseId: "lease-1",
    payerId: "user-1",
    type: "RENT",
    status: "PAYMENT_PENDING",
    amount: 2000,
    currency: "USD",
    dueDate: "2025-08-01T00:00:00.000Z",
    paidAt: null,
    stripePaymentIntentId: null,
    description: "Rent for August 2025",
    receiptUrl: null,
    createdAt: "2025-07-15T00:00:00.000Z",
    updatedAt: "2025-07-15T00:00:00.000Z",
    lease: {
      property: { title: "Downtown Apartment", address: "123 Main St" },
    },
  },
  {
    id: "pay-3",
    leaseId: "lease-2",
    payerId: "user-1",
    type: "RENT",
    status: "OVERDUE",
    amount: 1500,
    currency: "USD",
    dueDate: "2025-06-01T00:00:00.000Z",
    paidAt: null,
    stripePaymentIntentId: null,
    description: "Rent for June 2025",
    receiptUrl: null,
    createdAt: "2025-05-15T00:00:00.000Z",
    updatedAt: "2025-06-15T00:00:00.000Z",
    lease: {
      property: { title: "Suburban House", address: "456 Oak Ave" },
    },
  },
];

// ─── Import component after mocks ───────────────────────────────────────────

import { PaymentCollectionPage } from "@/pages/PaymentCollectionPage";

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("PaymentCollectionPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────

  describe("Rendering", () => {
    it("should show loading state initially", () => {
      mockApiGet.mockReturnValue(new Promise(() => {})); // Never resolves
      render(<PaymentCollectionPage />);
      expect(screen.getByText("Loading payments...")).toBeInTheDocument();
    });

    it("should render without errors after loading", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Payment Collection")).toBeInTheDocument();
      });
    });

    it("should render page header", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Payment Collection")).toBeInTheDocument();
        expect(
          screen.getByText("Manage rent payments, methods, and automation."),
        ).toBeInTheDocument();
      });
    });

    it("should render Record Payment button", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Record new payment")).toBeInTheDocument();
      });
    });
  });

  // ── Data Fetching ─────────────────────────────────────────────────────

  describe("Data Fetching", () => {
    it("should fetch payments from API on mount", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith(
          expect.stringContaining("/payments/my-payments"),
        );
      });
    });

    it("should display fetched payment data", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getAllByText("Downtown Apartment").length).toBeGreaterThan(0);
      });
    });

    it("should display property names from API data", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getAllByText("Downtown Apartment").length).toBeGreaterThan(0);
        expect(screen.getByText("Suburban House")).toBeInTheDocument();
      });
    });
  });

  // ── Status Display ────────────────────────────────────────────────────

  describe("Status Display", () => {
    it("should display Received status for PAID payments", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // "Received" appears as both tab label and status badge
        const received = screen.getAllByText("Received");
        expect(received.length).toBeGreaterThanOrEqual(2); // tab + at least one badge
      });
    });

    it("should display Pending status for PAYMENT_PENDING payments", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // "Pending" appears as tab label, stat label, and status badge
        const pending = screen.getAllByText("Pending");
        expect(pending.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should display Overdue status for OVERDUE payments", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // "Overdue" appears as tab label, stat label, and status badge
        const overdue = screen.getAllByText("Overdue");
        expect(overdue.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should display correct status styling classes", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // Find status badges in table rows (span with rounded-full class)
        const receivedBadges = screen.getAllByText("Received");
        const receivedBadge = receivedBadges.find(
          (el) => el.closest("span")?.classList.contains("rounded-full"),
        )?.closest("span");
        expect(receivedBadge).toHaveClass("bg-green-100", "text-green-700");

        const overdueBadges = screen.getAllByText("Overdue");
        const overdueBadge = overdueBadges.find(
          (el) => el.closest("span")?.classList.contains("rounded-full"),
        )?.closest("span");
        expect(overdueBadge).toHaveClass("bg-red-100", "text-red-700");
      });
    });
  });

  // ── Statistics ────────────────────────────────────────────────────────

  describe("Statistics", () => {
    it("should display Total Collected stat", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Total Collected")).toBeInTheDocument();
        // $2,000 appears in stats and table, use getAllByText
        expect(screen.getAllByText("$2,000").length).toBeGreaterThan(0);
      });
    });

    it("should display Pending stat", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // "Pending" appears as tab label, stat label, and possibly status badge
        const pendingLabels = screen.getAllByText("Pending");
        expect(pendingLabels.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should display Overdue stat", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        // $1,500 appears in stats and table
        expect(screen.getAllByText("$1,500").length).toBeGreaterThan(0);
      });
    });

    it("should display Collection Rate", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Collection Rate")).toBeInTheDocument();
        // 2000 / (2000 + 2000 + 1500) = 36%
        expect(screen.getByText("36%")).toBeInTheDocument();
      });
    });
  });

  // ── Payment Table ─────────────────────────────────────────────────────

  describe("Payment Table", () => {
    it("should render table headers", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByText("Tenant")).toBeInTheDocument();
        expect(screen.getByText("Property")).toBeInTheDocument();
        expect(screen.getByText("Amount")).toBeInTheDocument();
        expect(screen.getByText("Method")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
      });
    });

    it("should display payment amounts", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        const amounts = screen.getAllByText("$2,000");
        expect(amounts.length).toBeGreaterThan(0);
      });
    });

    it("should show empty message when no payments match filter", async () => {
      mockApiGet.mockResolvedValue({ data: { data: [] } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("No payments found.")).toBeInTheDocument();
      });
    });
  });

  // ── Tab Filtering ─────────────────────────────────────────────────────

  describe("Tab Filtering", () => {
    it("should render payment status tabs", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByRole("tablist", { name: /payment status filter/i })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: /all payments/i })).toBeInTheDocument();
      });
    });

    it("should have All Payments tab selected by default", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        const allTab = screen.getByRole("tab", { name: /all payments/i });
        expect(allTab).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  // ── Error Handling ────────────────────────────────────────────────────

  describe("Error Handling", () => {
    it("should display error message on API failure", async () => {
      mockApiGet.mockRejectedValue(new Error("Network error"));
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });

    it("should show retry button on error", async () => {
      mockApiGet.mockRejectedValue(new Error("Network error"));
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Retry")).toBeInTheDocument();
      });
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    it("should have proper ARIA label on search input", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Search payments")).toBeInTheDocument();
      });
    });

    it("should have proper ARIA labels on action buttons", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Record new payment")).toBeInTheDocument();
        expect(screen.getByLabelText("Filter payments")).toBeInTheDocument();
        expect(screen.getByLabelText("Download report")).toBeInTheDocument();
      });
    });

    it("should have proper role on auto-pay toggle", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        const toggle = screen.getByRole("switch");
        expect(toggle).toHaveAttribute("aria-checked", "true");
        expect(toggle).toHaveAttribute("aria-label", "Toggle automated payments");
      });
    });

    it("should have labeled payment methods list", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Saved payment methods")).toBeInTheDocument();
      });
    });
  });

  // ── Automated Payments Section ────────────────────────────────────────

  describe("Automated Payments", () => {
    it("should render automated payments section", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Automated Payments")).toBeInTheDocument();
        expect(screen.getByText("Auto-collect on due date")).toBeInTheDocument();
      });
    });

    it("should display automation feature list", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Reminders sent 3 days before due date"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Late fee applied after 7-day grace period"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Receipts emailed automatically on payment"),
        ).toBeInTheDocument();
      });
    });
  });

  // ── Payment Methods Section ───────────────────────────────────────────

  describe("Payment Methods", () => {
    it("should render payment methods section", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByText("Payment Methods")).toBeInTheDocument();
      });
    });

    it("should show empty state when no payment methods", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(
          screen.getByText("No payment methods saved yet."),
        ).toBeInTheDocument();
      });
    });

    it("should have Add button for payment methods", async () => {
      mockApiGet.mockResolvedValue({ data: { data: mockApiPayments } });
      render(<PaymentCollectionPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Add payment method")).toBeInTheDocument();
      });
    });
  });
});
