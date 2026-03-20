import request from "supertest";

// ─── Mock Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../../config/database", () => mockPrisma);

// ─── Mock Stripe ────────────────────────────────────────────────────────────

const mockStripeCustomerCreate = jest
  .fn()
  .mockResolvedValue({ id: "cus_test_123" });
const mockStripeSubscriptionCreate = jest
  .fn()
  .mockResolvedValue({ id: "sub_test_123" });
const mockStripeSubscriptionCancel = jest
  .fn()
  .mockResolvedValue({ id: "sub_test_123", status: "canceled" });
const mockStripeSubscriptionRetrieve = jest
  .fn()
  .mockResolvedValue({ id: "sub_test_123", status: "active" });
const mockStripeInvoiceList = jest.fn().mockResolvedValue({
  data: [
    {
      id: "inv_test_1",
      created: 1700000000,
      amount_paid: 12500,
      currency: "usd",
      status: "paid",
      invoice_pdf: "https://stripe.com/inv.pdf",
      description: "Growth Plan - Monthly",
    },
  ],
});
const mockStripeInvoicePreview = jest.fn().mockResolvedValue({
  amount_due: 12500,
  currency: "usd",
  period_start: 1700000000,
  period_end: 1702592000,
  lines: {
    data: [{ description: "Growth Plan", amount: 12500 }],
  },
});
const mockStripeCheckoutCreate = jest
  .fn()
  .mockResolvedValue({ id: "cs_test_123" });
const mockStripePaymentIntentCreate = jest.fn().mockResolvedValue({
  id: "pi_test_123",
  client_secret: "pi_test_123_secret_abc",
});
const mockStripePaymentIntentRetrieve = jest.fn().mockResolvedValue({
  id: "pi_test_123",
  amount: 200000,
  currency: "usd",
  status: "succeeded",
  metadata: { userId: "user-1" },
});
const mockConstructEvent = jest.fn().mockReturnValue({
  type: "payment_intent.succeeded",
  data: { object: { id: "pi_test_123" } },
});

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    customers: { create: mockStripeCustomerCreate },
    subscriptions: {
      create: mockStripeSubscriptionCreate,
      cancel: mockStripeSubscriptionCancel,
      retrieve: mockStripeSubscriptionRetrieve,
    },
    invoices: {
      list: mockStripeInvoiceList,
      createPreview: mockStripeInvoicePreview,
    },
    checkout: { sessions: { create: mockStripeCheckoutCreate } },
    paymentIntents: {
      create: mockStripePaymentIntentCreate,
      retrieve: mockStripePaymentIntentRetrieve,
    },
    webhooks: { constructEvent: mockConstructEvent },
  }));
});

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

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

