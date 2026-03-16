// Auth Controller - HTTP Handlers
import { Request, Response } from 'express';
import authService from './auth.service';
import { successResponse } from '../../utils/response';
import { asyncHandler } from '../../middleware/errorHandler';

export class AuthController {
  // POST /api/auth/register
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return successResponse(res, result, 'Registration successful', 201);
  });

  // POST /api/auth/login
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, result, 'Login successful');
  });

  // POST /api/auth/refresh
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, result, 'Token refreshed');
  });

  // POST /api/auth/logout
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return successResponse(res, null, 'Logout successful');
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
    return successResponse(res, profile, 'Profile updated');
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
}

export default new AuthController();
