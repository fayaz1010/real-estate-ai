// Trial Service - Business Logic
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

const TRIAL_DURATION_DAYS = 14;

export class TrialService {
  async startTrial(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 400, "EMAIL_EXISTS");
    }

    // Import auth utilities
    const { hashPassword } = await import("../../utils/bcrypt");
    const { generateAccessToken, generateRefreshToken } = await import(
      "../../utils/jwt"
    );

    const passwordHash = await hashPassword(data.password);

    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DURATION_DAYS);

    // Create user and subscription in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "TENANT",
          status: "ACTIVE",
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

      await tx.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "TRIALING",
          trialStartDate: now,
          trialEndDate,
        },
      });

      return user;
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: result.id,
      email: result.email,
      role: result.role,
    });

    const refreshToken = generateRefreshToken({
      userId: result.id,
      email: result.email,
      role: result.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: result.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: result,
      accessToken,
      refreshToken,
      trialExpirationDate: trialEndDate.toISOString(),
    };
  }

  async getTrialStatus(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.status !== "TRIALING") {
      return {
        isTrialing: false,
        daysRemaining: 0,
        trialExpirationDate: null,
      };
    }

    const now = new Date();
    const endDate = subscription.trialEndDate
      ? new Date(subscription.trialEndDate)
      : now;
    const msRemaining = endDate.getTime() - now.getTime();
    const daysRemaining = Math.max(
      0,
      Math.ceil(msRemaining / (1000 * 60 * 60 * 24)),
    );

    return {
      isTrialing: daysRemaining > 0,
      daysRemaining,
      trialExpirationDate: endDate.toISOString(),
    };
  }
}

export default new TrialService();
