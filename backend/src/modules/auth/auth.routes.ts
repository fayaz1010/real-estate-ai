// Auth Routes
import { Router } from "express";

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

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// Email verification
router.post("/verify-email", authController.verifyEmail);
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
