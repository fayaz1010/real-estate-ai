/* eslint-disable import/order */
import { screen, fireEvent, within } from "@testing-library/react";
import React from "react";

import { render } from "../test-utils";
import type { Lease } from "@/modules/leases/api/leaseService";
/* eslint-enable import/order */

// ─── Mock API client (before any module that imports it) ────────────────────
vi.mock("@/api/client", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

// ─── Mock lease slice actions ───────────────────────────────────────────────

const mockFetchLeases = vi.fn();
const mockCreateLease = vi.fn();
const mockUpdateLeaseStatus = vi.fn();
const mockTerminateLease = vi.fn();
const mockClearError = vi.fn();

vi.mock("@/modules/leases/store/leaseSlice", () => ({
  __esModule: true,
  fetchLeases: Object.assign(mockFetchLeases, {
    pending: { type: "leases/fetchLeases/pending" },
    fulfilled: { type: "leases/fetchLeases/fulfilled", match: () => true },
    rejected: { type: "leases/fetchLeases/rejected" },
  }),
  createLease: Object.assign(mockCreateLease, {
    pending: { type: "leases/createLease/pending" },
    fulfilled: {
      type: "leases/createLease/fulfilled",
      match: (a: unknown) =>
        (a as { meta?: { requestStatus?: string } })?.meta?.requestStatus ===
        "fulfilled",
    },
    rejected: { type: "leases/createLease/rejected" },
  }),
  updateLeaseStatus: Object.assign(mockUpdateLeaseStatus, {
    pending: { type: "leases/updateLeaseStatus/pending" },
    fulfilled: {
      type: "leases/updateLeaseStatus/fulfilled",
      match: (a: unknown) =>
        (a as { meta?: { requestStatus?: string } })?.meta?.requestStatus ===
        "fulfilled",
    },
    rejected: { type: "leases/updateLeaseStatus/rejected" },
  }),
  terminateLease: Object.assign(mockTerminateLease, {
    pending: { type: "leases/terminateLease/pending" },
    fulfilled: {
      type: "leases/terminateLease/fulfilled",
      match: (a: unknown) =>
        (a as { meta?: { requestStatus?: string } })?.meta?.requestStatus ===
        "fulfilled",
    },
    rejected: { type: "leases/terminateLease/rejected" },
  }),
  clearError: mockClearError,
  default: (state: Record<string, unknown> = {}) => state,
}));

import { LeaseManagementPage } from "@/pages/LeaseManagementPage";

// ─── Mock lucide-react icons ────────────────────────────────────────────────

vi.mock("lucide-react", () => {
  const actual: Record<string, unknown> = {};
  const icons = [
    "FileText",
    "Plus",
    "Search",
    "Filter",
    "Calendar",
    "CheckCircle",
    "Clock",
    "AlertTriangle",
    "Eye",
    "X",
    "ChevronRight",
    "Users",
    "Building",
    "DollarSign",
    "Loader2",
    "AlertCircle",
    "Trash2",
    "Edit3",
  ];
  icons.forEach((name) => {
    actual[name] = (props: Record<string, unknown>) =>
      React.createElement("svg", { "data-testid": `icon-${name}`, ...props });
  });
  return actual;
});

// ─── Mock Redux actions ─────────────────────────────────────────────────────

const mockDispatch = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
  then: (fn: (value: unknown) => unknown) => Promise.resolve().then(fn),
  type: "",
  payload: undefined,
  meta: { requestStatus: "fulfilled" },
}));

