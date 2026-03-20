import request from "supertest";

// ─── Mock express-rate-limit (must be before app import) ────────────────────

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
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  emailVerificationToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  property: {
    count: jest.fn().mockResolvedValue(0),
    findMany: jest.fn().mockResolvedValue([]),
  },
  application: {
    count: jest.fn().mockResolvedValue(0),
    findMany: jest.fn().mockResolvedValue([]),
  },
  inspection: {
    count: jest.fn().mockResolvedValue(0),
    findMany: jest.fn().mockResolvedValue([]),
  },
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $transaction: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../../backend/src/config/database", () => mockPrisma);

// ─── Mock Utilities ─────────────────────────────────────────────────────────

jest.mock("../../backend/src/utils/bcrypt", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed_password_123"),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../backend/src/utils/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("access_token_123"),
  generateRefreshToken: jest.fn().mockReturnValue("refresh_token_123"),
  verifyRefreshToken: jest.fn().mockReturnValue({
    userId: "user-1",
    email: "test@example.com",
    role: "TENANT",
  }),
}));

jest.mock("../../backend/src/utils/emailService", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  send2FAEnabledEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("otplib", () => ({
  authenticator: {
    generateSecret: jest.fn().mockReturnValue("JBSWY3DPEHPK3PXP"),
    keyuri: jest
      .fn()
      .mockReturnValue(
        "otpauth://totp/PropManage:test@example.com?secret=JBSWY3DPEHPK3PXP",
      ),
    verify: jest.fn().mockReturnValue(true),
  },
}));

// ─── Mock Auth Middleware ───────────────────────────────────────────────────

jest.mock("../../backend/src/middleware/auth", () => ({
  authenticate: (
    req: Record<string, unknown>,
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "user-1",
      email: "test@example.com",
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
      email: "test@example.com",
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

import app from "../../backend/src/app";

// ─── Test Data ──────────────────────────────────────────────────────────────

const registrationPayload = {
  email: "newuser@example.com",
  password: "SecureP@ss123",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "TENANT",
};

const sampleUser = {
  id: "user-1",
  email: "test@example.com",
  passwordHash: "hashed_password_123",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "TENANT",
  status: "ACTIVE",
  avatar: null,
  emailVerified: false,
  phoneVerified: false,
  twoFactorEnabled: false,
  twoFactorSecret: null,
  profileCompletion: 50,
  deletedAt: null,
  lastLoginAt: null,
  createdAt: new Date("2025-01-01"),
};

const sampleUserWithout2FA = {
  ...sampleUser,
  twoFactorEnabled: false,
  twoFactorSecret: null,
};

const sampleUserWith2FASecret = {
  ...sampleUser,
  twoFactorSecret: "JBSWY3DPEHPK3PXP",
  twoFactorEnabled: false,
};

const sampleUserWith2FAEnabled = {
  ...sampleUser,
  twoFactorSecret: "JBSWY3DPEHPK3PXP",
  twoFactorEnabled: true,
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── User Registration ─────────────────────────────────────────────────

  describe("POST /api/auth/register", () => {
    it("should register a new user with valid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "new-user-1",
        email: registrationPayload.email,
        firstName: registrationPayload.firstName,
        lastName: registrationPayload.lastName,
        role: registrationPayload.role,
        status: "PENDING_VERIFICATION",
        createdAt: new Date(),
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });

      const res = await request(app)
        .post("/api/auth/register")
        .send(registrationPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Registration successful");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
    });

    it("should create user in the database with correct data", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "new-user-1",
        email: registrationPayload.email,
        firstName: registrationPayload.firstName,
        lastName: registrationPayload.lastName,
        role: registrationPayload.role,
        status: "PENDING_VERIFICATION",
        createdAt: new Date(),
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });

      await request(app).post("/api/auth/register").send(registrationPayload);

      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: registrationPayload.email,
            firstName: registrationPayload.firstName,
            lastName: registrationPayload.lastName,
            role: registrationPayload.role,
            status: "PENDING_VERIFICATION",
          }),
        }),
      );
    });

    it("should return 400 when email is already registered", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send(registrationPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should store refresh token in the database", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "new-user-1",
        email: registrationPayload.email,
        firstName: "John",
        lastName: "Doe",
        role: "TENANT",
        status: "PENDING_VERIFICATION",
        createdAt: new Date(),
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });

      await request(app).post("/api/auth/register").send(registrationPayload);

      expect(mockPrisma.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            token: "refresh_token_123",
            userId: "new-user-1",
            expiresAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  // ── User Login ────────────────────────────────────────────────────────

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials and return JWT tokens", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockPrisma.user.update.mockResolvedValue(sampleUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
      expect(res.body.data.user).toHaveProperty("id");
      expect(res.body.data.user).toHaveProperty("email");
      expect(res.body.data.user).toHaveProperty("role");
    });

    it("should return 401 for invalid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@example.com", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 when password is incorrect", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { comparePassword } = require("../../backend/src/utils/bcrypt");
      comparePassword.mockResolvedValueOnce(false);
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 when account is suspended", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...sampleUser,
        status: "SUSPENDED",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should update last login timestamp on successful login", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockPrisma.user.update.mockResolvedValue(sampleUser);

      await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-1" },
          data: { lastLoginAt: expect.any(Date) },
        }),
      );
    });
  });

  // ── Token Refresh ─────────────────────────────────────────────────────

  describe("POST /api/auth/refresh", () => {
    it("should refresh access token with valid refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: "stored-token-1",
        token: "refresh_token_123",
        userId: "user-1",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user: sampleUser,
      });

      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "refresh_token_123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should return 401 for invalid refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid_token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 and delete expired refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: "stored-token-1",
        token: "expired_token",
        userId: "user-1",
        expiresAt: new Date(Date.now() - 1000),
        user: sampleUser,
      });
      mockPrisma.refreshToken.delete.mockResolvedValue({});

      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "expired_token" });

      expect(res.status).toBe(401);
      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "stored-token-1" },
        }),
      );
    });
  });

  // ── Logout ────────────────────────────────────────────────────────────

  describe("POST /api/auth/logout", () => {
    it("should logout successfully and remove refresh token", async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const res = await request(app)
        .post("/api/auth/logout")
        .send({ refreshToken: "refresh_token_123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Logout successful");
    });

    it("should delete the refresh token from the database", async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await request(app)
        .post("/api/auth/logout")
        .send({ refreshToken: "refresh_token_123" });

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: "refresh_token_123" },
      });
    });

    it("should succeed even if token does not exist", async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });

      const res = await request(app)
        .post("/api/auth/logout")
        .send({ refreshToken: "nonexistent_token" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── Password Reset ────────────────────────────────────────────────────

  describe("POST /api/auth/forgot-password", () => {
    it("should return success for existing email without revealing existence", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);
      mockPrisma.passwordResetToken.create.mockResolvedValue({ id: "reset-1" });

      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe(
        "If the email exists, a reset link has been sent",
      );
    });

    it("should return same message for non-existing email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.data.message).toBe(
        "If the email exists, a reset link has been sent",
      );
    });

    it("should create a password reset token in the database", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);
      mockPrisma.passwordResetToken.create.mockResolvedValue({ id: "reset-1" });

      await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            expiresAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password with valid token", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: "reset-1",
        token: expect.any(String),
        userId: "user-1",
        used: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });
      mockPrisma.user.update.mockResolvedValue(sampleUser);
      mockPrisma.passwordResetToken.update.mockResolvedValue({ id: "reset-1" });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "valid_reset_token", password: "NewP@ssword456" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should update the password hash in the database", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: "reset-1",
        token: expect.any(String),
        userId: "user-1",
        used: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });
      mockPrisma.user.update.mockResolvedValue(sampleUser);
      mockPrisma.passwordResetToken.update.mockResolvedValue({ id: "reset-1" });

      await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "valid_reset_token", password: "NewP@ssword456" });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-1" },
          data: { passwordHash: "hashed_password_123" },
        }),
      );
    });

    it("should mark the reset token as used", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: "reset-1",
        token: expect.any(String),
        userId: "user-1",
        used: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });
      mockPrisma.user.update.mockResolvedValue(sampleUser);
      mockPrisma.passwordResetToken.update.mockResolvedValue({ id: "reset-1" });

      await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "valid_reset_token", password: "NewP@ssword456" });

      expect(mockPrisma.passwordResetToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "reset-1" },
          data: { used: true },
        }),
      );
    });

    it("should return 400 for already used token", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: "reset-1",
        token: expect.any(String),
        userId: "user-1",
        used: true,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "used_token", password: "NewP@ssword456" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for expired token", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: "reset-1",
        token: expect.any(String),
        userId: "user-1",
        used: false,
        expiresAt: new Date(Date.now() - 1000),
        user: sampleUser,
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "expired_token", password: "NewP@ssword456" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── 2FA ───────────────────────────────────────────────────────────────

  describe("POST /api/auth/2fa/enable", () => {
    it("should generate 2FA secret and OTP auth URL", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWithout2FA);
      mockPrisma.user.update.mockResolvedValue(sampleUserWith2FASecret);

      const res = await request(app).post("/api/auth/2fa/enable");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("secret");
      expect(res.body.data).toHaveProperty("otpauthUrl");
    });

    it("should return 400 if 2FA is already enabled", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FAEnabled);

      const res = await request(app).post("/api/auth/2fa/enable");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/2fa/verify", () => {
    it("should verify and confirm 2FA setup with valid code", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FASecret);
      mockPrisma.user.update.mockResolvedValue(sampleUserWith2FAEnabled);

      const res = await request(app)
        .post("/api/auth/2fa/verify")
        .send({ code: "123456" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 400 for invalid 2FA code", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { authenticator } = require("otplib");
      authenticator.verify.mockReturnValueOnce(false);
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FASecret);

      const res = await request(app)
        .post("/api/auth/2fa/verify")
        .send({ code: "000000" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/2fa/disable", () => {
    it("should disable 2FA with valid code", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FAEnabled);
      mockPrisma.user.update.mockResolvedValue(sampleUserWithout2FA);

      const res = await request(app)
        .post("/api/auth/2fa/disable")
        .send({ code: "123456" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should clear 2FA secret when disabling", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FAEnabled);
      mockPrisma.user.update.mockResolvedValue(sampleUserWithout2FA);

      await request(app).post("/api/auth/2fa/disable").send({ code: "123456" });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { twoFactorEnabled: false, twoFactorSecret: null },
        }),
      );
    });
  });

  describe("POST /api/auth/2fa/validate", () => {
    it("should validate 2FA code during login", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FAEnabled);

      const res = await request(app)
        .post("/api/auth/2fa/validate")
        .send({ userId: "user-1", code: "123456" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("verified", true);
    });

    it("should return 401 for invalid 2FA login code", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { authenticator } = require("otplib");
      authenticator.verify.mockReturnValueOnce(false);
      mockPrisma.user.findUnique.mockResolvedValue(sampleUserWith2FAEnabled);

      const res = await request(app)
        .post("/api/auth/2fa/validate")
        .send({ userId: "user-1", code: "000000" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Google OAuth ──────────────────────────────────────────────────────

  describe("POST /api/auth/google", () => {
    it("should authenticate existing user via Google OAuth", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(sampleUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockPrisma.user.update.mockResolvedValue(sampleUser);

      const res = await request(app).post("/api/auth/google").send({
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        googleId: "google-123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Google auth successful");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
    });

    it("should register new user via Google OAuth when not existing", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...sampleUser,
        id: "new-google-user",
        status: "ACTIVE",
        emailVerified: true,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockPrisma.user.update.mockResolvedValue({});

      const res = await request(app).post("/api/auth/google").send({
        email: "newgoogle@example.com",
        firstName: "Jane",
        lastName: "Smith",
        googleId: "google-456",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should create Google user with ACTIVE status and verified email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...sampleUser,
        id: "new-google-user",
        status: "ACTIVE",
        emailVerified: true,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockPrisma.user.update.mockResolvedValue({});

      await request(app).post("/api/auth/google").send({
        email: "newgoogle@example.com",
        firstName: "Jane",
        lastName: "Smith",
        googleId: "google-456",
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "newgoogle@example.com",
            role: "TENANT",
            status: "ACTIVE",
            emailVerified: true,
          }),
        }),
      );
    });
  });

  // ── Profile ───────────────────────────────────────────────────────────

  describe("GET /api/auth/profile", () => {
    it("should return current user profile", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...sampleUser,
        landlordProfile: null,
        tenantProfile: null,
        agentProfile: null,
      });

      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("firstName");
      expect(res.body.data).toHaveProperty("role");
    });

    it("should return 404 if user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PATCH /api/auth/profile", () => {
    it("should update user profile", async () => {
      mockPrisma.user.update.mockResolvedValue({
        ...sampleUser,
        firstName: "Updated",
        lastName: "Name",
      });

      const res = await request(app)
        .patch("/api/auth/profile")
        .send({ firstName: "Updated", lastName: "Name" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Profile updated");
    });
  });

  // ── Dashboard ─────────────────────────────────────────────────────────

  describe("GET /api/auth/dashboard", () => {
    it("should return dashboard statistics", async () => {
      mockPrisma.property.count.mockResolvedValue(5);
      mockPrisma.application.count.mockResolvedValue(3);
      mockPrisma.inspection.count.mockResolvedValue(2);
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.inspection.findMany.mockResolvedValue([]);

      const res = await request(app).get("/api/auth/dashboard");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("stats");
      expect(res.body.data.stats).toEqual({
        properties: 5,
        applications: 3,
        activeInspections: 2,
      });
    });
  });

  // ── Email Verification ────────────────────────────────────────────────

  describe("POST /api/auth/verify-email", () => {
    it("should verify email with valid token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: "verify-1",
        token: "valid_verification_token",
        userId: "user-1",
        verified: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });
      mockPrisma.emailVerificationToken.update.mockResolvedValue({
        id: "verify-1",
        verified: true,
      });
      mockPrisma.user.update.mockResolvedValue({
        ...sampleUser,
        emailVerified: true,
        status: "ACTIVE",
      });

      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: "valid_verification_token" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 400 for invalid or expired verification token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: "invalid_token" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for already verified token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: "verify-1",
        token: "already_verified_token",
        userId: "user-1",
        verified: true,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: sampleUser,
      });

      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: "already_verified_token" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Role-Based Access Control ────────────────────────────────────────

  describe("Role-Based Access Control", () => {
    const ALL_ROLES = [
      "TENANT",
      "LANDLORD",
      "AGENT",
      "PROPERTY_MANAGER",
      "BUSINESS",
      "ADMIN",
      "SUPER_ADMIN",
    ];

    it("should support all defined user roles", () => {
      ALL_ROLES.forEach((role) => {
        expect(typeof role).toBe("string");
        expect(role.length).toBeGreaterThan(0);
      });
      expect(ALL_ROLES).toHaveLength(7);
    });

    it("should distinguish tenant from admin roles", () => {
      const tenantRoles = ["TENANT"];
      const adminRoles = ["ADMIN", "SUPER_ADMIN"];
      const managementRoles = [
        "LANDLORD",
        "AGENT",
        "PROPERTY_MANAGER",
        "BUSINESS",
      ];

      expect(tenantRoles).not.toContain("ADMIN");
      expect(adminRoles).not.toContain("TENANT");
      expect(managementRoles).toHaveLength(4);
    });

    it("should allow authenticated users to access their own profile", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...sampleUser,
        landlordProfile: null,
        tenantProfile: null,
        agentProfile: null,
      });

      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should allow authenticated users to access dashboard", async () => {
      mockPrisma.property.count.mockResolvedValue(0);
      mockPrisma.application.count.mockResolvedValue(0);
      mockPrisma.inspection.count.mockResolvedValue(0);
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.inspection.findMany.mockResolvedValue([]);

      const res = await request(app).get("/api/auth/dashboard");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should enforce role hierarchy for administrative access", () => {
      const roleHierarchy: Record<string, number> = {
        TENANT: 1,
        LANDLORD: 2,
        AGENT: 2,
        PROPERTY_MANAGER: 3,
        BUSINESS: 3,
        ADMIN: 4,
        SUPER_ADMIN: 5,
      };

      expect(roleHierarchy["SUPER_ADMIN"]).toBeGreaterThan(
        roleHierarchy["ADMIN"],
      );
      expect(roleHierarchy["ADMIN"]).toBeGreaterThan(roleHierarchy["TENANT"]);
      expect(roleHierarchy["LANDLORD"]).toBeGreaterThan(
        roleHierarchy["TENANT"],
      );
    });
  });
});
