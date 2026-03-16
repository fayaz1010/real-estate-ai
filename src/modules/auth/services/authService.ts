// FILE PATH: src/modules/auth/services/authService.ts
// Module 1.1: User Authentication & Management - Authentication Service

import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "../types/auth.types";
import { tokenManager } from "../utils/tokenManager";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class AuthService {
  /**
   * Login user with email and password
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
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
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
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

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      tokenManager.clearTokens();
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    tokenManager.setTokens(data.accessToken, data.refreshToken, data.expiresIn);
    return data;
  }

  /**
   * Get current authenticated user data
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/auth/password-reset-request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Password reset request failed");
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/auth/password-reset-confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Password reset failed");
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Email verification failed");
    }
  }

  /**
   * Resend email verification
   */
  async resendVerificationEmail(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to resend verification email");
    }
  }

  /**
   * Enable two-factor authentication
   */
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/2fa/enable`, {
      method: "POST",
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to enable 2FA");
    }

    return response.json();
  }

  /**
   * Verify 2FA code
   */
  async verify2FA(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("2FA verification failed");
    }
  }

  /**
   * Disable two-factor authentication
   */
  async disable2FA(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to disable 2FA");
    }
  }
}

export const authService = new AuthService();
