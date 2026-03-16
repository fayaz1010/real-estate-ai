import { propertyValidation } from "../propertyValidation";

describe("propertyValidation", () => {
  describe("validateTitle", () => {
    it("rejects empty title", () => {
      expect(propertyValidation.validateTitle("")).toEqual({
        valid: false,
        error: "Title is required",
      });
    });

    it("rejects title under 10 chars", () => {
      expect(propertyValidation.validateTitle("Short")).toEqual({
        valid: false,
        error: "Title must be at least 10 characters",
      });
    });

    it("rejects title over 100 chars", () => {
      const long = "a".repeat(101);
      expect(propertyValidation.validateTitle(long).valid).toBe(false);
    });

    it("accepts valid title", () => {
      expect(
        propertyValidation.validateTitle("Beautiful 3BR Apartment in NYC")
          .valid,
      ).toBe(true);
    });
  });

  describe("validateDescription", () => {
    it("rejects empty description", () => {
      expect(propertyValidation.validateDescription("").valid).toBe(false);
    });

    it("rejects description under 50 chars", () => {
      expect(propertyValidation.validateDescription("Too short").valid).toBe(
        false,
      );
    });

    it("rejects description over 5000 chars", () => {
      const long = "a".repeat(5001);
      expect(propertyValidation.validateDescription(long).valid).toBe(false);
    });

    it("accepts valid description", () => {
      const desc = "a".repeat(100);
      expect(propertyValidation.validateDescription(desc).valid).toBe(true);
    });
  });

  describe("validateAddress", () => {
    const validAddress = {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    };

    it("accepts valid address", () => {
      expect(propertyValidation.validateAddress(validAddress).valid).toBe(true);
    });

    it("rejects missing street", () => {
      const result = propertyValidation.validateAddress({
        ...validAddress,
        street: "",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.street).toBeDefined();
    });

    it("rejects invalid zip code", () => {
      const result = propertyValidation.validateAddress({
        ...validAddress,
        zipCode: "ABC",
      });
      expect(result.errors.zipCode).toBe("Invalid zip code format");
    });

    it("accepts zip+4 format", () => {
      const result = propertyValidation.validateAddress({
        ...validAddress,
        zipCode: "10001-1234",
      });
      expect(result.valid).toBe(true);
    });

    it("rejects invalid latitude", () => {
      const result = propertyValidation.validateAddress({
        ...validAddress,
        latitude: 100,
      });
      expect(result.errors.latitude).toBeDefined();
    });

    it("rejects invalid longitude", () => {
      const result = propertyValidation.validateAddress({
        ...validAddress,
        longitude: -200,
      });
      expect(result.errors.longitude).toBeDefined();
    });
  });

  describe("validatePricing", () => {
    it("rejects zero price", () => {
      expect(propertyValidation.validatePricing(0, "sale").valid).toBe(false);
    });

    it("rejects negative price", () => {
      expect(propertyValidation.validatePricing(-100, "sale").valid).toBe(
        false,
      );
    });

    it("rejects too-low rent", () => {
      const result = propertyValidation.validatePricing(50, "rent");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("too low");
    });

    it("rejects too-high rent", () => {
      const result = propertyValidation.validatePricing(60000, "rent");
      expect(result.valid).toBe(false);
    });

    it("rejects too-low sale price", () => {
      expect(propertyValidation.validatePricing(5000, "sale").valid).toBe(
        false,
      );
    });

    it("accepts valid sale price", () => {
      expect(propertyValidation.validatePricing(500000, "sale").valid).toBe(
        true,
      );
    });

    it("accepts valid rent", () => {
      expect(propertyValidation.validatePricing(2500, "rent").valid).toBe(true);
    });
  });

  describe("validateDetails", () => {
    it("accepts valid details", () => {
      const result = propertyValidation.validateDetails({
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1500,
        yearBuilt: 2020,
      });
      expect(result.valid).toBe(true);
    });

    it("rejects missing bedrooms", () => {
      const result = propertyValidation.validateDetails({
        bathrooms: 2,
        sqft: 1500,
      });
      expect(result.errors.bedrooms).toBeDefined();
    });

    it("rejects bathrooms out of range", () => {
      const result = propertyValidation.validateDetails({
        bedrooms: 3,
        bathrooms: 25,
        sqft: 1500,
      });
      expect(result.errors.bathrooms).toBeDefined();
    });

    it("rejects tiny sqft", () => {
      const result = propertyValidation.validateDetails({
        bedrooms: 1,
        bathrooms: 1,
        sqft: 50,
      });
      expect(result.errors.sqft).toBeDefined();
    });

    it("rejects future year built", () => {
      const result = propertyValidation.validateDetails({
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1500,
        yearBuilt: 2099,
      });
      expect(result.errors.yearBuilt).toBeDefined();
    });

    it("rejects negative lot size", () => {
      const result = propertyValidation.validateDetails({
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1500,
        lotSize: -1,
      });
      expect(result.errors.lotSize).toBeDefined();
    });
  });

  describe("validateImages", () => {
    const createFile = (type: string, size: number): File => {
      const blob = new Blob(["x".repeat(size)], { type });
      return new File([blob], "test.jpg", { type });
    };

    it("rejects empty array", () => {
      expect(propertyValidation.validateImages([]).valid).toBe(false);
    });

    it("accepts valid images", () => {
      const files = [createFile("image/jpeg", 1000)];
      expect(propertyValidation.validateImages(files).valid).toBe(true);
    });

    it("rejects non-image files", () => {
      const files = [createFile("application/pdf", 1000)];
      expect(propertyValidation.validateImages(files).valid).toBe(false);
    });

    it("rejects oversized images", () => {
      const files = [createFile("image/jpeg", 11 * 1024 * 1024)];
      const result = propertyValidation.validateImages(files);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("10MB"))).toBe(true);
    });
  });

  describe("validateUrl", () => {
    it("accepts valid URL", () => {
      expect(propertyValidation.validateUrl("https://example.com")).toBe(true);
    });

    it("rejects invalid URL", () => {
      expect(propertyValidation.validateUrl("not a url")).toBe(false);
    });
  });

  describe("validatePhone", () => {
    it("accepts valid US phone", () => {
      expect(propertyValidation.validatePhone("(555) 123-4567")).toBe(true);
    });

    it("accepts phone with country code", () => {
      expect(propertyValidation.validatePhone("+15551234567")).toBe(true);
    });

    it("rejects too-short phone", () => {
      expect(propertyValidation.validatePhone("12345")).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("accepts valid email", () => {
      expect(propertyValidation.validateEmail("user@example.com")).toBe(true);
    });

    it("rejects missing @", () => {
      expect(propertyValidation.validateEmail("userexample.com")).toBe(false);
    });

    it("rejects missing domain", () => {
      expect(propertyValidation.validateEmail("user@")).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("escapes HTML tags", () => {
      expect(
        propertyValidation.sanitizeInput('<script>alert("xss")</script>'),
      ).not.toContain("<");
      expect(
        propertyValidation.sanitizeInput('<script>alert("xss")</script>'),
      ).not.toContain(">");
    });

    it("escapes quotes", () => {
      const result = propertyValidation.sanitizeInput('"hello"');
      expect(result).not.toContain('"');
    });
  });

  describe("validateDate", () => {
    it("accepts valid date", () => {
      expect(propertyValidation.validateDate("2024-01-15")).toBe(true);
    });

    it("rejects invalid format", () => {
      expect(propertyValidation.validateDate("01/15/2024")).toBe(false);
    });

    it("rejects invalid date values", () => {
      expect(propertyValidation.validateDate("2024-13-01")).toBe(false);
    });
  });

  describe("isFutureDate", () => {
    it("returns true for future date", () => {
      expect(propertyValidation.isFutureDate("2099-01-01")).toBe(true);
    });

    it("returns false for past date", () => {
      expect(propertyValidation.isFutureDate("2000-01-01")).toBe(false);
    });
  });
});
