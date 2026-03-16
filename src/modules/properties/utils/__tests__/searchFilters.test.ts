import { searchFilterUtils } from "../searchFilters";

describe("searchFilterUtils", () => {
  describe("isInBounds", () => {
    const bounds = { north: 42, south: 40, east: -73, west: -75 };

    it("returns true for point inside bounds", () => {
      expect(searchFilterUtils.isInBounds(41, -74, bounds)).toBe(true);
    });

    it("returns false for point outside bounds", () => {
      expect(searchFilterUtils.isInBounds(45, -74, bounds)).toBe(false);
    });

    it("returns true for point on boundary", () => {
      expect(searchFilterUtils.isInBounds(42, -73, bounds)).toBe(true);
    });
  });

  describe("getActiveFilterCount", () => {
    it("returns 0 for empty filters", () => {
      expect(searchFilterUtils.getActiveFilterCount({})).toBe(0);
    });

    it("counts location filter", () => {
      expect(searchFilterUtils.getActiveFilterCount({ location: "NYC" })).toBe(
        1,
      );
    });

    it("counts price range as one filter", () => {
      expect(
        searchFilterUtils.getActiveFilterCount({
          priceMin: 100000,
          priceMax: 500000,
        }),
      ).toBe(1);
    });

    it("counts multiple features individually", () => {
      const count = searchFilterUtils.getActiveFilterCount({
        features: ["Pool", "Gym", "Parking"],
      });
      expect(count).toBe(3);
    });

    it("counts combined filters", () => {
      const count = searchFilterUtils.getActiveFilterCount({
        location: "NYC",
        listingType: "sale",
        bedrooms: 3,
        petFriendly: true,
      });
      expect(count).toBe(4);
    });
  });

  describe("clearFilters", () => {
    it("returns default filter state", () => {
      const result = searchFilterUtils.clearFilters();
      expect(result).toEqual({
        sortBy: "relevant",
        sortOrder: "desc",
        page: 1,
        limit: 20,
      });
    });
  });

  describe("filtersToQueryString / queryStringToFilters", () => {
    it("round-trips location filter", () => {
      const filters = { location: "New York" };
      const qs = searchFilterUtils.filtersToQueryString(filters);
      const parsed = searchFilterUtils.queryStringToFilters(qs);
      expect(parsed.location).toBe("New York");
    });

    it("round-trips numeric filters", () => {
      const filters = { priceMin: 100000, priceMax: 500000, bedrooms: 3 };
      const qs = searchFilterUtils.filtersToQueryString(filters);
      const parsed = searchFilterUtils.queryStringToFilters(qs);
      expect(parsed.priceMin).toBe(100000);
      expect(parsed.priceMax).toBe(500000);
      expect(parsed.bedrooms).toBe(3);
    });

    it("round-trips boolean filters", () => {
      const filters = { petFriendly: true, furnished: false };
      const qs = searchFilterUtils.filtersToQueryString(filters);
      const parsed = searchFilterUtils.queryStringToFilters(qs);
      expect(parsed.petFriendly).toBe(true);
      expect(parsed.furnished).toBe(false);
    });

    it("round-trips sort options", () => {
      const filters = {
        sortBy: "price" as const,
        sortOrder: "asc" as const,
        page: 2,
        limit: 10,
      };
      const qs = searchFilterUtils.filtersToQueryString(filters);
      const parsed = searchFilterUtils.queryStringToFilters(qs);
      expect(parsed.sortBy).toBe("price");
      expect(parsed.sortOrder).toBe("asc");
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(10);
    });

    it("handles empty filters", () => {
      const qs = searchFilterUtils.filtersToQueryString({});
      expect(qs).toBe("");
    });
  });

  describe("getPriceRangeSuggestions", () => {
    it("returns rental price ranges", () => {
      const suggestions = searchFilterUtils.getPriceRangeSuggestions("rent");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].max).toBeLessThanOrEqual(1000);
    });

    it("returns sale price ranges", () => {
      const suggestions = searchFilterUtils.getPriceRangeSuggestions("sale");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].max).toBeGreaterThanOrEqual(200000);
    });
  });

  describe("getFeatureOptions", () => {
    it("returns array of feature strings", () => {
      const features = searchFilterUtils.getFeatureOptions();
      expect(features.length).toBeGreaterThan(0);
      expect(features).toContain("Pool");
      expect(features).toContain("Gym");
    });
  });

  describe("calculateDistance", () => {
    it("returns 0 for same point", () => {
      expect(searchFilterUtils.calculateDistance(40, -74, 40, -74)).toBe(0);
    });

    it("calculates reasonable distance between NYC and LA", () => {
      const distance = searchFilterUtils.calculateDistance(
        40.7128,
        -74.006,
        34.0522,
        -118.2437,
      );
      expect(distance).toBeGreaterThan(2400);
      expect(distance).toBeLessThan(2500);
    });

    it("is symmetric", () => {
      const d1 = searchFilterUtils.calculateDistance(40, -74, 34, -118);
      const d2 = searchFilterUtils.calculateDistance(34, -118, 40, -74);
      expect(d1).toBeCloseTo(d2, 5);
    });
  });
});
