/**
 * TypeScript types for the User data model.
 */

export enum UserRole {
  TENANT = "TENANT",
  LANDLORD = "LANDLORD",
  AGENT = "AGENT",
  PROPERTY_MANAGER = "PROPERTY_MANAGER",
  BUSINESS = "BUSINESS",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION";

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  profileCompletion: number;
  lastLoginAt?: Date | null;
};
