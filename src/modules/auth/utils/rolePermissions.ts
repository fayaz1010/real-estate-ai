// FILE PATH: src/modules/auth/utils/rolePermissions.ts
// Module 1.1: User Authentication & Management - Role-Based Permissions

import { UserRole } from '../types/auth.types';

export enum Permission {
  // Property permissions
  CREATE_PROPERTY = 'create_property',
  UPDATE_PROPERTY = 'update_property',
  DELETE_PROPERTY = 'delete_property',
  VIEW_PROPERTY = 'view_property',
  
  // Application permissions
  SUBMIT_APPLICATION = 'submit_application',
  REVIEW_APPLICATION = 'review_application',
  APPROVE_APPLICATION = 'approve_application',
  
  // Lease permissions
  CREATE_LEASE = 'create_lease',
  VIEW_LEASE = 'view_lease',
  TERMINATE_LEASE = 'terminate_lease',
  
  // Payment permissions
  MAKE_PAYMENT = 'make_payment',
  VIEW_PAYMENT = 'view_payment',
  MANAGE_PAYMENT_METHODS = 'manage_payment_methods',
  
  // Maintenance permissions
  CREATE_MAINTENANCE_REQUEST = 'create_maintenance_request',
  ASSIGN_MAINTENANCE = 'assign_maintenance',
  VIEW_MAINTENANCE = 'view_maintenance',
  
  // User management
  MANAGE_USERS = 'manage_users',
  VIEW_ANALYTICS = 'view_analytics'
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.TENANT]: [
    Permission.VIEW_PROPERTY,
    Permission.SUBMIT_APPLICATION,
    Permission.VIEW_LEASE,
    Permission.MAKE_PAYMENT,
    Permission.VIEW_PAYMENT,
    Permission.MANAGE_PAYMENT_METHODS,
    Permission.CREATE_MAINTENANCE_REQUEST,
    Permission.VIEW_MAINTENANCE
  ],
  
  [UserRole.LANDLORD]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.DELETE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.REVIEW_APPLICATION,
    Permission.APPROVE_APPLICATION,
    Permission.CREATE_LEASE,
    Permission.VIEW_LEASE,
    Permission.TERMINATE_LEASE,
    Permission.VIEW_PAYMENT,
    Permission.ASSIGN_MAINTENANCE,
    Permission.VIEW_MAINTENANCE,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.AGENT]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.REVIEW_APPLICATION,
    Permission.VIEW_LEASE,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.PROPERTY_MANAGER]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.DELETE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.REVIEW_APPLICATION,
    Permission.APPROVE_APPLICATION,
    Permission.CREATE_LEASE,
    Permission.VIEW_LEASE,
    Permission.TERMINATE_LEASE,
    Permission.VIEW_PAYMENT,
    Permission.ASSIGN_MAINTENANCE,
    Permission.VIEW_MAINTENANCE,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.BUSINESS]: [
    Permission.CREATE_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.DELETE_PROPERTY,
    Permission.VIEW_PROPERTY,
    Permission.REVIEW_APPLICATION,
    Permission.APPROVE_APPLICATION,
    Permission.CREATE_LEASE,
    Permission.VIEW_LEASE,
    Permission.TERMINATE_LEASE,
    Permission.VIEW_PAYMENT,
    Permission.ASSIGN_MAINTENANCE,
    Permission.VIEW_MAINTENANCE,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.ADMIN]: Object.values(Permission)
};

/**
 * Check if a user role has a specific permission
 */
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) || false;
};

/**
 * Check if a user role has any of the specified permissions
 */
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if a user role has all of the specified permissions
 */
export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a specific role
 */
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return rolePermissions[userRole] || [];
};