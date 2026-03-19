import { PropertyService } from "../property.service";

// Mock the prisma client
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockQueryRawUnsafe = jest.fn();
const mockFindManyImages = jest.fn();

jest.mock("../../../config/database", () => ({
  __esModule: true,
  default: {
    property: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
    },
    propertyImage: {
      findMany: (...args: unknown[]) => mockFindManyImages(...args),
    },
    $queryRawUnsafe: (...args: unknown[]) => mockQueryRawUnsafe(...args),
  },
}));

jest.mock("../../../middleware/errorHandler", () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    code: string;
    constructor(message: string, statusCode: number, code: string) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
    }
  },
}));

describe("PropertyService", () => {
  let service: PropertyService;

  beforeEach(() => {
    service = new PropertyService();
    jest.clearAllMocks();
  });

  describe("buildTsQueryString", () => {
    it("should convert a single word to prefix query", () => {
      const result = (service as any).buildTsQueryString("apartment");
      expect(result).toBe("apartment:*");
    });

    it("should AND multiple words with prefix matching", () => {
      const result = (service as any).buildTsQueryString("luxury apartment");
      expect(result).toBe("luxury:* & apartment:*");
    });

    it("should handle case-insensitive input", () => {
      const result = (service as any).buildTsQueryString("New York");
      expect(result).toBe("New:* & York:*");
    });

    it("should strip special characters", () => {
      const result = (service as any).buildTsQueryString(
        "test@#$%^ query!&*()",
      );
      expect(result).toBe("test:* & query:*");
    });

    it("should return empty string for empty input", () => {
      const result = (service as any).buildTsQueryString("");
      expect(result).toBe("");
    });

    it("should return empty string for only special characters", () => {
      const result = (service as any).buildTsQueryString("@#$%^");
      expect(result).toBe("");
    });

    it("should handle extra whitespace", () => {
      const result = (service as any).buildTsQueryString(
        "  luxury   apartment  ",
      );
      expect(result).toBe("luxury:* & apartment:*");
    });

    it("should handle partial match terms", () => {
      const result = (service as any).buildTsQueryString("apt");
      expect(result).toBe("apt:*");
    });
  });

  describe("getAll", () => {
    it("should return properties without search when no search query", async () => {
      const mockProperties = [
        { id: "1", title: "Test Property", status: "ACTIVE" },
      ];
      mockFindMany.mockResolvedValue(mockProperties);
      mockCount.mockResolvedValue(1);

      const result = await service.getAll({ page: 1, limit: 20 });

      expect(result.properties).toEqual(mockProperties);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it("should delegate to fullTextSearch when search query is provided", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(1) }]) // count query
        .mockResolvedValueOnce([
          { id: "1", title: "Luxury Apartment" },
        ]); // main query
      mockFindManyImages.mockResolvedValue([]);

      const result = await service.getAll({
        page: 1,
        limit: 20,
        search: "luxury",
      });

      expect(mockQueryRawUnsafe).toHaveBeenCalledTimes(2);
      // Verify the search uses to_tsquery with prefix matching
      const countCall = mockQueryRawUnsafe.mock.calls[0];
      expect(countCall[0]).toContain("to_tsquery");
      expect(countCall[2]).toBe("luxury:*");
    });

    it("should not search when search query is empty or whitespace", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await service.getAll({ page: 1, limit: 20, search: "   " });

      // Should fall back to regular getAll (no raw query)
      expect(mockQueryRawUnsafe).not.toHaveBeenCalled();
      expect(mockFindMany).toHaveBeenCalled();
    });

    it("should apply property type filter in full-text search", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(0) }])
        .mockResolvedValueOnce([]);
      mockFindManyImages.mockResolvedValue([]);

      await service.getAll({
        page: 1,
        limit: 20,
        search: "luxury",
        propertyType: "APARTMENT",
      });

      const countCall = mockQueryRawUnsafe.mock.calls[0];
      expect(countCall[0]).toContain('"propertyType"');
      expect(countCall).toContain("APARTMENT");
    });

    it("should apply price range filters in full-text search", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(0) }])
        .mockResolvedValueOnce([]);
      mockFindManyImages.mockResolvedValue([]);

      await service.getAll({
        page: 1,
        limit: 20,
        search: "house",
        minPrice: "100000",
        maxPrice: "500000",
      });

      const countCall = mockQueryRawUnsafe.mock.calls[0];
      expect(countCall[0]).toContain("price >=");
      expect(countCall[0]).toContain("price <=");
    });

    it("should apply bedroom and bathroom filters in full-text search", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(0) }])
        .mockResolvedValueOnce([]);
      mockFindManyImages.mockResolvedValue([]);

      await service.getAll({
        page: 1,
        limit: 20,
        search: "condo",
        bedrooms: "3",
        bathrooms: "2",
      });

      const countCall = mockQueryRawUnsafe.mock.calls[0];
      expect(countCall[0]).toContain("bedrooms");
      expect(countCall[0]).toContain("bathrooms");
    });

    it("should attach images to search results", async () => {
      const mockProps = [
        { id: "p1", title: "Prop 1" },
        { id: "p2", title: "Prop 2" },
      ];
      const mockImages = [
        { id: "img1", propertyId: "p1", url: "img1.jpg", order: 0 },
        { id: "img2", propertyId: "p2", url: "img2.jpg", order: 0 },
      ];

      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(2) }])
        .mockResolvedValueOnce(mockProps);
      mockFindManyImages.mockResolvedValue(mockImages);

      const result = await service.getAll({
        page: 1,
        limit: 20,
        search: "test",
      });

      expect(result.properties[0]).toHaveProperty("images");
      expect(result.properties[1]).toHaveProperty("images");
    });

    it("should handle pagination correctly in search results", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(50) }])
        .mockResolvedValueOnce([]);
      mockFindManyImages.mockResolvedValue([]);

      const result = await service.getAll({
        page: 3,
        limit: 10,
        search: "house",
      });

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.pages).toBe(5);
    });

    it("should handle multi-word search queries with partial matching", async () => {
      mockQueryRawUnsafe
        .mockResolvedValueOnce([{ count: BigInt(0) }])
        .mockResolvedValueOnce([]);
      mockFindManyImages.mockResolvedValue([]);

      await service.getAll({
        page: 1,
        limit: 20,
        search: "lux apt down",
      });

      const countCall = mockQueryRawUnsafe.mock.calls[0];
      // Verify partial matching with :* suffix
      expect(countCall[2]).toBe("lux:* & apt:* & down:*");
    });
  });
});
