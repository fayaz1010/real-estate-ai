// Auth Routes
import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";

import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation";
import logger from "../../utils/logger";

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

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req: Request) => req.ip || "unknown",
  handler: (req: Request, res: Response) => {
    logger.info(
      `Rate limit triggered for IP: ${req.ip}, Route: ${req.originalUrl}`,
    );
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
  },
  standardHeaders: true,
});

// Public routes
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authRateLimiter,
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
