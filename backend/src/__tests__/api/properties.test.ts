import request from "supertest";

// ─── Mock Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  property: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../../config/database", () => mockPrisma);

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

const TEST_USER = {
  userId: "user-1",
  email: "landlord@test.com",
  role: "LANDLORD",
  id: "user-1",
};

jest.mock("../../middleware/auth", () => ({
  authenticate: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "user-1",
      email: "landlord@test.com",
      role: "LANDLORD",
      id: "user-1",
    };
    next();
  },
  optionalAuth: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "user-1",
      email: "landlord@test.com",
      role: "LANDLORD",
      id: "user-1",
    };
    next();
  },
  authorize:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
}));

// ─── Mock Rate Limiter ─────────────────────────────────────────────────────

jest.mock("../../middleware/rateLimiter", () => ({
  rateLimiter: (
    _req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => next(),
}));

// ─── Mock Validation ────────────────────────────────────────────────────────

jest.mock("../../middleware/validation", () => ({
  validate:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
  validateBody:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
}));

// ─── Mock Config ────────────────────────────────────────────────────────────

const mockConfig = {
  nodeEnv: "test",
  port: 3001,
  corsOrigin: "*",
  swaggerEnabled: false,
  stripe: { secretKey: "", webhookSecret: "", publishableKey: "" },
  vapid: { publicKey: "", privateKey: "", subject: "" },
  smtp: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    fromName: "",
    fromEmail: "",
  },
  cloudflare: {
    accountId: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucketName: "",
    region: "auto",
  },
  rateLimit: { windowMs: 900000, maxRequests: 100 },
  emailRateLimit: { windowMs: 3600000, max: 10 },
  google: { clientId: "", clientSecret: "" },
  features: {
    emailVerification: false,
    phoneVerification: false,
    twoFactor: false,
  },
  jwtSecret: "test-secret",
  jwtRefreshSecret: "test-refresh-secret",
  jwtExpiresIn: "15m",
  refreshTokenExpiresIn: "7d",
  frontendUrl: "http://localhost:3000",
  databaseUrl: "test",
  maxFileSize: 5242880,
  uploadPath: "./uploads",
  logLevel: "error",
  logToFile: false,
  logFilePath: "",
  cacheEnabled: false,
  cacheTtl: 3600,
};

jest.mock("../../config/env", () => ({
  __esModule: true,
  config: mockConfig,
  default: mockConfig,
}));

// ─── Import app after all mocks ─────────────────────────────────────────────

import app from "../../app";

// ─── Test Data ──────────────────────────────────────────────────────────────

const sampleProperty = {
  id: "prop-1",
  title: "Cozy Downtown Apartment",
  description: "A beautiful apartment in downtown",
  propertyType: "APARTMENT",
  status: "ACTIVE",
  price: 2500,
  bedrooms: 2,
  bathrooms: 1,
  sqft: 1200,
  address: "123 Main St",
  slug: "cozy-downtown-apartment-123456",
  ownerId: "user-1",
  views: 10,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  deletedAt: null,
  images: [],
  owner: {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "landlord@test.com",
  },
};

