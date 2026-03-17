// Auth Service - Business Logic
import crypto from "crypto";

import { authenticator } from "otplib";

import prisma from "../../config/database";
import { config } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  send2FAEnabledEmail,
} from "../../utils/emailService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export class AuthService {
  // Register new user
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 400, "EMAIL_EXISTS");
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role as Parameters<
          typeof prisma.user.create
        >[0]["data"]["role"],
        status: "PENDING_VERIFICATION",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send verification email
    if (config.features.emailVerification) {
      try {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await prisma.emailVerificationToken.create({
          data: {
            token: crypto
              .createHash("sha256")
              .update(verificationToken)
              .digest("hex"),
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });
        await sendVerificationEmail(user.email, verificationToken);
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // Login user
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.deletedAt) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    // Check if account is active
    if (user.status === "SUSPENDED") {
      throw new AppError("Account is suspended", 403, "ACCOUNT_SUSPENDED");
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string) {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError("Refresh token expired", 401, "TOKEN_EXPIRED");
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    return { accessToken };
  }

  // Logout user
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Get current user profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        profileCompletion: true,
        createdAt: true,
        landlordProfile: true,
        tenantProfile: true,
        agentProfile: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  }

  // Update user profile
  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
    },
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
      },
    });

    return user;
  }

  // Request password reset
  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: "If the email exists, a reset link has been sent" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }

    return {
      message: "If the email exists, a reset link has been sent",
    };
  }

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken || resetToken.used) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        "INVALID_TOKEN",
      );
    }

    if (resetToken.expiresAt < new Date()) {
      throw new AppError("Reset token has expired", 400, "TOKEN_EXPIRED");
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return { message: "Password reset successful" };
  }

  // Verify email
  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!verificationToken || verificationToken.verified) {
      throw new AppError(
        "Invalid or already used verification token",
        400,
        "INVALID_TOKEN",
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new AppError(
        "Verification token has expired",
        400,
        "TOKEN_EXPIRED",
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true, status: "ACTIVE" },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { verified: true },
      }),
    ]);

    return { message: "Email verified successfully" };
  }

  // Resend verification email
  async resendVerificationEmail(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    // Invalidate old tokens
    await prisma.emailVerificationToken.deleteMany({ where: { userId } });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        token: crypto
          .createHash("sha256")
          .update(verificationToken)
          .digest("hex"),
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(user.email, verificationToken);
    return { message: "Verification email sent" };
  }

  // Enable 2FA - generate secret and QR code
  async enable2FA(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.twoFactorEnabled)
      throw new AppError("2FA is already enabled", 400);

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, "PropManage", secret);

    // Store secret temporarily (will be confirmed on verify)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return { secret, otpauthUrl };
  }

  // Verify and confirm 2FA setup
  async verify2FA(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new AppError("2FA setup not initiated", 400);
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!isValid) {
      throw new AppError("Invalid 2FA code", 400, "INVALID_2FA_CODE");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    try {
      await send2FAEnabledEmail(user.email);
    } catch (err) {
      console.error("Failed to send 2FA enabled email:", err);
    }

    return { message: "2FA enabled successfully" };
  }

  // Disable 2FA
  async disable2FA(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new AppError("2FA is not enabled", 400);
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!isValid) {
      throw new AppError("Invalid 2FA code", 400, "INVALID_2FA_CODE");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return { message: "2FA disabled successfully" };
  }

  // Validate 2FA during login
  async validate2FALogin(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new AppError("2FA not configured", 400);
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!isValid) {
      throw new AppError("Invalid 2FA code", 401, "INVALID_2FA_CODE");
    }

    return { verified: true };
  }

  // Google OAuth login/register
  async googleAuth(googleProfile: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    googleId: string;
  }) {
    let user = await prisma.user.findUnique({
      where: { email: googleProfile.email },
    });

    if (!user) {
      // Register new user via Google
      const passwordHash = await hashPassword(
        crypto.randomBytes(32).toString("hex"),
      );
      user = await prisma.user.create({
        data: {
          email: googleProfile.email,
          passwordHash,
          firstName: googleProfile.firstName,
          lastName: googleProfile.lastName,
          avatar: googleProfile.avatar,
          role: "TENANT",
          status: "ACTIVE",
          emailVerified: true,
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  // Dashboard stats
  async getDashboardStats(userId: string) {
    const [propertiesCount, applicationsCount, inspectionsCount] =
      await Promise.all([
        prisma.property.count({ where: { ownerId: userId } }),
        prisma.application.count({ where: { primaryApplicantId: userId } }),
        prisma.inspection.count({
          where: { userId, status: { in: ["SCHEDULED", "CONFIRMED"] } },
        }),
      ]);

    const recentProperties = await prisma.property.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        price: true,
        createdAt: true,
      },
    });

    const recentApplications = await prisma.application.findMany({
      where: { primaryApplicantId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { property: { select: { title: true } } },
    });

    const upcomingInspections = await prisma.inspection.findMany({
      where: {
        userId,
        scheduledDate: { gte: new Date() },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      orderBy: { scheduledDate: "asc" },
      take: 5,
      include: { property: { select: { title: true, address: true } } },
    });

    return {
      stats: {
        properties: propertiesCount,
        applications: applicationsCount,
        activeInspections: inspectionsCount,
      },
      recentProperties,
      recentApplications,
      upcomingInspections,
    };
  }
}

export default new AuthService();