vi.mock("@/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}));

// ─── Test Data ──────────────────────────────────────────────────────────────

const mockLeases: Lease[] = [
  {
    id: "lease-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    landlordId: "landlord-1",
    status: "ACTIVE",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    monthlyRent: 2000,
    depositAmount: 4000,
    depositPaid: true,
    lateFeeAmount: 50,
    lateFeeGraceDays: 5,
    leaseDocumentUrl: null,
    signedByTenant: true,
    signedByLandlord: true,
    signedAt: "2025-01-01",
    terminatedAt: null,
    terminationReason: null,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    property: {
      id: "prop-1",
      title: "Downtown Apartment",
      address: "123 Main St",
    },
    tenant: {
      id: "tenant-1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@test.com",
    },
    landlord: {
      id: "landlord-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
    },
  },
  {
    id: "lease-2",
    propertyId: "prop-2",
    tenantId: "tenant-2",
    landlordId: "landlord-1",
    status: "DRAFT",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    monthlyRent: 1500,
    depositAmount: 3000,
    depositPaid: false,
    lateFeeAmount: 25,
    lateFeeGraceDays: 5,
    leaseDocumentUrl: null,
    signedByTenant: false,
    signedByLandlord: false,
    signedAt: null,
    terminatedAt: null,
    terminationReason: null,
    createdAt: "2025-05-01",
    updatedAt: "2025-05-01",
    property: { id: "prop-2", title: "Suburban House", address: "456 Oak Ave" },
    tenant: {
      id: "tenant-2",
      firstName: "Bob",
      lastName: "Jones",
      email: "bob@test.com",
    },
    landlord: {
      id: "landlord-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
    },
  },
  {
    id: "lease-3",
    propertyId: "prop-3",
    tenantId: "tenant-3",
    landlordId: "landlord-1",
    status: "TERMINATED",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    monthlyRent: 1800,
    depositAmount: 3600,
    depositPaid: true,
    lateFeeAmount: 40,
    lateFeeGraceDays: 5,
    leaseDocumentUrl: null,
    signedByTenant: true,
    signedByLandlord: true,
    signedAt: "2024-01-01",
    terminatedAt: "2024-06-15",
    terminationReason: "Lease violation",
    createdAt: "2024-01-01",
    updatedAt: "2024-06-15",
    property: { id: "prop-3", title: "City Condo", address: "789 Elm St" },
    tenant: {
      id: "tenant-3",
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@test.com",
    },
    landlord: {
      id: "landlord-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
    },
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────

function setupMockSelector(
  overrides: Partial<{
    leases: Lease[];
    loading: {
      list: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    error: string | null;
  }> = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAppSelector } = require("@/store");
  const state = {
    leases: overrides.leases ?? mockLeases,
    loading: overrides.loading ?? {
      list: false,
      create: false,
      update: false,
      delete: false,
    },
    error: overrides.error ?? null,
  };
  useAppSelector.mockImplementation(
    (selector: (s: { leases: typeof state }) => unknown) =>
      selector({ leases: state }),
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("LeaseManagementPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMockSelector();
  });

  // ── Rendering ─────────────────────────────────────────────────────────

  describe("Rendering", () => {
    it("should render without errors", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("Lease Management")).toBeInTheDocument();
    });

    it("should render the page header with title", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("Lease Management")).toBeInTheDocument();
    });

    it("should render the New Lease button", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("New Lease")).toBeInTheDocument();
    });

    it("should render tab navigation", () => {
      render(<LeaseManagementPage />);
      expect(
        screen.getByRole("tablist", { name: /lease status tabs/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: /all leases/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /active/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /pending/i })).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByLabelText("Search leases")).toBeInTheDocument();
    });

    it("should render statistics cards", () => {
      render(<LeaseManagementPage />);
      const statsList = screen.getByRole("list", { name: /lease statistics/i });
      expect(screen.getByText("Total Leases")).toBeInTheDocument();
      expect(within(statsList).getByText("Active")).toBeInTheDocument();
      expect(within(statsList).getByText("Expired")).toBeInTheDocument();
      expect(screen.getByText("Average Rent")).toBeInTheDocument();
    });

    it("should use proper ARIA attributes on tabs", () => {
      render(<LeaseManagementPage />);
      const allTab = screen.getByRole("tab", { name: /all leases/i });
      expect(allTab).toHaveAttribute("aria-selected", "true");
    });
  });

  // ── Data Display ──────────────────────────────────────────────────────

  describe("Data Display", () => {
    it("should display lease property names", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("Downtown Apartment")).toBeInTheDocument();
      expect(screen.getByText("Suburban House")).toBeInTheDocument();
      expect(screen.getByText("City Condo")).toBeInTheDocument();
    });

    it("should display tenant names", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Jones")).toBeInTheDocument();
      expect(screen.getByText("Alice Brown")).toBeInTheDocument();
    });

    it("should display monthly rent amounts", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("$2,000/mo")).toBeInTheDocument();
      expect(screen.getByText("$1,500/mo")).toBeInTheDocument();
    });

    it("should display status badges", () => {
      render(<LeaseManagementPage />);
      const list = screen.getByRole("list", { name: /lease list/i });
      expect(within(list).getByText("Active")).toBeInTheDocument();
      expect(within(list).getByText("Draft")).toBeInTheDocument();
      expect(within(list).getByText("Terminated")).toBeInTheDocument();
    });

    it("should display correct statistics", () => {
      render(<LeaseManagementPage />);
      const statsList = screen.getByRole("list", { name: /lease statistics/i });
      // Total leases = 3
      expect(within(statsList).getByText("3")).toBeInTheDocument();
      // Active = 1
      expect(within(statsList).getByText("1")).toBeInTheDocument();
    });
  });

  // ── Loading State ─────────────────────────────────────────────────────

  describe("Loading State", () => {
    it("should show loading indicator when fetching leases", () => {
      setupMockSelector({
        leases: [],
        loading: { list: true, create: false, update: false, delete: false },
      });
      render(<LeaseManagementPage />);
      expect(screen.getByText("Loading leases...")).toBeInTheDocument();
    });

    it("should show dash values in stats when loading", () => {
      setupMockSelector({
        leases: [],
        loading: { list: true, create: false, update: false, delete: false },
      });
      render(<LeaseManagementPage />);
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  // ── Empty State ───────────────────────────────────────────────────────

  describe("Empty State", () => {
    it("should show empty state when no leases exist", () => {
      setupMockSelector({ leases: [] });
      render(<LeaseManagementPage />);
      expect(
        screen.getByText(
          "No leases yet. Create your first lease to get started.",
        ),
      ).toBeInTheDocument();
    });

    it("should show Create Lease button in empty state", () => {
      setupMockSelector({ leases: [] });
      render(<LeaseManagementPage />);
      expect(screen.getByText("Create Lease")).toBeInTheDocument();
    });
  });

  // ── Error State ───────────────────────────────────────────────────────

  describe("Error State", () => {
    it("should display error banner when error exists", () => {
      setupMockSelector({ error: "Failed to fetch leases" });
      render(<LeaseManagementPage />);
      expect(screen.getByText("Failed to fetch leases")).toBeInTheDocument();
    });

    it("should have a dismiss button for error", () => {
      setupMockSelector({ error: "Some error" });
      render(<LeaseManagementPage />);
      expect(screen.getByLabelText("Dismiss error")).toBeInTheDocument();
    });

    it("should dispatch clearError when dismiss is clicked", () => {
      setupMockSelector({ error: "Some error" });
      render(<LeaseManagementPage />);
      fireEvent.click(screen.getByLabelText("Dismiss error"));
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  // ── Tab Filtering ─────────────────────────────────────────────────────

  describe("Tab Filtering", () => {
    it("should filter leases when Active tab is clicked", () => {
      render(<LeaseManagementPage />);
      const tabs = screen.getAllByRole("tab");
      const activeTab = tabs.find((t) => t.textContent === "Active")!;
      fireEvent.click(activeTab);

      const list = screen.getByRole("list", { name: /lease list/i });
      expect(within(list).getByText("Downtown Apartment")).toBeInTheDocument();
      expect(
        within(list).queryByText("Suburban House"),
      ).not.toBeInTheDocument();
    });

    it("should show all leases on All Leases tab", () => {
      render(<LeaseManagementPage />);
      const list = screen.getByRole("list", { name: /lease list/i });
      expect(within(list).getByText("Downtown Apartment")).toBeInTheDocument();
      expect(within(list).getByText("Suburban House")).toBeInTheDocument();
      expect(within(list).getByText("City Condo")).toBeInTheDocument();
    });

    it("should update aria-selected on tab click", () => {
      render(<LeaseManagementPage />);
      const tabs = screen.getAllByRole("tab");
      const draftTab = tabs.find((t) => t.textContent === "Draft")!;
      fireEvent.click(draftTab);
      expect(draftTab).toHaveAttribute("aria-selected", "true");
    });
  });

  // ── Search ────────────────────────────────────────────────────────────

  describe("Search", () => {
    it("should filter leases by search query", () => {
      render(<LeaseManagementPage />);
      const searchInput = screen.getByLabelText("Search leases");
      fireEvent.change(searchInput, { target: { value: "Downtown" } });

      const list = screen.getByRole("list", { name: /lease list/i });
      expect(within(list).getByText("Downtown Apartment")).toBeInTheDocument();
      expect(
        within(list).queryByText("Suburban House"),
      ).not.toBeInTheDocument();
    });

    it("should filter by tenant name", () => {
      render(<LeaseManagementPage />);
      const searchInput = screen.getByLabelText("Search leases");
      fireEvent.change(searchInput, { target: { value: "Jane" } });

      const list = screen.getByRole("list", { name: /lease list/i });
      expect(within(list).getByText("Downtown Apartment")).toBeInTheDocument();
      expect(within(list).queryByText("City Condo")).not.toBeInTheDocument();
    });

    it("should show no results message when search has no matches", () => {
      render(<LeaseManagementPage />);
      const searchInput = screen.getByLabelText("Search leases");
      fireEvent.change(searchInput, { target: { value: "zzzznonexistent" } });

      expect(
        screen.getByText("No leases found matching your criteria."),
      ).toBeInTheDocument();
    });
  });

  // ── Modal Interactions ────────────────────────────────────────────────

  describe("Modal Interactions", () => {
    it("should open create modal when New Lease is clicked", () => {
      render(<LeaseManagementPage />);
      fireEvent.click(screen.getByText("New Lease"));
      expect(screen.getByText("Create New Lease")).toBeInTheDocument();
    });

    it("should render form fields in create modal", () => {
      render(<LeaseManagementPage />);
      fireEvent.click(screen.getByText("New Lease"));
      expect(screen.getByText("Property ID")).toBeInTheDocument();
      expect(screen.getByText("Tenant ID")).toBeInTheDocument();
      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("End Date")).toBeInTheDocument();
      expect(screen.getByText("Monthly Rent ($)")).toBeInTheDocument();
      expect(screen.getByText("Deposit ($)")).toBeInTheDocument();
    });

    it("should close create modal when Close is clicked", () => {
      render(<LeaseManagementPage />);
      fireEvent.click(screen.getByText("New Lease"));
      expect(screen.getByText("Create New Lease")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Close modal"));
      expect(screen.queryByText("Create New Lease")).not.toBeInTheDocument();
    });

    it("should show terminate button for non-terminated leases", () => {
      render(<LeaseManagementPage />);
      // lease-1 (Active) and lease-2 (Draft) should have terminate buttons
      const terminateButtons = screen.getAllByTitle("Terminate");
      expect(terminateButtons.length).toBe(2);
    });

    it("should show Renew button for terminated leases", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByText("Renew")).toBeInTheDocument();
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    it("should have proper ARIA labels on action buttons", () => {
      render(<LeaseManagementPage />);
      expect(screen.getByLabelText(/View lease lease-1/)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Edit status for lease lease-1/),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Terminate lease lease-1/),
      ).toBeInTheDocument();
    });

    it("should have proper roles on list elements", () => {
      render(<LeaseManagementPage />);
      expect(
        screen.getByRole("list", { name: /lease list/i }),
      ).toBeInTheDocument();
      const items = screen.getAllByRole("listitem");
      expect(items.length).toBeGreaterThan(0);
    });

    it("should use semantic heading for page title", () => {
      render(<LeaseManagementPage />);
      const heading = screen.getByText("Lease Management");
      expect(heading.tagName).toBe("H1");
    });
  });

  // ── Data Fetching ─────────────────────────────────────────────────────

  describe("Data Fetching", () => {
    it("should dispatch fetchLeases on mount", () => {
      render(<LeaseManagementPage />);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
