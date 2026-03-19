import request from "supertest";

// ─── Mock Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  lease: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  property: {
    findFirst: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  $connect: vi.fn().mockResolvedValue(undefined),
  $disconnect: vi.fn().mockResolvedValue(undefined),
};

vi.mock("../../config/database", () => mockPrisma);

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

const TEST_USER = {
  userId: "landlord-1",
  email: "landlord@test.com",
  role: "LANDLORD",
  id: "landlord-1",
};

vi.mock("../../middleware/auth", () => ({
  authenticate: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "landlord-1",
      email: "landlord@test.com",
      role: "LANDLORD",
      id: "landlord-1",
    };
    next();
  },
  optionalAuth: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "landlord-1",
      email: "landlord@test.com",
      role: "LANDLORD",
      id: "landlord-1",
    };
    next();
  },
  authorize:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
}));

vi.mock("../../middleware/rateLimiter", () => ({
  rateLimiter: (
    _req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => next(),
}));

vi.mock("../../middleware/validation", () => ({
  validate:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
  validateBody:
    () => (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next(),
}));

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

vi.mock("../../config/env", () => ({
  __esModule: true,
  config: mockConfig,
  default: mockConfig,
}));

import app from "../../app";

// ─── Test Data ──────────────────────────────────────────────────────────────

const sampleLease = {
  id: "lease-1",
  propertyId: "prop-1",
  tenantId: "tenant-1",
  landlordId: "landlord-1",
  status: "DRAFT",
  startDate: new Date("2025-06-01"),
  endDate: new Date("2026-05-31"),
  monthlyRent: 2000,
  depositAmount: 4000,
  depositPaid: false,
  lateFeeAmount: 50,
  lateFeeGraceDays: 5,
  signedByTenant: false,
  signedByLandlord: false,
  signedAt: null,
  terminatedAt: null,
  terminationReason: null,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  property: { title: "Cozy Apartment", address: "123 Main St" },
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
    email: "landlord@test.com",
  },
  payments: [],
};

const createLeasePayload = {
  propertyId: "prop-1",
  tenantId: "tenant-1",
  startDate: "2025-06-01",
  endDate: "2026-05-31",
  monthlyRent: 2000,
  depositAmount: 4000,
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Leases API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET /api/leases/my-leases ───────────────────────────────────────────

  describe("GET /api/leases/my-leases", () => {
    it("should return 200 and a list of leases", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([sampleLease]);

      const res = await request(app)
        .get("/api/leases/my-leases")
        .query({ role: "landlord" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return leases in JSON format", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([sampleLease]);

      const res = await request(app)
        .get("/api/leases/my-leases")
        .query({ role: "landlord" });

      expect(res.headers["content-type"]).toMatch(/json/);
    });

    it("should return correct lease data structure", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([sampleLease]);

      const res = await request(app)
        .get("/api/leases/my-leases")
        .query({ role: "landlord" });

      const lease = res.body.data[0];
      expect(lease).toHaveProperty("id");
      expect(lease).toHaveProperty("propertyId");
      expect(lease).toHaveProperty("tenantId");
      expect(lease).toHaveProperty("landlordId");
      expect(lease).toHaveProperty("status");
      expect(lease).toHaveProperty("monthlyRent");
      expect(lease).toHaveProperty("property");
      expect(lease).toHaveProperty("tenant");
    });

    it("should filter leases by landlord role", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([sampleLease]);

      await request(app)
        .get("/api/leases/my-leases")
        .query({ role: "landlord" });

      expect(mockPrisma.lease.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { landlordId: TEST_USER.userId },
        }),
      );
    });

    it("should filter leases by tenant role", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([]);

      await request(app).get("/api/leases/my-leases").query({ role: "tenant" });

      expect(mockPrisma.lease.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenantId: TEST_USER.userId },
        }),
      );
    });

    it("should return empty array when no leases exist", async () => {
      mockPrisma.lease.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get("/api/leases/my-leases")
        .query({ role: "landlord" });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  // ── POST /api/leases ────────────────────────────────────────────────────

  describe("POST /api/leases", () => {
    it("should return 201 and create a new lease", async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: "prop-1",
        ownerId: "landlord-1",
      });
      mockPrisma.lease.create.mockResolvedValue(sampleLease);

      const res = await request(app)
        .post("/api/leases")
        .send(createLeasePayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.message).toBe("Lease created");
    });

    it("should create lease with DRAFT status", async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: "prop-1",
        ownerId: "landlord-1",
      });
      mockPrisma.lease.create.mockResolvedValue(sampleLease);

      await request(app).post("/api/leases").send(createLeasePayload);

      const createCall = mockPrisma.lease.create.mock.calls[0][0];
      expect(createCall.data.status).toBe("DRAFT");
      expect(createCall.data.landlordId).toBe(TEST_USER.userId);
    });

    it("should persist correct lease data", async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: "prop-1",
        ownerId: "landlord-1",
      });
      mockPrisma.lease.create.mockResolvedValue(sampleLease);

      await request(app).post("/api/leases").send(createLeasePayload);

      const createCall = mockPrisma.lease.create.mock.calls[0][0];
      expect(createCall.data.propertyId).toBe("prop-1");
      expect(createCall.data.tenantId).toBe("tenant-1");
      expect(createCall.data.monthlyRent).toBe(2000);
      expect(createCall.data.depositAmount).toBe(4000);
    });

    it("should return 404 when property does not belong to landlord", async () => {
      mockPrisma.property.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/leases")
        .send(createLeasePayload);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/leases/:id ─────────────────────────────────────────────────

  describe("GET /api/leases/:id", () => {
    it("should return 200 and the correct lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);

      const res = await request(app).get("/api/leases/lease-1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("lease-1");
      expect(res.body.data.status).toBe("DRAFT");
    });

    it("should return lease with related property and tenant data", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);

      const res = await request(app).get("/api/leases/lease-1");

      expect(res.body.data.property).toHaveProperty("title");
      expect(res.body.data.tenant).toHaveProperty("firstName");
      expect(res.body.data.landlord).toHaveProperty("firstName");
    });

    it("should return 404 for non-existent lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app).get("/api/leases/non-existent");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should only return lease accessible by the user", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);

      await request(app).get("/api/leases/lease-1");

      expect(mockPrisma.lease.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: "lease-1",
            OR: [
              { tenantId: TEST_USER.userId },
              { landlordId: TEST_USER.userId },
            ],
          }),
        }),
      );
    });
  });

  // ── PATCH /api/leases/:id/status ────────────────────────────────────────

  describe("PATCH /api/leases/:id/status", () => {
    it("should return 200 and update the lease status", async () => {
      const activeLease = { ...sampleLease, status: "ACTIVE" };
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.lease.update.mockResolvedValue(activeLease);

      const res = await request(app)
        .patch("/api/leases/lease-1/status")
        .send({ status: "ACTIVE" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Lease status updated");
    });

    it("should persist status change in the database", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.lease.update.mockResolvedValue({
        ...sampleLease,
        status: "ACTIVE",
      });

      await request(app)
        .patch("/api/leases/lease-1/status")
        .send({ status: "ACTIVE" });

      expect(mockPrisma.lease.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "lease-1" },
        }),
      );
    });

    it("should return 404 for non-existent or unauthorized lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/leases/non-existent/status")
        .send({ status: "ACTIVE" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/leases/:id/terminate ──────────────────────────────────────

  describe("POST /api/leases/:id/terminate", () => {
    it("should return 200 and terminate the lease", async () => {
      const terminatedLease = {
        ...sampleLease,
        status: "TERMINATED",
        terminatedAt: new Date(),
        terminationReason: "Lease violation",
      };
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.lease.update.mockResolvedValue(terminatedLease);

      const res = await request(app)
        .post("/api/leases/lease-1/terminate")
        .send({ reason: "Lease violation" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Lease terminated");
    });

    it("should set TERMINATED status and termination details", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.lease.update.mockResolvedValue({
        ...sampleLease,
        status: "TERMINATED",
      });

      await request(app)
        .post("/api/leases/lease-1/terminate")
        .send({ reason: "Lease violation" });

      expect(mockPrisma.lease.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "lease-1" },
          data: expect.objectContaining({
            status: "TERMINATED",
            terminatedAt: expect.any(Date),
            terminationReason: "Lease violation",
          }),
        }),
      );
    });

    it("should return 404 for non-existent or unauthorized lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/leases/non-existent/terminate")
        .send({ reason: "Lease violation" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/leases/:id/sign ───────────────────────────────────────────

  describe("POST /api/leases/:id/sign", () => {
    it("should return 200 and sign the lease", async () => {
      const signedLease = { ...sampleLease, signedByLandlord: true };
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.lease.update.mockResolvedValue(signedLease);

      const res = await request(app).post("/api/leases/lease-1/sign");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Lease signed");
    });

    it("should return 404 for non-existent lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app).post("/api/leases/non-existent/sign");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
