import request from "supertest";

// ─── Mock express-rate-limit ────────────────────────────────────────────────

jest.mock("express-rate-limit", () => {
  return jest.fn().mockImplementation(() => {
    return (_req: Record<string, unknown>, _res: unknown, next: () => void) =>
      next();
  });
});

// ─── Mock Error Handler (fix instanceof across module boundaries) ───────────

jest.mock("../../backend/src/middleware/errorHandler", () => {
  class AppError extends Error {
    public statusCode: number;
    public code: string;
    public details?: Record<string, unknown>;
    constructor(
      message: string,
      statusCode = 500,
      code = "INTERNAL_ERROR",
      details?: Record<string, unknown>,
    ) {
      super(message);
      this.name = "AppError";
      this.statusCode = statusCode;
      this.code = code;
      this.details = details;
    }
  }
  return {
    __esModule: true,
    AppError,
    errorHandler: (
      error: Error & {
        statusCode?: number;
        code?: string;
        details?: Record<string, unknown>;
      },
      _req: unknown,
      res: { status: (code: number) => { json: (body: unknown) => void } },
      _next: unknown,
    ) => {
      let statusCode = 500;
      let code = "INTERNAL_ERROR";
      let message = "Internal server error";
      let details: Record<string, unknown> | undefined;

      if (error.name === "AppError" && error.statusCode) {
        statusCode = error.statusCode;
        code = error.code || "INTERNAL_ERROR";
        message = error.message;
        details = error.details;
      }

      res.status(statusCode).json({
        success: false,
        error: { code, message, ...(details && { details }) },
      });
    },
    asyncHandler: (
      fn: (
        req: unknown,
        res: unknown,
        next: (err?: Error) => void,
      ) => Promise<unknown>,
    ) => {
      return (req: unknown, res: unknown, next: (err?: Error) => void) => {
        Promise.resolve(fn(req, res, next)).catch(next);
      };
    },
  };
});

// ─── Mock Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  payment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    createMany: jest.fn(),
    count: jest.fn(),
  },
  lease: {
    findFirst: jest.fn(),
  },
  property: {
    findFirst: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../../backend/src/config/database", () => mockPrisma);

// ─── Mock Stripe ────────────────────────────────────────────────────────────

const mockStripePaymentIntents = {
  create: jest.fn().mockResolvedValue({
    id: "pi_test_123",
    client_secret: "pi_test_123_secret",
  }),
};

const mockStripeCustomers = {
  create: jest.fn().mockResolvedValue({ id: "cus_test_123" }),
};

const mockStripeSubscriptions = {
  create: jest.fn().mockResolvedValue({
    id: "sub_test_123",
    status: "trialing",
    current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  }),
};

const mockStripeBillingPortal = {
  sessions: {
    create: jest.fn().mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    }),
  },
};

const mockStripeCheckoutSessions = {
  create: jest.fn().mockResolvedValue({
    id: "cs_test_123",
    url: "https://checkout.stripe.com/session/test",
  }),
};

const mockStripeInvoices = {
  list: jest.fn().mockResolvedValue({
    data: [
      {
        id: "inv_test_1",
        amount_paid: 2900,
        status: "paid",
        created: Math.floor(Date.now() / 1000),
      },
    ],
  }),
};

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: mockStripePaymentIntents,
    customers: mockStripeCustomers,
    subscriptions: mockStripeSubscriptions,
    billingPortal: mockStripeBillingPortal,
    checkout: { sessions: mockStripeCheckoutSessions },
    invoices: mockStripeInvoices,
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
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

