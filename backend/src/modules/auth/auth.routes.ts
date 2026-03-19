// Auth Routes
import { Router } from "express";
import rateLimit from "express-rate-limit";

import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation";

import authController from "./auth.controller";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "./auth.validation";

const router = Router();

// General auth rate limiter (e.g. email verification, profile)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for brute-force sensitive endpoints (login, register, password reset)
const strictAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message:
      "Too many attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes — login, register, password reset use strict rate limiter
router.post(
  "/register",
  strictAuthRateLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  strictAuthRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post(
  "/refresh",
  authRateLimiter,
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  strictAuthRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  strictAuthRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// Email verification
router.post("/verify-email", authRateLimiter, authController.verifyEmail);
router.post(
  "/resend-verification",
  authenticate,
  authController.resendVerification,
);

// Google OAuth
router.post("/google", authController.googleAuth);

// 2FA routes
router.post("/2fa/enable", authenticate, authController.enable2FA);
router.post("/2fa/verify", authenticate, authController.verify2FA);
router.post("/2fa/disable", authenticate, authController.disable2FA);
router.post("/2fa/validate", authController.validate2FALogin);

// Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile,
);
router.get("/dashboard", authenticate, authController.getDashboardStats);

export default router;
