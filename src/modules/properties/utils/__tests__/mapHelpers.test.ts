import { MapBounds } from "../../types/property.types";
import { mapHelpers } from "../mapHelpers";

describe("mapHelpers", () => {
  describe("getCenterFromBounds", () => {
    it("returns center of bounds", () => {
      const bounds: MapBounds = { north: 42, south: 40, east: -73, west: -75 };
      const center = mapHelpers.getCenterFromBounds(bounds);
      expect(center.lat).toBe(41);
      expect(center.lng).toBe(-74);
    });
  });

  describe("getZoomFromBounds", () => {
    it("returns low zoom for large bounds", () => {
      const bounds: MapBounds = { north: 50, south: 30, east: -70, west: -100 };
      expect(mapHelpers.getZoomFromBounds(bounds)).toBeLessThanOrEqual(6);
    });

    it("returns high zoom for small bounds", () => {
      const bounds: MapBounds = {
        north: 40.01,
        south: 40.0,
        east: -74.0,
        west: -74.01,
      };
      expect(mapHelpers.getZoomFromBounds(bounds)).toBeGreaterThanOrEqual(13);
    });
  });

  describe("getMarkerColor", () => {
    it("returns blue for apartment", () => {
      expect(mapHelpers.getMarkerColor("apartment")).toBe("#3B82F6");
    });

    it("returns green for house", () => {
      expect(mapHelpers.getMarkerColor("house")).toBe("#10B981");
    });

    it("returns default blue for unknown type", () => {
      expect(mapHelpers.getMarkerColor("unknown")).toBe("#3B82F6");
    });
  });

  describe("getMarkerIcon", () => {
    it("returns house icon for available", () => {
      expect(mapHelpers.getMarkerIcon("available")).toBe("🏠");
    });

    it("returns default for unknown status", () => {
      expect(mapHelpers.getMarkerIcon("unknown")).toBe("🏠");
    });
  });

  describe("formatAddress", () => {
    it("formats full address", () => {
      expect(
        mapHelpers.formatAddress(
          "123 Main St",
          "Apt 4B",
          "New York",
          "NY",
          "10001",
        ),
      ).toBe("123 Main St Apt 4B, New York, NY, 10001");
    });

    it("handles missing optional parts", () => {
      expect(
        mapHelpers.formatAddress("123 Main St", undefined, "New York"),
      ).toBe("123 Main St, New York");
    });

    it("handles street only", () => {
      expect(mapHelpers.formatAddress("123 Main St")).toBe("123 Main St");
    });
  });

  describe("getBoundsFromRadius", () => {
    it("creates bounds around a center point", () => {
      const bounds = mapHelpers.getBoundsFromRadius(40.7128, -74.006, 10);
      expect(bounds.north).toBeGreaterThan(40.7128);
      expect(bounds.south).toBeLessThan(40.7128);
      expect(bounds.east).toBeGreaterThan(-74.006);
      expect(bounds.west).toBeLessThan(-74.006);
    });

    it("larger radius produces wider bounds", () => {
      const small = mapHelpers.getBoundsFromRadius(40, -74, 5);
      const large = mapHelpers.getBoundsFromRadius(40, -74, 50);
      expect(large.north - large.south).toBeGreaterThan(
        small.north - small.south,
      );
    });
  });

  describe("isValidBounds", () => {
    it("accepts valid bounds", () => {
      expect(
        mapHelpers.isValidBounds({
          north: 42,
          south: 40,
          east: -73,
          west: -75,
        }),
      ).toBe(true);
    });

    it("rejects inverted north/south", () => {
      expect(
        mapHelpers.isValidBounds({
          north: 30,
          south: 40,
          east: -73,
          west: -75,
        }),
      ).toBe(false);
    });

    it("rejects out-of-range latitude", () => {
      expect(
        mapHelpers.isValidBounds({
          north: 95,
          south: 40,
          east: -73,
          west: -75,
        }),
      ).toBe(false);
    });
  });

  describe("expandBoundsToIncludePoint", () => {
    it("expands north when point is above", () => {
      const bounds: MapBounds = { north: 42, south: 40, east: -73, west: -75 };
      const expanded = mapHelpers.expandBoundsToIncludePoint(bounds, 45, -74);
      expect(expanded.north).toBe(45);
      expect(expanded.south).toBe(40);
    });

    it("does not shrink bounds", () => {
      const bounds: MapBounds = { north: 42, south: 40, east: -73, west: -75 };
      const expanded = mapHelpers.expandBoundsToIncludePoint(bounds, 41, -74);
      expect(expanded).toEqual(bounds);
    });
  });

  describe("calculatePixelDistance", () => {
    it("returns 0 for same point", () => {
      expect(mapHelpers.calculatePixelDistance(40, -74, 40, -74, 10)).toBe(0);
    });

    it("returns greater distance at higher zoom", () => {
      const low = mapHelpers.calculatePixelDistance(40, -74, 41, -73, 8);
      const high = mapHelpers.calculatePixelDistance(40, -74, 41, -73, 12);
      expect(high).toBeGreaterThan(low);
    });
  });

  describe("getMapStyles", () => {
    it("returns style presets", () => {
      const styles = mapHelpers.getMapStyles();
      expect(styles).toHaveProperty("standard");
      expect(styles).toHaveProperty("silver");
      expect(styles).toHaveProperty("night");
      expect(styles).toHaveProperty("retro");
    });
  });
});
