// Auth Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import authService from "./auth.service";

export class AuthController {
  // POST /api/auth/register
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return successResponse(res, result, "Registration successful", 201);
  });

  // POST /api/auth/login
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, result, "Login successful");
  });

  // POST /api/auth/refresh
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, result, "Token refreshed");
  });

  // POST /api/auth/logout
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return successResponse(res, null, "Logout successful");
  });

  // GET /api/auth/profile
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await authService.getProfile(userId);
    return successResponse(res, profile);
  });

  // PATCH /api/auth/profile
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await authService.updateProfile(userId, req.body);
    return successResponse(res, profile, "Profile updated");
  });

  // POST /api/auth/forgot-password
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return successResponse(res, result);
  });

  // POST /api/auth/reset-password
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return successResponse(res, result);
  });

  // POST /api/auth/verify-email
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    return successResponse(res, result);
  });

  // POST /api/auth/resend-verification
  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await authService.resendVerificationEmail(userId);
    return successResponse(res, result);
  });

  // POST /api/auth/2fa/enable
  enable2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await authService.enable2FA(userId);
    return successResponse(res, result);
  });

  // POST /api/auth/2fa/verify
  verify2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { code } = req.body;
    const result = await authService.verify2FA(userId, code);
    return successResponse(res, result);
  });

  // POST /api/auth/2fa/disable
  disable2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { code } = req.body;
    const result = await authService.disable2FA(userId, code);
    return successResponse(res, result);
  });

  // POST /api/auth/2fa/validate
  validate2FALogin = asyncHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    const result = await authService.validate2FALogin(userId, code);
    return successResponse(res, result);
  });

  // POST /api/auth/google
  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.googleAuth(req.body);
    return successResponse(res, result, "Google auth successful");
  });

  // GET /api/auth/dashboard
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await authService.getDashboardStats(userId);
    return successResponse(res, result);
  });
}

export default new AuthController();