jest.mock("../../middleware/rateLimiter", () => ({
  rateLimiter: (
    _req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => next(),
}));

jest.mock("../../middleware/validation", () => ({
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
  stripe: {
    secretKey: "sk_test_123",
    webhookSecret: "whsec_test_123",
    publishableKey: "pk_test_123",
  },
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

// Set STRIPE_SECRET_KEY so the billing service initializes its Stripe client
process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123";
process.env.STRIPE_PRICE_ID_GROWTH = "price_growth_monthly";
process.env.STRIPE_PRICE_ID_GROWTH_ANNUAL = "price_growth_annual";
process.env.STRIPE_PRICE_ID_PROFESSIONAL = "price_pro_monthly";
process.env.STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL = "price_pro_annual";

import app from "../../app";

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Billing API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── POST /api/billing/create-customer ─────────────────────────────────

  describe("POST /api/billing/create-customer", () => {
    it("should return 201 and create a Stripe customer", async () => {
      const res = await request(app)
        .post("/api/billing/create-customer")
        .send({ email: "test@example.com", name: "Test User" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("customerId", "cus_test_123");
      expect(res.body.message).toBe("Customer created");
    });

    it("should return 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/billing/create-customer")
        .send({ name: "Test User" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/billing/create-customer")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should call Stripe with correct parameters", async () => {
      await request(app)
        .post("/api/billing/create-customer")
        .send({ email: "test@example.com", name: "Test User" });

      expect(mockStripeCustomerCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
      });
    });
  });

  // ── POST /api/billing/create-subscription ─────────────────────────────

  describe("POST /api/billing/create-subscription", () => {
    it("should return 201 and create a subscription", async () => {
      const res = await request(app)
        .post("/api/billing/create-subscription")
        .send({
          customerId: "cus_test_123",
          plan: "GROWTH",
          interval: "monthly",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("subscriptionId", "sub_test_123");
    });

    it("should return 400 when customerId is missing", async () => {
      const res = await request(app)
        .post("/api/billing/create-subscription")
        .send({ plan: "GROWTH" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for free plans", async () => {
      const res = await request(app)
        .post("/api/billing/create-subscription")
        .send({ customerId: "cus_test_123", plan: "FREE" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for STARTER plan", async () => {
      const res = await request(app)
        .post("/api/billing/create-subscription")
        .send({ customerId: "cus_test_123", plan: "STARTER" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should include 14-day trial", async () => {
      await request(app).post("/api/billing/create-subscription").send({
        customerId: "cus_test_123",
        plan: "GROWTH",
        interval: "monthly",
      });

      expect(mockStripeSubscriptionCreate).toHaveBeenCalledWith(
        expect.objectContaining({ trial_period_days: 14 }),
      );
    });

    it("should include payment method when provided", async () => {
      await request(app).post("/api/billing/create-subscription").send({
        customerId: "cus_test_123",
        plan: "GROWTH",
        interval: "monthly",
        paymentMethodId: "pm_test_123",
      });

      expect(mockStripeSubscriptionCreate).toHaveBeenCalledWith(
        expect.objectContaining({ default_payment_method: "pm_test_123" }),
      );
    });

    it("should default interval to monthly", async () => {
      await request(app)
        .post("/api/billing/create-subscription")
        .send({ customerId: "cus_test_123", plan: "GROWTH" });

      expect(mockStripeSubscriptionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [{ price: "price_growth_monthly" }],
        }),
      );
    });
  });

  // ── POST /api/billing/cancel-subscription ─────────────────────────────

  describe("POST /api/billing/cancel-subscription", () => {
    it("should return 200 and cancel subscription", async () => {
      const res = await request(app)
        .post("/api/billing/cancel-subscription")
        .send({ subscriptionId: "sub_test_123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockStripeSubscriptionCancel).toHaveBeenCalledWith("sub_test_123");
    });

    it("should return 400 when subscriptionId is missing", async () => {
      const res = await request(app)
        .post("/api/billing/cancel-subscription")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/billing/invoices ─────────────────────────────────────────

  describe("GET /api/billing/invoices", () => {
    it("should return 200 and invoice list", async () => {
      const res = await request(app)
        .get("/api/billing/invoices")
        .query({ customerId: "cus_test_123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty("id", "inv_test_1");
      expect(res.body.data[0]).toHaveProperty("amount_paid", 12500);
    });

    it("should return 400 when customerId is missing", async () => {
      const res = await request(app).get("/api/billing/invoices");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/billing/create-checkout-session ─────────────────────────

  describe("POST /api/billing/create-checkout-session", () => {
    it("should return 201 and create checkout session", async () => {
      const res = await request(app)
        .post("/api/billing/create-checkout-session")
        .send({
          priceId: "price_growth_monthly",
          customerId: "cus_test_123",
          successUrl: "https://app.test/success",
          cancelUrl: "https://app.test/cancel",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("sessionId", "cs_test_123");
    });

    it("should return 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/billing/create-checkout-session")
        .send({ priceId: "price_growth_monthly" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/billing/subscription-status/:subscriptionId ──────────────

  describe("GET /api/billing/subscription-status/:subscriptionId", () => {
    it("should return 200 and subscription status", async () => {
      const res = await request(app).get(
        "/api/billing/subscription-status/sub_test_123",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("status", "active");
    });
  });

  // ── GET /api/billing/upcoming-invoice/:subscriptionId ─────────────────

  describe("GET /api/billing/upcoming-invoice/:subscriptionId", () => {
    it("should return 200 and upcoming invoice", async () => {
      const res = await request(app).get(
        "/api/billing/upcoming-invoice/sub_test_123",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("amount_due", 12500);
      expect(res.body.data).toHaveProperty("currency", "usd");
      expect(res.body.data.lines).toHaveLength(1);
    });
  });

  // ── POST /api/billing/create-payment-intent ───────────────────────────

  describe("POST /api/billing/create-payment-intent", () => {
    it("should return 201 and create payment intent", async () => {
      const res = await request(app)
        .post("/api/billing/create-payment-intent")
        .send({ amount: 2000, currency: "usd", metadata: { userId: "u1" } });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty(
        "clientSecret",
        "pi_test_123_secret_abc",
      );
    });

    it("should return 400 when amount is missing", async () => {
      const res = await request(app)
        .post("/api/billing/create-payment-intent")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should convert amount to cents", async () => {
      await request(app)
        .post("/api/billing/create-payment-intent")
        .send({ amount: 125.5 });

      expect(mockStripePaymentIntentCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 12550 }),
      );
    });

    it("should default currency to usd", async () => {
      await request(app)
        .post("/api/billing/create-payment-intent")
        .send({ amount: 100 });

      expect(mockStripePaymentIntentCreate).toHaveBeenCalledWith(
        expect.objectContaining({ currency: "usd" }),
      );
    });
  });

  // ── GET /api/billing/payment-intent/:paymentIntentId ──────────────────

  describe("GET /api/billing/payment-intent/:paymentIntentId", () => {
    it("should return 200 and payment intent details", async () => {
      const res = await request(app).get(
        "/api/billing/payment-intent/pi_test_123",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id", "pi_test_123");
      expect(res.body.data).toHaveProperty("amount", 200000);
      expect(res.body.data).toHaveProperty("status", "succeeded");
    });
  });

  // ── POST /api/billing/webhook ─────────────────────────────────────────

  describe("POST /api/billing/webhook", () => {
    it("should return 400 when signature is missing", async () => {
      const res = await request(app)
        .post("/api/billing/webhook")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ type: "test" }));

      expect(res.status).toBe(400);
    });

    it("should return 200 when signature is valid", async () => {
      const res = await request(app)
        .post("/api/billing/webhook")
        .set("Content-Type", "application/json")
        .set("stripe-signature", "t=123,v1=abc")
        .send(JSON.stringify({ type: "payment_intent.succeeded" }));

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── Security: Secret key not exposed ──────────────────────────────────

  describe("Security", () => {
    it("should never include secret key in API responses", async () => {
      const res = await request(app)
        .post("/api/billing/create-customer")
        .send({ email: "test@example.com", name: "Test User" });

      const body = JSON.stringify(res.body);
      expect(body).not.toContain("sk_test");
      expect(body).not.toContain("sk_live");
      expect(body).not.toContain("STRIPE_SECRET_KEY");
    });

    it("should never include webhook secret in API responses", async () => {
      const res = await request(app)
        .get("/api/billing/invoices")
        .query({ customerId: "cus_test_123" });

      const body = JSON.stringify(res.body);
      expect(body).not.toContain("whsec_");
      expect(body).not.toContain("STRIPE_WEBHOOK_SECRET");
    });
  });
});
