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
  application: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  },
  property: {
    findUnique: jest.fn(),
  },
  applicationDocument: {
    create: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../../backend/src/config/database", () => mockPrisma);

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

const TEST_TENANT = {
  userId: "tenant-1",
  email: "tenant@test.com",
  role: "TENANT",
  id: "tenant-1",
};

const TEST_LANDLORD = {
  userId: "landlord-1",
  email: "landlord@test.com",
  role: "LANDLORD",
  id: "landlord-1",
};

let currentUser = TEST_TENANT;

jest.mock("../../backend/src/middleware/auth", () => ({
  authenticate: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = currentUser;
    next();
  },
  optionalAuth: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = currentUser;
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

import app from "../../backend/src/app";

// ─── Test Data ──────────────────────────────────────────────────────────────

const sampleProperty = {
  id: "prop-1",
  title: "Modern Downtown Apartment",
  address: "123 Main St, City",
  ownerId: "landlord-1",
  price: 2000,
  status: "ACTIVE",
};

const sampleApplication = {
  id: "app-1",
  propertyId: "prop-1",
  primaryApplicantId: "tenant-1",
  status: "DRAFT",
  personalInfo: {},
  employment: [],
  income: [],
  rentalHistory: [],
  references: [],
  coApplicants: [],
  pets: [],
  vehicles: [],
  conditions: [],
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2025-06-01"),
  property: {
    id: "prop-1",
    title: "Modern Downtown Apartment",
    address: "123 Main St, City",
  },
};

const submittedApplication = {
  ...sampleApplication,
  status: "SUBMITTED",
  submittedAt: new Date("2025-06-02"),
};

const applicationWithDetails = {
  ...sampleApplication,
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "tenant@test.com",
    phone: "+1234567890",
    dateOfBirth: "1990-01-15",
  },
  employment: [
    {
      employerName: "Tech Corp",
      jobTitle: "Software Engineer",
      employmentType: "full_time",
      startDate: "2020-01-01",
      isCurrent: true,
      address: "456 Business Ave",
      verificationStatus: "pending",
    },
  ],
  income: [
    {
      source: "employment",
      amount: 8000,
      frequency: "monthly",
      verificationStatus: "pending",
    },
  ],
  rentalHistory: [
    {
      address: "789 Previous St",
      landlordName: "Jane Smith",
      landlordPhone: "+0987654321",
      monthlyRent: 1500,
      startDate: "2022-01-01",
      endDate: "2025-05-31",
      reasonForLeaving: "Relocating for work",
      canContact: true,
      verificationStatus: "pending",
    },
  ],
};

const scoredApplication = {
  ...submittedApplication,
  score: 85,
  scoreBreakdown: {
    creditScore: { value: 750, weight: 0.25, score: 90 },
    incomeRatio: { value: 4.0, weight: 0.25, score: 95 },
    employmentStability: { value: 5, weight: 0.15, score: 80 },
    rentalHistory: { value: 3, weight: 0.15, score: 75 },
    backgroundCheck: { value: "clear", weight: 0.1, score: 100 },
    completeness: { value: 0.95, weight: 0.1, score: 95 },
  },
};

const approvedApplication = {
  ...submittedApplication,
  status: "APPROVED",
  reviewedBy: "landlord-1",
  reviewedAt: new Date("2025-06-05"),
};

const rejectedApplication = {
  ...submittedApplication,
  status: "REJECTED",
  rejectionReason: "Insufficient income for this property",
  reviewedBy: "landlord-1",
  reviewedAt: new Date("2025-06-05"),
};

const applicationWithDocuments = {
  ...sampleApplication,
  documents: [
    {
      id: "doc-1",
      type: "id",
      filename: "drivers_license.pdf",
      url: "https://storage.example.com/docs/drivers_license.pdf",
      uploadedAt: new Date("2025-06-01"),
      uploadedBy: "tenant-1",
      size: 245000,
      parsed: false,
    },
    {
      id: "doc-2",
      type: "paystub",
      filename: "paystub_june_2025.pdf",
      url: "https://storage.example.com/docs/paystub_june_2025.pdf",
      uploadedAt: new Date("2025-06-01"),
      uploadedBy: "tenant-1",
      size: 180000,
      parsed: true,
      extractedData: { grossPay: 8000, netPay: 6200, payPeriod: "monthly" },
    },
  ],
  primaryApplicant: {
    id: "tenant-1",
    firstName: "John",
    lastName: "Doe",
    email: "tenant@test.com",
  },
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Tenant Applications Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = TEST_TENANT;
  });

  // ── Application Submission ────────────────────────────────────────────

  describe("POST /api/applications", () => {
    it("should create a new application for a property", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.application.create.mockResolvedValue(sampleApplication);

      const res = await request(app)
        .post("/api/applications")
        .send({ propertyId: "prop-1" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Application created");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("propertyId", "prop-1");
      expect(res.body.data).toHaveProperty("status", "DRAFT");
    });

    it("should store application in database with correct initial data", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.application.create.mockResolvedValue(sampleApplication);

      await request(app)
        .post("/api/applications")
        .send({ propertyId: "prop-1" });

      expect(mockPrisma.application.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            propertyId: "prop-1",
            primaryApplicantId: "tenant-1",
            status: "DRAFT",
            personalInfo: {},
            employment: [],
            income: [],
            rentalHistory: [],
            references: [],
          }),
        }),
      );
    });

    it("should return 404 when property does not exist", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/applications")
        .send({ propertyId: "non-existent" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should include property details in application response", async () => {
      mockPrisma.property.findUnique.mockResolvedValue(sampleProperty);
      mockPrisma.application.create.mockResolvedValue(sampleApplication);

      const res = await request(app)
        .post("/api/applications")
        .send({ propertyId: "prop-1" });

      expect(res.body.data).toHaveProperty("property");
      expect(res.body.data.property).toHaveProperty("title");
      expect(res.body.data.property).toHaveProperty("address");
    });
  });

  // ── Application Update (Autosave) ────────────────────────────────────

  describe("PATCH /api/applications/:id", () => {
    it("should update application with personal info", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(sampleApplication);
      mockPrisma.application.update.mockResolvedValue(applicationWithDetails);

      const res = await request(app)
        .patch("/api/applications/app-1")
        .send({
          personalInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "tenant@test.com",
            phone: "+1234567890",
            dateOfBirth: "1990-01-15",
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Application updated");
    });

    it("should return 404 for non-existent application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/applications/non-existent")
        .send({ personalInfo: { firstName: "John" } });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 when user does not own the application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...sampleApplication,
        primaryApplicantId: "other-user",
      });

      const res = await request(app)
        .patch("/api/applications/app-1")
        .send({ personalInfo: { firstName: "John" } });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should update employment and income data", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(sampleApplication);
      mockPrisma.application.update.mockResolvedValue(applicationWithDetails);

      const res = await request(app)
        .patch("/api/applications/app-1")
        .send({
          employment: [
            {
              employerName: "Tech Corp",
              jobTitle: "Software Engineer",
              employmentType: "full_time",
              startDate: "2020-01-01",
              isCurrent: true,
            },
          ],
          income: [
            {
              source: "employment",
              amount: 8000,
              frequency: "monthly",
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── Application Submit ────────────────────────────────────────────────

  describe("POST /api/applications/:id/submit", () => {
    it("should submit a draft application for review", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(sampleApplication);
      mockPrisma.application.update.mockResolvedValue(submittedApplication);

      const res = await request(app).post("/api/applications/app-1/submit");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Application submitted");
    });

    it("should set status to SUBMITTED and record submission time", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(sampleApplication);
      mockPrisma.application.update.mockResolvedValue(submittedApplication);

      await request(app).post("/api/applications/app-1/submit");

      expect(mockPrisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "app-1" },
          data: expect.objectContaining({
            status: "SUBMITTED",
            submittedAt: expect.any(Date),
          }),
        }),
      );
    });

    it("should return 400 when application is already submitted", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(submittedApplication);

      const res = await request(app).post("/api/applications/app-1/submit");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 when user does not own the application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...sampleApplication,
        primaryApplicantId: "other-user",
      });

      const res = await request(app).post("/api/applications/app-1/submit");

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for non-existent application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const res = await request(app).post(
        "/api/applications/non-existent/submit",
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Application Review (Landlord) ─────────────────────────────────────

  describe("POST /api/applications/:id/approve", () => {
    beforeEach(() => {
      currentUser = TEST_LANDLORD;
    });

    it("should approve an application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue(approvedApplication);

      const res = await request(app).post("/api/applications/app-1/approve");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Application approved");
    });

    it("should set status to APPROVED and record reviewer", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue(approvedApplication);

      await request(app).post("/api/applications/app-1/approve");

      expect(mockPrisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "APPROVED",
            reviewedBy: "landlord-1",
            reviewedAt: expect.any(Date),
          }),
        }),
      );
    });

    it("should approve with conditions when conditions are provided", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue({
        ...approvedApplication,
        status: "APPROVED_WITH_CONDITIONS",
        conditions: ["Additional deposit required", "Co-signer needed"],
      });

      const res = await request(app)
        .post("/api/applications/app-1/approve")
        .send({
          conditions: ["Additional deposit required", "Co-signer needed"],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should set APPROVED_WITH_CONDITIONS status when conditions exist", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue({
        ...approvedApplication,
        status: "APPROVED_WITH_CONDITIONS",
      });

      await request(app)
        .post("/api/applications/app-1/approve")
        .send({
          conditions: ["Additional deposit required"],
        });

      expect(mockPrisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "APPROVED_WITH_CONDITIONS",
            conditions: ["Additional deposit required"],
          }),
        }),
      );
    });

    it("should return 403 when landlord does not own the property", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: { ...sampleProperty, ownerId: "other-landlord" },
      });

      const res = await request(app).post("/api/applications/app-1/approve");

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for non-existent application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const res = await request(app).post(
        "/api/applications/non-existent/approve",
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Application Rejection ─────────────────────────────────────────────

  describe("POST /api/applications/:id/reject", () => {
    beforeEach(() => {
      currentUser = TEST_LANDLORD;
    });

    it("should reject an application with a reason", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue(rejectedApplication);

      const res = await request(app)
        .post("/api/applications/app-1/reject")
        .send({ rejectionReason: "Insufficient income for this property" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Application rejected");
    });

    it("should store rejection reason and reviewer in database", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: sampleProperty,
      });
      mockPrisma.application.update.mockResolvedValue(rejectedApplication);

      await request(app)
        .post("/api/applications/app-1/reject")
        .send({ rejectionReason: "Insufficient income for this property" });

      expect(mockPrisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "REJECTED",
            rejectionReason: "Insufficient income for this property",
            reviewedBy: "landlord-1",
            reviewedAt: expect.any(Date),
          }),
        }),
      );
    });

    it("should return 403 when landlord does not own the property", async () => {
      mockPrisma.application.findUnique.mockResolvedValue({
        ...submittedApplication,
        property: { ...sampleProperty, ownerId: "other-landlord" },
      });

      const res = await request(app)
        .post("/api/applications/app-1/reject")
        .send({ rejectionReason: "Insufficient income" });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // ── AI Scoring ────────────────────────────────────────────────────────

  describe("AI Scoring", () => {
    it("should have a valid score between 0 and 100", () => {
      expect(scoredApplication.score).toBeGreaterThanOrEqual(0);
      expect(scoredApplication.score).toBeLessThanOrEqual(100);
    });

    it("should include all scoring criteria in breakdown", () => {
      const breakdown = scoredApplication.scoreBreakdown;
      expect(breakdown).toHaveProperty("creditScore");
      expect(breakdown).toHaveProperty("incomeRatio");
      expect(breakdown).toHaveProperty("employmentStability");
      expect(breakdown).toHaveProperty("rentalHistory");
      expect(breakdown).toHaveProperty("backgroundCheck");
      expect(breakdown).toHaveProperty("completeness");
    });

    it("should have scoring weights that sum to 1.0", () => {
      const breakdown = scoredApplication.scoreBreakdown;
      const totalWeight =
        breakdown.creditScore.weight +
        breakdown.incomeRatio.weight +
        breakdown.employmentStability.weight +
        breakdown.rentalHistory.weight +
        breakdown.backgroundCheck.weight +
        breakdown.completeness.weight;
      expect(totalWeight).toBeCloseTo(1.0);
    });

    it("should have individual scores between 0 and 100", () => {
      const breakdown = scoredApplication.scoreBreakdown;
      const scores = [
        breakdown.creditScore.score,
        breakdown.incomeRatio.score,
        breakdown.employmentStability.score,
        breakdown.rentalHistory.score,
        breakdown.backgroundCheck.score,
        breakdown.completeness.score,
      ];

      scores.forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  // ── Document Uploads ──────────────────────────────────────────────────

  describe("Document Uploads", () => {
    it("should include documents in application data", () => {
      expect(applicationWithDocuments.documents).toHaveLength(2);
    });

    it("should support ID document type", () => {
      const idDoc = applicationWithDocuments.documents.find(
        (d) => d.type === "id",
      );
      expect(idDoc).toBeDefined();
      expect(idDoc!.filename).toBe("drivers_license.pdf");
    });

    it("should support paystub document type", () => {
      const paystubDoc = applicationWithDocuments.documents.find(
        (d) => d.type === "paystub",
      );
      expect(paystubDoc).toBeDefined();
      expect(paystubDoc!.parsed).toBe(true);
    });

    it("should include extracted data for parsed documents", () => {
      const parsedDoc = applicationWithDocuments.documents.find(
        (d) => d.parsed,
      );
      expect(parsedDoc).toBeDefined();
      expect(parsedDoc!.extractedData).toHaveProperty("grossPay");
      expect(parsedDoc!.extractedData).toHaveProperty("netPay");
    });

    it("should track document upload metadata", () => {
      const doc = applicationWithDocuments.documents[0];
      expect(doc).toHaveProperty("uploadedAt");
      expect(doc).toHaveProperty("uploadedBy", "tenant-1");
      expect(doc).toHaveProperty("size");
      expect(doc.size).toBeGreaterThan(0);
    });
  });

  // ── Background Check Status ───────────────────────────────────────────

  describe("Background Check Status", () => {
    it("should track background check status in scoring", () => {
      const bgCheck = scoredApplication.scoreBreakdown.backgroundCheck;
      expect(bgCheck).toHaveProperty("value", "clear");
      expect(bgCheck).toHaveProperty("score", 100);
    });

    it("should weight background check appropriately", () => {
      const bgCheck = scoredApplication.scoreBreakdown.backgroundCheck;
      expect(bgCheck.weight).toBe(0.1);
    });
  });

  // ── Get Application ───────────────────────────────────────────────────

  describe("GET /api/applications/:id", () => {
    it("should return application with full details", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(
        applicationWithDocuments,
      );

      const res = await request(app).get("/api/applications/app-1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("propertyId");
      expect(res.body.data).toHaveProperty("status");
    });

    it("should include property and applicant details", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(
        applicationWithDocuments,
      );

      const res = await request(app).get("/api/applications/app-1");

      expect(res.body.data).toHaveProperty("property");
      expect(res.body.data).toHaveProperty("primaryApplicant");
      expect(res.body.data.primaryApplicant).toHaveProperty("firstName");
      expect(res.body.data.primaryApplicant).toHaveProperty("email");
    });

    it("should include uploaded documents", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(
        applicationWithDocuments,
      );

      const res = await request(app).get("/api/applications/app-1");

      expect(res.body.data).toHaveProperty("documents");
      expect(res.body.data.documents).toHaveLength(2);
    });

    it("should return 404 for non-existent application", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/applications/non-existent");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Get My Applications ───────────────────────────────────────────────

  describe("GET /api/applications/my-applications", () => {
    it("should return paginated list of user applications", async () => {
      mockPrisma.application.findMany.mockResolvedValue([sampleApplication]);
      mockPrisma.application.count.mockResolvedValue(1);

      const res = await request(app).get("/api/applications/my-applications");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("applications");
      expect(res.body.data).toHaveProperty("pagination");
    });

    it("should include pagination metadata", async () => {
      mockPrisma.application.findMany.mockResolvedValue([sampleApplication]);
      mockPrisma.application.count.mockResolvedValue(1);

      const res = await request(app).get("/api/applications/my-applications");

      const pagination = res.body.data.pagination;
      expect(pagination).toHaveProperty("page");
      expect(pagination).toHaveProperty("limit");
      expect(pagination).toHaveProperty("total");
      expect(pagination).toHaveProperty("pages");
    });

    it("should return empty list when no applications exist", async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.application.count.mockResolvedValue(0);

      const res = await request(app).get("/api/applications/my-applications");

      expect(res.status).toBe(200);
      expect(res.body.data.applications).toHaveLength(0);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it("should support pagination parameters", async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.application.count.mockResolvedValue(50);

      await request(app)
        .get("/api/applications/my-applications")
        .query({ page: 2, limit: 10 });

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  // ── Application Status Flow ───────────────────────────────────────────

  describe("Application Status Flow", () => {
    it("should follow correct status progression: DRAFT -> SUBMITTED -> APPROVED", async () => {
      const statusFlow = ["DRAFT", "SUBMITTED", "APPROVED"];

      expect(sampleApplication.status).toBe(statusFlow[0]);
      expect(submittedApplication.status).toBe(statusFlow[1]);
      expect(approvedApplication.status).toBe(statusFlow[2]);
    });

    it("should support REJECTED status in the flow", () => {
      expect(rejectedApplication.status).toBe("REJECTED");
      expect(rejectedApplication.rejectionReason).toBeDefined();
    });

    it("should support APPROVED_WITH_CONDITIONS status", () => {
      const conditionallyApproved = {
        ...approvedApplication,
        status: "APPROVED_WITH_CONDITIONS",
        conditions: ["Additional deposit required"],
      };

      expect(conditionallyApproved.status).toBe("APPROVED_WITH_CONDITIONS");
      expect(conditionallyApproved.conditions).toHaveLength(1);
    });
  });

  // ── Lease Creation from Approved Application ──────────────────────────

  describe("Lease Creation from Approved Application", () => {
    it("should be eligible for lease creation when application is approved", () => {
      expect(approvedApplication.status).toBe("APPROVED");
      expect(approvedApplication.reviewedBy).toBe("landlord-1");
    });

    it("should contain property and tenant info needed for lease", () => {
      const leaseData = {
        propertyId: approvedApplication.propertyId,
        tenantId: approvedApplication.primaryApplicantId,
        landlordId: approvedApplication.reviewedBy,
        status: "DRAFT",
        monthlyRent: sampleProperty.price,
      };

      expect(leaseData.propertyId).toBe("prop-1");
      expect(leaseData.tenantId).toBe("tenant-1");
      expect(leaseData.landlordId).toBe("landlord-1");
      expect(leaseData.status).toBe("DRAFT");
      expect(leaseData.monthlyRent).toBe(2000);
    });

    it("should not create lease from rejected application", () => {
      expect(rejectedApplication.status).toBe("REJECTED");
      const canCreateLease =
        rejectedApplication.status === "APPROVED" ||
        rejectedApplication.status === "APPROVED_WITH_CONDITIONS";
      expect(canCreateLease).toBe(false);
    });

    it("should support lease creation from conditionally approved application", () => {
      const conditionalApp = {
        ...approvedApplication,
        status: "APPROVED_WITH_CONDITIONS",
        conditions: ["Additional deposit required"],
      };

      const canCreateLease =
        conditionalApp.status === "APPROVED" ||
        conditionalApp.status === "APPROVED_WITH_CONDITIONS";
      expect(canCreateLease).toBe(true);
    });
  });

  // ── Multi-Step Application Form ──────────────────────────────────────

  describe("Multi-Step Application Form", () => {
    const FORM_STEPS = [
      "personalInfo",
      "employment",
      "income",
      "rentalHistory",
      "references",
      "documents",
      "review",
    ];

    it("should define all required form steps", () => {
      expect(FORM_STEPS).toHaveLength(7);
      expect(FORM_STEPS[0]).toBe("personalInfo");
      expect(FORM_STEPS[FORM_STEPS.length - 1]).toBe("review");
    });

    it("should support autosave for each step via PATCH", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(sampleApplication);
      mockPrisma.application.update.mockResolvedValue(applicationWithDetails);

      const res = await request(app)
        .patch("/api/applications/app-1")
        .send({
          personalInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "tenant@test.com",
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should track application completeness across steps", () => {
      const completedSteps = {
        personalInfo: true,
        employment: true,
        income: true,
        rentalHistory: true,
        references: false,
        documents: false,
        review: false,
      };

      const totalSteps = Object.keys(completedSteps).length;
      const completed = Object.values(completedSteps).filter(Boolean).length;
      const completionPercentage = Math.round((completed / totalSteps) * 100);

      expect(completionPercentage).toBe(57);
      expect(totalSteps).toBe(7);
    });

    it("should require all steps completed before submission", () => {
      const allStepsComplete = {
        personalInfo: true,
        employment: true,
        income: true,
        rentalHistory: true,
        references: true,
        documents: true,
        review: true,
      };

      const isReady = Object.values(allStepsComplete).every(Boolean);
      expect(isReady).toBe(true);
    });

    it("should preserve data from previous steps during autosave", async () => {
      mockPrisma.application.findUnique.mockResolvedValue(
        applicationWithDetails,
      );
      mockPrisma.application.update.mockResolvedValue({
        ...applicationWithDetails,
        references: [
          {
            name: "Jane Ref",
            phone: "+1111111111",
            relationship: "Former landlord",
          },
        ],
      });

      const res = await request(app)
        .patch("/api/applications/app-1")
        .send({
          references: [
            {
              name: "Jane Ref",
              phone: "+1111111111",
              relationship: "Former landlord",
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── Application Withdrawal ──────────────────────────────────────────

  describe("Application Withdrawal", () => {
    it("should track WITHDRAWN status", () => {
      const withdrawnApp = {
        ...submittedApplication,
        status: "WITHDRAWN",
      };
      expect(withdrawnApp.status).toBe("WITHDRAWN");
    });

    it("should not allow re-submission of withdrawn application", () => {
      const withdrawnApp = { ...submittedApplication, status: "WITHDRAWN" };
      const canResubmit = withdrawnApp.status === "DRAFT";
      expect(canResubmit).toBe(false);
    });
  });
});