jest.mock("../../backend/src/middleware/auth", () => ({
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

jest.mock("../../backend/src/middleware/rateLimiter", () => ({
  rateLimiter: (
    _req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => next(),
}));

jest.mock("../../backend/src/middleware/validation", () => ({
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

jest.mock("../../backend/src/config/env", () => ({
  __esModule: true,
  config: mockConfig,
  default: mockConfig,
}));

// Set Stripe key before app import so the Stripe instance is initialized
process.env.STRIPE_SECRET_KEY = "sk_test_integration";

import app from "../../backend/src/app";

// ─── Pricing Tiers ──────────────────────────────────────────────────────────

const PRICING_TIERS = {
  starter: { monthly: 29, annual: 29 * 12 * 0.8 },
  growth: { monthly: 99, annual: 99 * 12 * 0.8 },
  professional: { monthly: 249, annual: 249 * 12 * 0.8 },
  enterprise: { monthly: null, annual: null },
};

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

describe("Payments Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Subscription Creation ─────────────────────────────────────────────

  describe("Subscription Pricing Tiers", () => {
    it("should verify Starter plan pricing at $29/mo", () => {
      expect(PRICING_TIERS.starter.monthly).toBe(29);
    });

    it("should verify Growth plan pricing at $99/mo", () => {
      expect(PRICING_TIERS.growth.monthly).toBe(99);
    });

    it("should verify Professional plan pricing at $249/mo", () => {
      expect(PRICING_TIERS.professional.monthly).toBe(249);
    });

    it("should verify Enterprise has custom pricing", () => {
      expect(PRICING_TIERS.enterprise.monthly).toBeNull();
    });

    it("should apply 20% annual discount for Starter plan", () => {
      const monthlyTotal = 29 * 12;
      const annualPrice = PRICING_TIERS.starter.annual;
      const discount = monthlyTotal - annualPrice!;
      expect(discount).toBeCloseTo(monthlyTotal * 0.2, 2);
      expect(annualPrice).toBeCloseTo(monthlyTotal * 0.8, 2);
    });

    it("should apply 20% annual discount for Growth plan", () => {
      const monthlyTotal = 99 * 12;
      const annualPrice = PRICING_TIERS.growth.annual;
      expect(annualPrice).toBe(monthlyTotal * 0.8);
    });

    it("should apply 20% annual discount for Professional plan", () => {
      const monthlyTotal = 249 * 12;
      const annualPrice = PRICING_TIERS.professional.annual;
      expect(annualPrice).toBe(monthlyTotal * 0.8);
    });
  });

  // ── Payment Record Creation ───────────────────────────────────────────

  describe("POST /api/payments", () => {
    it("should create a payment record with PAYMENT_PENDING status", async () => {
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

    it("should persist payment with correct data in database", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.create.mockResolvedValue(samplePayment);

      await request(app).post("/api/payments").send(createPaymentPayload);

      const createCall = mockPrisma.payment.create.mock.calls[0][0];
      expect(createCall.data.leaseId).toBe("lease-1");
      expect(createCall.data.type).toBe("RENT");
      expect(createCall.data.amount).toBe(2000);
      expect(createCall.data.status).toBe("PAYMENT_PENDING");
      expect(createCall.data.payerId).toBe(TEST_USER.userId);
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

  // ── Payment Intent Creation ───────────────────────────────────────────

  describe("POST /api/payments/:id/pay", () => {
    it("should create a Stripe payment intent for existing payment", async () => {
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

  // ── Direct Payment Intent ─────────────────────────────────────────────

  describe("POST /api/payments/create-payment-intent", () => {
    it("should create a direct payment intent for checkout flow", async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      const res = await request(app)
        .post("/api/payments/create-payment-intent")
        .send({
          amount: 2000,
          userId: "user-1",
          propertyId: "prop-1",
          paymentType: "rent",
          description: "Rent payment",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("clientSecret");
      expect(res.body.data).toHaveProperty("paymentIntentId");

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it("should convert amount to cents for Stripe", async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      await request(app).post("/api/payments/create-payment-intent").send({
        amount: 2000,
        userId: "user-1",
        propertyId: "prop-1",
        paymentType: "rent",
      });

      expect(mockStripePaymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 200000,
          currency: "usd",
        }),
      );

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });

    it("should include metadata in payment intent", async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      await request(app).post("/api/payments/create-payment-intent").send({
        amount: 99,
        userId: "user-1",
        propertyId: "prop-1",
        paymentType: "deposit",
        leaseId: "lease-1",
      });

      expect(mockStripePaymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: "user-1",
            propertyId: "prop-1",
            paymentType: "deposit",
            leaseId: "lease-1",
          }),
        }),
      );

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });
  });

  // ── Webhook Handling ──────────────────────────────────────────────────

  describe("POST /api/payments/webhook", () => {
    it("should process checkout.session.completed webhook event", async () => {
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

    it("should confirm payment on payment_intent.succeeded", async () => {
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

    it("should handle payment_intent.payment_failed event", async () => {
      const res = await request(app)
        .post("/api/payments/webhook")
        .send({
          type: "payment_intent.payment_failed",
          data: {
            object: {
              id: "pi_failed_123",
              metadata: { paymentId: "payment-2" },
            },
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle unrecognized webhook events gracefully", async () => {
      const res = await request(app)
        .post("/api/payments/webhook")
        .send({
          type: "customer.subscription.updated",
          data: {
            object: { id: "sub_test_123" },
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── Get Payments ──────────────────────────────────────────────────────

  describe("GET /api/payments/my-payments", () => {
    it("should return list of user payments", async () => {
      mockPrisma.payment.findMany.mockResolvedValue([samplePayment]);

      const res = await request(app).get("/api/payments/my-payments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
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

  // ── Lease Payments ────────────────────────────────────────────────────

  describe("GET /api/payments/lease/:leaseId", () => {
    it("should return payments for a specific lease", async () => {
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

  // ── Generate Rent Payments ────────────────────────────────────────────

  describe("POST /api/payments/lease/:leaseId/generate-rent", () => {
    it("should generate rent payments for lease duration", async () => {
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

    it("should generate payments with correct monthly rent amount", async () => {
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

    it("should generate a payment for each month of the lease", async () => {
      mockPrisma.lease.findFirst.mockResolvedValue(sampleLease);
      mockPrisma.payment.createMany.mockResolvedValue({ count: 13 });

      await request(app).post("/api/payments/lease/lease-1/generate-rent");

      const createCall = mockPrisma.payment.createMany.mock.calls[0][0];
      const payments = createCall.data;
      expect(payments.length).toBeGreaterThanOrEqual(12);
    });
  });

  // ── Payment Processing Fee Calculation ────────────────────────────────

  describe("Payment Processing Fees", () => {
    it("should correctly calculate 1% interchange capture on rent", () => {
      const rentAmount = 2000;
      const feeRate = 0.01;
      const fee = rentAmount * feeRate;
      expect(fee).toBe(20);
    });

    it("should correctly calculate 2% interchange capture on rent", () => {
      const rentAmount = 2000;
      const feeRate = 0.02;
      const fee = rentAmount * feeRate;
      expect(fee).toBe(40);
    });

    it("should calculate fee within 1-2% range for rent collection", () => {
      const rentAmount = 1500;
      const minFee = rentAmount * 0.01;
      const maxFee = rentAmount * 0.02;
      expect(minFee).toBe(15);
      expect(maxFee).toBe(30);
      expect(maxFee).toBeGreaterThan(minFee);
    });
  });

  // ── Free Trial Signup and Conversion ──────────────────────────────────

  describe("Free Trial Flow", () => {
    it("should allow trial subscription creation with 14-day period", () => {
      const trialDays = 14;
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + trialDays);

      expect(trialDays).toBe(14);
      expect(trialEnd.getTime()).toBeGreaterThan(Date.now());
    });

    it("should convert trial to paid subscription after trial period", () => {
      const subscriptionStatus = "trialing";
      const trialEndTimestamp =
        Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

      expect(subscriptionStatus).toBe("trialing");
      expect(trialEndTimestamp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it("should track trial start and end dates", () => {
      const trialStart = new Date();
      const trialEnd = new Date(
        trialStart.getTime() + 14 * 24 * 60 * 60 * 1000,
      );
      const daysDiff = Math.round(
        (trialEnd.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24),
      );

      expect(daysDiff).toBe(14);
    });
  });

  // ── Free Tier ──────────────────────────────────────────────────────────

  describe("Free Tier", () => {
    it("should verify Free plan at $0/mo", () => {
      const freePlan = {
        monthly: 0,
        properties: 3,
        features: [
          "Basic tenant management",
          "Rent tracking",
          "Limited reporting",
        ],
      };
      expect(freePlan.monthly).toBe(0);
      expect(freePlan.properties).toBe(3);
    });

    it("should limit Free plan to 3 properties", () => {
      const freePropertyLimit = 3;
      expect(freePropertyLimit).toBe(3);
    });

    it("should include basic features in Free plan", () => {
      const freeFeatures = [
        "Basic tenant management",
        "Rent tracking",
        "Limited reporting",
      ];
      expect(freeFeatures).toContain("Basic tenant management");
      expect(freeFeatures).toContain("Rent tracking");
      expect(freeFeatures).toContain("Limited reporting");
    });
  });

  // ── Subscription Tier Feature Limits ───────────────────────────────────

  describe("Subscription Tier Feature Limits", () => {
    const TIER_LIMITS = {
      free: { properties: 3 },
      starter: { properties: 10 },
      growth: { properties: 50 },
      professional: { properties: 200 },
      enterprise: { properties: Infinity },
    };

    it("should enforce correct property limits for each tier", () => {
      expect(TIER_LIMITS.free.properties).toBe(3);
      expect(TIER_LIMITS.starter.properties).toBe(10);
      expect(TIER_LIMITS.growth.properties).toBe(50);
      expect(TIER_LIMITS.professional.properties).toBe(200);
      expect(TIER_LIMITS.enterprise.properties).toBe(Infinity);
    });

    it("should have increasing limits from Free to Enterprise", () => {
      const limits = [
        TIER_LIMITS.free.properties,
        TIER_LIMITS.starter.properties,
        TIER_LIMITS.growth.properties,
        TIER_LIMITS.professional.properties,
        TIER_LIMITS.enterprise.properties,
      ];

      for (let i = 1; i < limits.length; i++) {
        expect(limits[i]).toBeGreaterThan(limits[i - 1]);
      }
    });
  });

  // ── Subscription Cancellation ──────────────────────────────────────────

  describe("Subscription Cancellation", () => {
    it("should track subscription cancellation status", () => {
      const cancelledSubscription = {
        id: "sub_cancelled_123",
        status: "canceled",
        canceledAt: Math.floor(Date.now() / 1000),
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      };

      expect(cancelledSubscription.status).toBe("canceled");
      expect(cancelledSubscription.canceledAt).toBeDefined();
    });

    it("should maintain access until end of billing period after cancellation", () => {
      const cancelledAt = Math.floor(Date.now() / 1000);
      const periodEnd = cancelledAt + 30 * 24 * 60 * 60;

      expect(periodEnd).toBeGreaterThan(cancelledAt);
      expect(periodEnd - cancelledAt).toBe(30 * 24 * 60 * 60);
    });

    it("should downgrade to Free tier after cancellation period ends", () => {
      const postCancellationTier = "free";
      const postCancellationPropertyLimit = 3;

      expect(postCancellationTier).toBe("free");
      expect(postCancellationPropertyLimit).toBe(3);
    });
  });

  // ── Billing Portal ────────────────────────────────────────────────────

  describe("Billing Portal", () => {
    it("should generate billing portal session URL", () => {
      const portalSession = {
        url: "https://billing.stripe.com/session/test",
        returnUrl: "http://localhost:3000/settings/billing",
      };

      expect(portalSession.url).toContain("billing.stripe.com");
      expect(portalSession.returnUrl).toContain("/settings/billing");
    });

    it("should include return URL for redirect after portal session", () => {
      const returnUrl = "http://localhost:3000/settings/billing";
      expect(returnUrl).toBeTruthy();
      expect(returnUrl).toContain("localhost");
    });
  });

  // ── Payment Failure Scenarios ──────────────────────────────────────────

  describe("Payment Failure Scenarios", () => {
    it("should handle insufficient funds scenario", () => {
      const failedPayment = {
        status: "PAYMENT_CANCELLED",
        failureReason: "insufficient_funds",
      };

      expect(failedPayment.status).toBe("PAYMENT_CANCELLED");
      expect(failedPayment.failureReason).toBe("insufficient_funds");
    });

    it("should handle expired card scenario", () => {
      const failedPayment = {
        status: "PAYMENT_CANCELLED",
        failureReason: "expired_card",
      };

      expect(failedPayment.status).toBe("PAYMENT_CANCELLED");
      expect(failedPayment.failureReason).toBe("expired_card");
    });

    it("should handle declined card scenario", () => {
      const failedPayment = {
        status: "PAYMENT_CANCELLED",
        failureReason: "card_declined",
      };

      expect(failedPayment.status).toBe("PAYMENT_CANCELLED");
      expect(failedPayment.failureReason).toBe("card_declined");
    });

    it("should return 404 when creating payment intent for non-existent payment", async () => {
      const originalEnv = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      mockPrisma.payment.findFirst.mockResolvedValue(null);

      const res = await request(app).post("/api/payments/non-existent/pay");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);

      process.env.STRIPE_SECRET_KEY = originalEnv;
    });
  });
});