const createPropertyPayload = {
  title: "Cozy Downtown Apartment",
  description: "A beautiful apartment in downtown",
  propertyType: "APARTMENT",
  price: 2500,
  bedrooms: 2,
  bathrooms: 1,
  sqft: 1200,
  address: "123 Main St",
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Properties API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── GET /api/properties ─────────────────────────────────────────────────

  describe("GET /api/properties", () => {
    it("should return 200 and a list of properties", async () => {
      mockPrisma.property.findMany.mockResolvedValue([sampleProperty]);
      mockPrisma.property.count.mockResolvedValue(1);

      const res = await request(app).get("/api/properties");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("properties");
      expect(res.body.data).toHaveProperty("pagination");
      expect(Array.isArray(res.body.data.properties)).toBe(true);
    });

    it("should return properties in JSON format", async () => {
      mockPrisma.property.findMany.mockResolvedValue([sampleProperty]);
      mockPrisma.property.count.mockResolvedValue(1);

      const res = await request(app).get("/api/properties");

      expect(res.headers["content-type"]).toMatch(/json/);
    });

    it("should return correct property data structure", async () => {
      mockPrisma.property.findMany.mockResolvedValue([sampleProperty]);
      mockPrisma.property.count.mockResolvedValue(1);

      const res = await request(app).get("/api/properties");

      const property = res.body.data.properties[0];
      expect(property).toHaveProperty("id");
      expect(property).toHaveProperty("title");
      expect(property).toHaveProperty("price");
      expect(property).toHaveProperty("status");
      expect(property).toHaveProperty("images");
      expect(property).toHaveProperty("owner");
    });

    it("should return pagination metadata", async () => {
      mockPrisma.property.findMany.mockResolvedValue([sampleProperty]);
      mockPrisma.property.count.mockResolvedValue(1);

      const res = await request(app).get("/api/properties");

      const pagination = res.body.data.pagination;
      expect(pagination).toHaveProperty("page");
      expect(pagination).toHaveProperty("limit");
      expect(pagination).toHaveProperty("total");
      expect(pagination).toHaveProperty("pages");
    });

    it("should return empty array when no properties exist", async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.property.count.mockResolvedValue(0);

      const res = await request(app).get("/api/properties");

      expect(res.status).toBe(200);
      expect(res.body.data.properties).toHaveLength(0);
      expect(res.body.data.pagination.total).toBe(0);
    });
  });

  // ── POST /api/properties ────────────────────────────────────────────────

  describe("POST /api/properties", () => {
    it("should return 201 and create a new property", async () => {
      mockPrisma.property.create.mockResolvedValue(sampleProperty);

      const res = await request(app)
        .post("/api/properties")
        .send(createPropertyPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe(sampleProperty.title);
      expect(res.body.message).toBe("Property created");
    });

    it("should persist property with correct owner", async () => {
      mockPrisma.property.create.mockResolvedValue(sampleProperty);

      await request(app).post("/api/properties").send(createPropertyPayload);

      expect(mockPrisma.property.create).toHaveBeenCalledTimes(1);
      const createCall = mockPrisma.property.create.mock.calls[0][0];
      expect(createCall.data.ownerId).toBe(TEST_USER.userId);
      expect(createCall.data.status).toBe("DRAFT");
    });

    it("should generate a slug from the title", async () => {
      mockPrisma.property.create.mockResolvedValue(sampleProperty);

      await request(app).post("/api/properties").send(createPropertyPayload);

      const createCall = mockPrisma.property.create.mock.calls[0][0];
      expect(createCall.data.slug).toMatch(/^cozy-downtown-apartment-/);
    });
  });

  // ── GET /api/properties/:id ─────────────────────────────────────────────

  describe("GET /api/properties/:id", () => {
    it("should return 200 and the correct property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue(sampleProperty);

      const res = await request(app).get("/api/properties/prop-1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("prop-1");
      expect(res.body.data.title).toBe("Cozy Downtown Apartment");
    });

    it("should return 404 for non-existent property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/properties/non-existent-id");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for soft-deleted property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue({
        ...sampleProperty,
        deletedAt: new Date(),
      });

      const res = await request(app).get("/api/properties/prop-1");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should increment view count on successful fetch", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue(sampleProperty);

      await request(app).get("/api/properties/prop-1");

      expect(mockPrisma.property.update).toHaveBeenCalledWith({
        where: { id: "prop-1" },
        data: { views: { increment: 1 } },
      });
    });
  });

  // ── PATCH /api/properties/:id ───────────────────────────────────────────

  describe("PATCH /api/properties/:id", () => {
    it("should return 200 and update the property", async () => {
      const updatedProperty = { ...sampleProperty, price: 3000 };
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue(updatedProperty);

      const res = await request(app)
        .patch("/api/properties/prop-1")
        .send({ price: 3000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(3000);
      expect(res.body.message).toBe("Property updated");
    });

    it("should return 404 for non-existent property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/properties/non-existent")
        .send({ price: 3000 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 when user is not the owner", async () => {
      mockPrisma.property.findUnique.mockResolvedValue({
        ...sampleProperty,
        ownerId: "other-user",
      });

      const res = await request(app)
        .patch("/api/properties/prop-1")
        .send({ price: 3000 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should persist modifications in the database", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue({
        ...sampleProperty,
        price: 3000,
      });

      await request(app).patch("/api/properties/prop-1").send({ price: 3000 });

      expect(mockPrisma.property.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "prop-1" },
          data: { price: 3000 },
        }),
      );
    });
  });

  // ── DELETE /api/properties/:id ──────────────────────────────────────────

  describe("DELETE /api/properties/:id", () => {
    it("should return 200 and soft-delete the property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue({
        ...sampleProperty,
        deletedAt: new Date(),
      });

      const res = await request(app).delete("/api/properties/prop-1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Property deleted");
    });

    it("should set deletedAt timestamp on soft-delete", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.property.update.mockResolvedValue(sampleProperty);

      await request(app).delete("/api/properties/prop-1");

      expect(mockPrisma.property.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "prop-1" },
          data: { deletedAt: expect.any(Date) },
        }),
      );
    });

    it("should return 404 for non-existent property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      const res = await request(app).delete("/api/properties/non-existent");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 when user is not the owner", async () => {
      mockPrisma.property.findUnique.mockResolvedValue({
        ...sampleProperty,
        ownerId: "other-user",
      });

      const res = await request(app).delete("/api/properties/prop-1");

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for already deleted property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue({
        ...sampleProperty,
        deletedAt: new Date(),
      });

      const res = await request(app).delete("/api/properties/prop-1");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
