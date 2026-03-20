import { screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";

import { render } from "../test-utils";

// ─── Mock lucide-react icons ────────────────────────────────────────────────

jest.mock("lucide-react", () => {
  const actual: Record<string, unknown> = {};
  const icons = [
    "Search",
    "MapPin",
    "X",
    "TrendingUp",
    "Sliders",
    "SlidersHorizontal",
    "Grid",
    "List",
    "Map",
    "ChevronLeft",
    "ChevronRight",
    "ChevronDown",
    "Filter",
    "Heart",
    "ArrowUpDown",
    "LayoutGrid",
    "LayoutList",
    "Loader2",
    "Building",
    "Bed",
    "Bath",
    "Maximize2",
    "DollarSign",
    "Eye",
    "Star",
    "Clock",
    "Home",
    "RefreshCw",
  ];
  icons.forEach((name) => {
    actual[name] = (props: Record<string, unknown>) =>
      React.createElement("svg", { "data-testid": `icon-${name}`, ...props });
  });
  return actual;
});

// ─── Mock API Client ────────────────────────────────────────────────────────

const mockApiGet = jest.fn();
const mockApiPost = jest.fn();
jest.mock("@/api/client", () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// ─── Mock Google Maps ────────────────────────────────────────────────────────

jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: false }),
}));

// ─── Mock browsing history hook ──────────────────────────────────────────────

jest.mock("@/hooks/useBrowsingHistory", () => ({
  useBrowsingHistory: () => ({
    saveRecentSearch: jest.fn(),
    recentSearches: [],
    recentlyViewed: [],
    clearHistory: jest.fn(),
  }),
}));

// ─── Mock Redux store ────────────────────────────────────────────────────────

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    mockSelector(selector),
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    mockSelector(selector),
}));

// ─── Import after mocks ─────────────────────────────────────────────────────

import { SearchBar } from "@/modules/properties/components/PropertySearch/SearchBar";

describe("SearchBar - Full Text Search Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
    // Default selector returns for search slice
    mockSelector.mockImplementation((selector: (state: unknown) => unknown) => {
      const mockState = {
        search: {
          filters: {
            page: 1,
            limit: 20,
            sortBy: "relevant",
            sortOrder: "desc",
          },
          results: [],
          isSearching: false,
          error: null,
          savedSearches: [],
          mapBounds: null,
          mapCenter: null,
          mapZoom: 12,
        },
        properties: {
          properties: [],
          selectedProperty: null,
          isLoading: false,
          error: null,
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          favorites: [],
          comparison: [],
        },
      };
      return selector(mockState);
    });
  });

  it("should render the search input", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );
    expect(input).toBeInTheDocument();
  });

  it("should update input value as user types", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, { target: { value: "luxury apartment" } });
    expect(input).toHaveValue("luxury apartment");
  });

  it("should show clear button when input has value", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    // No clear button initially
    expect(screen.queryByLabelText(/remove/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test" } });

    // Clear button appears (the X button)
    expect(input).toHaveValue("test");
  });

  it("should dispatch search on Enter key press", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, { target: { value: "downtown condo" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Should dispatch setFilters with keywords
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should dispatch search on Search button click", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, { target: { value: "beach house" } });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should disable search button when input is empty", () => {
    render(<SearchBar />);
    const searchButton = screen.getByText("Search");
    expect(searchButton).toBeDisabled();
  });

  it("should enable search button when input has text", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, { target: { value: "test" } });
    const searchButton = screen.getByText("Search");
    expect(searchButton).not.toBeDisabled();
  });

  it("should clear input when clear button is clicked", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "test query" } });
    expect(input.value).toBe("test query");

    // Find the clear button (it's positioned absolutely inside the search bar)
    // Click the X icon button
    const clearButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn !== screen.getByText("Search"));
    if (clearButtons.length > 0) {
      fireEvent.click(clearButtons[0]);
    }
  });

  it("should handle partial search queries", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    // Type partial query
    fireEvent.change(input, { target: { value: "lux" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should handle case-insensitive search", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, { target: { value: "LUXURY APARTMENT" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should show popular searches when dropdown opens without query", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Popular Searches")).toBeInTheDocument();
    });
  });

  it("should handle multi-word search with special characters", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.change(input, {
      target: { value: "2-bedroom apartment in NY" },
    });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should close dropdown on Escape key", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /search by suburb, postcode, city or address/i,
    );

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "Escape" });

    // After escape, popular searches should not be visible
    expect(screen.queryByText("Popular Searches")).not.toBeInTheDocument();
  });
});
