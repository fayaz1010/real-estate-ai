import request from "supertest";

// ─── Mock Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  payment: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    createMany: vi.fn(),
    count: vi.fn(),
  },
  lease: {
    findFirst: vi.fn(),
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

// ─── Mock Stripe ────────────────────────────────────────────────────────────

vi.mock("stripe", () => {
  return vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: vi.fn().mockResolvedValue({
        id: "pi_test_123",
        client_secret: "pi_test_123_secret",
      }),
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_test_123",
            metadata: { paymentId: "payment-1" },
          },
        },
      }),
    },
  }));
});

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

const TEST_USER = {
  userId: "user-1",
  email: "tenant@test.com",
  role: "TENANT",
  id: "user-1",
};

vi.mock("../../middleware/auth", () => ({
  authenticate: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "user-1",
      email: "tenant@test.com",
      role: "TENANT",
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
      email: "tenant@test.com",
      role: "TENANT",
      id: "user-1",
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
  tenantId: "user-1",
  landlordId: "landlord-1",
  status: "ACTIVE",
  startDate: new Date("2025-06-01"),
  endDate: new Date("2026-05-31"),
  monthlyRent: 2000,
  depositAmount: 4000,
  property: {
    id: "prop-1",
    title: "Downtown Apartment",
    address: "123 Main St",
  },
};

const samplePayment = {
  id: "payment-1",
  leaseId: "lease-1",
  payerId: "user-1",
  type: "RENT",
  status: "PAYMENT_PENDING",
  amount: 2000,
  currency: "USD",
  dueDate: new Date("2025-07-01"),
  paidAt: null,
  stripePaymentIntentId: null,
  stripeInvoiceId: null,
  description: "Rent for July 2025",
  receiptUrl: null,
  createdAt: new Date("2025-06-15"),
  updatedAt: new Date("2025-06-15"),
  lease: {
    property: { title: "Downtown Apartment", address: "123 Main St" },
  },
};

const paidPayment = {
  ...samplePayment,
  status: "PAID",
  paidAt: new Date("2025-06-28"),
  stripePaymentIntentId: "pi_test_123",
};

const createPaymentPayload = {
  leaseId: "lease-1",
  type: "RENT",
  amount: 2000,
  dueDate: "2025-07-01",
  description: "Rent for July 2025",
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Payments API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET /api/payments/my-payments ───────────────────────────────────────

  describe("GET /api/payments/my-payments", () => {
    it("should return 200 and a list of payments", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/my-payments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return payments in JSON format", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/my-payments");

      expect(res.headers["content-type"]).toMatch(/json/);
    });

    it("should return correct payment data structure", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/my-payments");

      const payment = res.body.data[0];
      expect(payment).toHaveProperty("id");
      expect(payment).toHaveProperty("leaseId");
      expect(payment).toHaveProperty("payerId");
      expect(payment).toHaveProperty("type");
      expect(payment).toHaveProperty("status");
      expect(payment).toHaveProperty("amount");
      expect(payment).toHaveProperty("dueDate");
    });

    it("should filter payments by status", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([paidPayment]);

      await request(app)
        .get("/api/payments/my-payments")
        .query({ status: "PAID" });

      expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            payerId: TEST_USER.userId,
            status: "PAID",
          }),
        }),
      );
    });

    it("should return empty array when no payments exist", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([]);

      const res = await request(app).get("/api/payments/my-payments");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it("should include lease and property information", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/my-payments");

      const payment = res.body.data[0];
      expect(payment).toHaveProperty("lease");
      expect(payment.lease).toHaveProperty("property");
    });
  });

  // ── POST /api/payments ──────────────────────────────────────────────────

  describe("POST /api/payments", () => {
    it("should return 201 and create a new payment", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.create.mockResolvedValue(samplePayment);

      const res = await request(app)
        .post("/api/payments")
        .send(createPaymentPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.message).toBe("Payment created");
    });

    it("should create payment with PAYMENT_PENDING status", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.create.mockResolvedValue(samplePayment);

      await request(app).post("/api/payments").send(createPaymentPayload);

      const createCall = mockPrisma.payment.create.mock.calls[0][0];
      expect(createCall.data.status).toBe("PAYMENT_PENDING");
      expect(createCall.data.payerId).toBe(TEST_USER.userId);
    });

    it("should persist correct payment data", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.create.mockResolvedValue(samplePayment);

      await request(app).post("/api/payments").send(createPaymentPayload);

      const createCall = mockPrisma.payment.create.mock.calls[0][0];
      expect(createCall.data.leaseId).toBe("lease-1");
      expect(createCall.data.type).toBe("RENT");
      expect(createCall.data.amount).toBe(2000);
    });

    it("should return 404 when lease is not accessible", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/payments")
        .send(createPaymentPayload);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/payments/lease/:leaseId ────────────────────────────────────

  describe("GET /api/payments/lease/:leaseId", () => {
    it("should return 200 and payments for a lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/lease/lease-1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 404 when lease is not accessible", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app).get("/api/payments/lease/non-existent");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return payments ordered by due date", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      await request(app).get("/api/payments/lease/lease-1");

      expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { leaseId: "lease-1" },
          orderBy: { dueDate: "desc" },
        }),
      );
    });
  });

  // ── POST /api/payments/:id/pay ──────────────────────────────────────────

  describe("POST /api/payments/:id/pay", () => {
    it("should return 200 and create a Stripe payment intent", async () => {
      // Mock process.env for Stripe initialization
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      mockPrisma.payment.findFirst.mockResolvedValue({
        ...samplePayment,
        lease: sampleLease,
      });
      mockPrisma.payment.update.mockResolvedValue(samplePayment);

      const res = await request(app).post("/api/payments/payment-1/pay");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it("should return 404 for non-existent payment", async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      mockPrisma.payment.findFirst.mockResolvedValue(null);

      const res = await request(app).post("/api/payments/non-existent/pay");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });
  });

  // ── POST /api/payments/lease/:leaseId/generate-rent ─────────────────────

  describe("POST /api/payments/lease/:leaseId/generate-rent", () => {
    it("should return 200 and generate rent payments", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.createMany.mockResolvedValue({ count: 12 });

      const res = await request(app).post(
        "/api/payments/lease/lease-1/generate-rent",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("count");
      expect(res.body.message).toBe("Rent payments generated");
    });

    it("should return 404 when lease is not owned by user", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(null);

      const res = await request(app).post(
        "/api/payments/lease/non-existent/generate-rent",
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should generate payments with correct data", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.createMany.mockResolvedValue({ count: 12 });

      await request(app).post("/api/payments/lease/lease-1/generate-rent");

      expect(mockPrisma.payment.createMany).toHaveBeenCalledTimes(1);
      const createCall = mockPrisma.payment.createMany.mock.calls[0][0];
      const payments = createCall.data;
      expect(Array.isArray(payments)).toBe(true);
      expect(payments.length).toBeGreaterThan(0);
      expect(payments[0]).toHaveProperty("leaseId", "lease-1");
      expect(payments[0]).toHaveProperty("type", "RENT");
      expect(payments[0]).toHaveProperty("status", "PAYMENT_PENDING");
      expect(payments[0]).toHaveProperty("amount", 2000);
    });
  });

  // ── POST /api/payments/webhook ──────────────────────────────────────────

  describe("POST /api/payments/webhook", () => {
    it("should return 200 and process webhook event", async () => {
      // In dev mode (no webhook secret), accepts raw body
      mockPrisma.payment.update.mockResolvedValue(paidPayment);

      const res = await request(app)
        .post("/api/payments/webhook")
        .send({
          type: "payment_intent.succeeded",
          data: {
            object: {
              id: "pi_test_123",
              metadata: { paymentId: "payment-1" },
            },
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should confirm payment on successful intent", async () => {
      mockPrisma.payment.update.mockResolvedValue(paidPayment);

      await request(app)
        .post("/api/payments/webhook")
        .send({
          type: "payment_intent.succeeded",
          data: {
            object: {
              id: "pi_test_123",
              metadata: { paymentId: "payment-1" },
            },
          },
        });

      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "payment-1" },
          data: expect.objectContaining({
            status: "PAID",
            paidAt: expect.any(Date),
          }),
        }),
      );
    });
  });
});
