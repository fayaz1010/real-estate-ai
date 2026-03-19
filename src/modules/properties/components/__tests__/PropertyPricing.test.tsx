import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { PropertyPricing } from "../PropertyDetails/PropertyPricing";
import "@testing-library/jest-dom";

// Mock formatCurrency for testing
const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Test data interface
interface TestProperty {
  id: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  pricePerSqft: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: string;
  listingType: "sale" | "rent";
  status: string;
  pricing: {
    price: number;
    pricePerSqft: number;
    originalPrice?: number;
    priceChange?: number;
    deposit?: number;
    applicationFee?: number;
    propertyTax?: number;
    hoaFees?: number;
    utilitiesIncluded?: string[];
    priceHistory?: Array<{
      date: string;
      price: number;
      event: string;
    }>;
  };
  lastUpdated: string;
}

// Test property factory
const createTestProperty = (
  overrides: Partial<TestProperty> = {},
): TestProperty => ({
  id: "1",
  title: "Luxury Apartment",
  description: "Beautiful apartment with amazing views",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    latitude: 40.7128,
    longitude: -74.006,
  },
  price: 1200000,
  pricePerSqft: 1200,
  sqft: 2000,
  bedrooms: 3,
  bathrooms: 2.5,
  yearBuilt: 2015,
  propertyType: "apartment",
  listingType: "sale",
  status: "active",
  pricing: {
    price: 1200000,
    pricePerSqft: 1200,
    originalPrice: 1250000,
    priceChange: -4,
    deposit: 240000,
    applicationFee: 100,
    propertyTax: 15000,
    hoaFees: 500,
    utilitiesIncluded: ["Water", "Trash"],
    priceHistory: [
      { date: "2023-01-01", price: 1250000, event: "listed" },
      { date: "2023-02-15", price: 1200000, event: "price_change" },
    ],
  },
  lastUpdated: new Date().toISOString(),
  ...overrides,
});

describe("PropertyPricing", () => {
  const mockOnContactAgent = vi.fn();
  const mockOnScheduleTour = vi.fn();
  let testProperty: TestProperty;

  beforeEach(() => {
    vi.clearAllMocks();
    testProperty = createTestProperty();
  });

  it("renders without crashing", () => {
    render(
      <PropertyPricing
        property={testProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );
    expect(screen.getAllByText(/\$/i).length).toBeGreaterThan(0);
  });

  it("displays the current price", () => {
    render(
      <PropertyPricing
        property={testProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );
    const priceText = formatCurrency(testProperty.price);
    expect(screen.getAllByText(priceText).length).toBeGreaterThan(0);
  });

  it("shows price change when available", () => {
    render(
      <PropertyPricing
        property={testProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );
    const priceChange = testProperty.pricing.priceChange || 0;
    expect(
      screen.getByText(new RegExp(`${Math.abs(priceChange)}%`, "i")),
    ).toBeInTheDocument();
  });

  it("calls onContactAgent when contact button is clicked", () => {
    render(
      <PropertyPricing
        property={testProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );
    const contactButton = screen.getByText(/Contact Agent/i);
    fireEvent.click(contactButton);
    expect(mockOnContactAgent).toHaveBeenCalledTimes(1);
  });

  it("calls onScheduleTour when schedule tour button is clicked", () => {
    render(
      <PropertyPricing
        property={testProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );
    const tourButton = screen.getByText(/Schedule Tour/i);
    fireEvent.click(tourButton);
    expect(mockOnScheduleTour).toHaveBeenCalledTimes(1);
  });

  it("handles missing optional data gracefully", () => {
    const minimalProperty = createTestProperty({
      pricing: {
        price: 1200000,
        pricePerSqft: 1200,
      },
    });

    render(
      <PropertyPricing
        property={minimalProperty}
        onContactAgent={mockOnContactAgent}
        onScheduleTour={mockOnScheduleTour}
      />,
    );

    expect(
      screen.getAllByText(formatCurrency(minimalProperty.price)).length,
    ).toBeGreaterThan(0);
  });
});
