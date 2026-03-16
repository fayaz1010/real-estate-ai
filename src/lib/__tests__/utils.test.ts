import {
  cn,
  formatCurrency,
  formatDate,
  getInitials,
  calculateMortgage,
  formatNumber,
  getPricePerSqft,
  getBedBathText,
  getPropertyStatusBadgeVariant,
  truncateText,
  getGoogleMapsUrl,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1200000)).toBe("$1,200,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats small amounts", () => {
    expect(formatCurrency(99)).toBe("$99");
  });

  it("accepts different currency", () => {
    const result = formatCurrency(1000, "EUR");
    expect(result).toContain("1,000");
  });
});

describe("formatDate", () => {
  it("formats date without time", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("includes time when requested", () => {
    const result = formatDate("2024-06-15T14:30:00", true);
    expect(result).toContain("June");
    expect(result).toContain("15");
  });
});

describe("getInitials", () => {
  it("returns initials for two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("truncates to 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("handles single name", () => {
    expect(getInitials("John")).toBe("J");
  });
});

describe("calculateMortgage", () => {
  it("calculates monthly payment", () => {
    const payment = calculateMortgage(300000, 30, 0.04);
    expect(payment).toBeGreaterThan(1400);
    expect(payment).toBeLessThan(1500);
  });

  it("handles zero interest rate", () => {
    const payment = calculateMortgage(360000, 30, 0);
    expect(payment).toBe(1000);
  });

  it("higher rate means higher payment", () => {
    const low = calculateMortgage(300000, 30, 0.03);
    const high = calculateMortgage(300000, 30, 0.06);
    expect(high).toBeGreaterThan(low);
  });
});

describe("formatNumber", () => {
  it("formats with commas", () => {
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("handles small numbers", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("getPricePerSqft", () => {
  it("calculates correctly", () => {
    expect(getPricePerSqft(500000, 2000)).toBe(250);
  });

  it("returns 0 for zero sqft", () => {
    expect(getPricePerSqft(500000, 0)).toBe(0);
  });
});

describe("getBedBathText", () => {
  it("formats plural correctly", () => {
    expect(getBedBathText(3, 2)).toBe("3 beds • 2 baths");
  });

  it("formats singular correctly", () => {
    expect(getBedBathText(1, 1)).toBe("1 bed • 1 bath");
  });
});

describe("getPropertyStatusBadgeVariant", () => {
  it("returns green for active", () => {
    expect(getPropertyStatusBadgeVariant("active")).toContain("green");
  });

  it("returns yellow for pending", () => {
    expect(getPropertyStatusBadgeVariant("pending")).toContain("yellow");
  });

  it("returns gray for sold", () => {
    expect(getPropertyStatusBadgeVariant("sold")).toContain("gray");
  });

  it("returns blue for new", () => {
    expect(getPropertyStatusBadgeVariant("new")).toContain("blue");
  });

  it("returns gray for unknown status", () => {
    expect(getPropertyStatusBadgeVariant("unknown")).toContain("gray");
  });

  it("handles case insensitivity", () => {
    expect(getPropertyStatusBadgeVariant("Active")).toContain("green");
  });
});

describe("truncateText", () => {
  it("truncates long text", () => {
    const long = "a".repeat(200);
    const result = truncateText(long, 100);
    expect(result).toHaveLength(103); // 100 + '...'
    expect(result.endsWith("...")).toBe(true);
  });

  it("leaves short text unchanged", () => {
    expect(truncateText("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(truncateText("")).toBe("");
  });

  it("handles null-ish input", () => {
    expect(truncateText(undefined as unknown as string)).toBe("");
  });
});

describe("getGoogleMapsUrl", () => {
  it("encodes address in URL", () => {
    const url = getGoogleMapsUrl("123 Main St, New York");
    expect(url).toContain("google.com/maps");
    expect(url).toContain("123%20Main%20St");
  });
});
