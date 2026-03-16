// FILE PATH: src/modules/auth/hooks/useAuth.ts
// Module 1.1: User Authentication & Management - Authentication Hook

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  login, 
  register, 
  logout, 
  loadUser, 
  refreshAuth,
  clearError 
} from '../store/authSlice';
import { tokenManager } from '../utils/tokenManager';
import { hasPermission } from '../utils/rolePermissions';
import { Permission } from '../utils/rolePermissions';
import { LoginCredentials, RegisterData } from '../types/auth.types';
import type { AppDispatch, RootState } from '../../../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Load user on mount if token exists
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (token && !auth.user && !auth.isLoading) {
      dispatch(loadUser());
    }
  }, [dispatch, auth.user, auth.isLoading]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!auth.isAuthenticated || !tokenManager.hasValidTokens()) {
      return;
    }

    // Check token expiry every minute
    const interval = setInterval(() => {
      const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
      
      // Refresh token if less than 5 minutes remaining
      if (timeUntilExpiry > 0 && timeUntilExpiry < 300) {
        dispatch(refreshAuth());
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, dispatch]);

  /**
   * Login user
   */
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    return dispatch(login(credentials)).unwrap();
  }, [dispatch]);

  /**
   * Register new user
   */
  const handleRegister = useCallback(async (registerData: RegisterData) => {
    return dispatch(register(registerData)).unwrap();
  }, [dispatch]);

  /**
   * Logout user
   */
  const handleLogout = useCallback(async () => {
    return dispatch(logout()).unwrap();
  }, [dispatch]);

  /**
   * Refresh authentication
   */
  const handleRefresh = useCallback(async () => {
    return dispatch(refreshAuth()).unwrap();
  }, [dispatch]);

  /**
   * Clear authentication errors
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Check if user has specific permission
   */
  const checkPermission = useCallback((permission: Permission): boolean => {
    return auth.user ? hasPermission(auth.user.role, permission) : false;
  }, [auth.user]);

  /**
   * Check if user has any of the specified permissions
   */
  const checkAnyPermission = useCallback((permissions: Permission[]): boolean => {
    if (!auth.user) return false;
    return permissions.some(permission => hasPermission(auth.user!.role, permission));
  }, [auth.user]);

  /**
   * Check if user has all of the specified permissions
   */
  const checkAllPermissions = useCallback((permissions: Permission[]): boolean => {
    if (!auth.user) return false;
    return permissions.every(permission => hasPermission(auth.user!.role, permission));
  }, [auth.user]);

  return {
    // State
    user: auth.user,
    tokens: auth.tokens,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refresh: handleRefresh,
    clearError: handleClearError,

    // Permissions
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,

    // User info helpers
    isEmailVerified: auth.user?.emailVerified || false,
    isPhoneVerified: auth.user?.phoneVerified || false,
    has2FAEnabled: auth.user?.twoFactorEnabled || false,
    userRole: auth.user?.role,
    userName: auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : null,
  };
};