// FILE PATH: src/modules/auth/hooks/usePermissions.ts
// Module 1.1: User Authentication & Management - Permissions Hook

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getRolePermissions 
} from '../utils/rolePermissions';
import type { RootState } from '../../../store';

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  /**
   * Get all permissions for current user
   */
  const userPermissions = useMemo(() => {
    return user ? getRolePermissions(user.role) : [];
  }, [user]);

  /**
   * Check if user has a specific permission
   */
  const can = useMemo(() => {
    return (permission: Permission): boolean => {
      return user ? hasPermission(user.role, permission) : false;
    };
  }, [user]);

  /**
   * Check if user has any of the specified permissions
   */
  const canAny = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return user ? hasAnyPermission(user.role, permissions) : false;
    };
  }, [user]);

  /**
   * Check if user has all of the specified permissions
   */
  const canAll = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return user ? hasAllPermissions(user.role, permissions) : false;
    };
  }, [user]);

  /**
   * Property-specific permissions
   */
  const propertyPermissions = useMemo(() => ({
    canCreate: can(Permission.CREATE_PROPERTY),
    canUpdate: can(Permission.UPDATE_PROPERTY),
    canDelete: can(Permission.DELETE_PROPERTY),
    canView: can(Permission.VIEW_PROPERTY),
  }), [can]);

  /**
   * Application-specific permissions
   */
  const applicationPermissions = useMemo(() => ({
    canSubmit: can(Permission.SUBMIT_APPLICATION),
    canReview: can(Permission.REVIEW_APPLICATION),
    canApprove: can(Permission.APPROVE_APPLICATION),
  }), [can]);

  /**
   * Lease-specific permissions
   */
  const leasePermissions = useMemo(() => ({
    canCreate: can(Permission.CREATE_LEASE),
    canView: can(Permission.VIEW_LEASE),
    canTerminate: can(Permission.TERMINATE_LEASE),
  }), [can]);

  /**
   * Payment-specific permissions
   */
  const paymentPermissions = useMemo(() => ({
    canMake: can(Permission.MAKE_PAYMENT),
    canView: can(Permission.VIEW_PAYMENT),
    canManageMethods: can(Permission.MANAGE_PAYMENT_METHODS),
  }), [can]);

  /**
   * Maintenance-specific permissions
   */
  const maintenancePermissions = useMemo(() => ({
    canCreate: can(Permission.CREATE_MAINTENANCE_REQUEST),
    canAssign: can(Permission.ASSIGN_MAINTENANCE),
    canView: can(Permission.VIEW_MAINTENANCE),
  }), [can]);

  /**
   * Admin permissions
   */
  const adminPermissions = useMemo(() => ({
    canManageUsers: can(Permission.MANAGE_USERS),
    canViewAnalytics: can(Permission.VIEW_ANALYTICS),
  }), [can]);

  /**
   * Check if user is in specific role
   */
  const isRole = useMemo(() => ({
    isTenant: user?.role === 'tenant',
    isLandlord: user?.role === 'landlord',
    isAgent: user?.role === 'agent',
    isPropertyManager: user?.role === 'property_manager',
    isBusiness: user?.role === 'business',
    isAdmin: user?.role === 'admin',
  }), [user]);

  return {
    // Core permission checks
    can,
    canAny,
    canAll,
    userPermissions,

    // Grouped permissions
    property: propertyPermissions,
    application: applicationPermissions,
    lease: leasePermissions,
    payment: paymentPermissions,
    maintenance: maintenancePermissions,
    admin: adminPermissions,

    // Role checks
    ...isRole,
    currentRole: user?.role || null,
  };
};