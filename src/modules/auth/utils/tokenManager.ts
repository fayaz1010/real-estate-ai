// FILE PATH: src/modules/auth/utils/tokenManager.ts
// Module 1.1: User Authentication & Management - Token Management Utility

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const tokenManager = {
  /**
   * Store authentication tokens in localStorage
   */
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  /**
   * Get the access token from localStorage
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get the refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if the current access token is expired
   */
  isTokenExpired: (): boolean => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  },

  /**
   * Get time until token expires (in seconds)
   */
  getTimeUntilExpiry: (): number => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    const timeLeft = parseInt(expiry) - Date.now();
    return Math.max(0, Math.floor(timeLeft / 1000));
  },

  /**
   * Clear all tokens from localStorage
   */
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Get authorization header for API requests
   */
  getAuthHeader: (): Record<string, string> => {
    const token = tokenManager.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Check if user has valid tokens (logged in)
   */
  hasValidTokens: (): boolean => {
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();
    return !!(accessToken && refreshToken);
  }
};