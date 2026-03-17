// FILE PATH: src/modules/auth/services/authService.ts
// Module 1.1: User Authentication & Management - Authentication Service

import apiClient from "@/api/client";
import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "../types/auth.types";
import { tokenManager } from "../utils/tokenManager";

class AuthService {
  /**
   * Login user with email and password
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post("/auth/login", credentials);
    const data = response.data;
    tokenManager.setTokens(
      data.tokens.accessToken,
      data.tokens.refreshToken,
      data.tokens.expiresIn,
    );
    return data;
  }

  /**
   * Register new user account
   */
  async register(
    registerData: RegisterData,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post("/auth/register", registerData);
    const data = response.data;
    tokenManager.setTokens(
      data.tokens.accessToken,
      data.tokens.refreshToken,
      data.tokens.expiresIn,
    );
    return data;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenManager.clearTokens();
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post("/auth/refresh", { refreshToken });
    const data = response.data;
    tokenManager.setTokens(data.accessToken, data.refreshToken, data.expiresIn);
    return data;
  }

  /**
   * Get current authenticated user data
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/auth/password-reset-request", { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/password-reset-confirm", { token, newPassword });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post("/auth/verify-email", { token });
  }

  /**
   * Resend email verification
   */
  async resendVerificationEmail(): Promise<void> {
    await apiClient.post("/auth/resend-verification");
  }

  /**
   * Enable two-factor authentication
   */
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await apiClient.post<{ qrCode: string; secret: string }>(
      "/auth/2fa/enable",
    );
    return response.data;
  }

  /**
   * Verify 2FA code
   */
  async verify2FA(code: string): Promise<void> {
    await apiClient.post("/auth/2fa/verify", { code });
  }

  /**
   * Disable two-factor authentication
   */
  async disable2FA(code: string): Promise<void> {
    await apiClient.post("/auth/2fa/disable", { code });
  }
}

export const authService = new AuthService();
