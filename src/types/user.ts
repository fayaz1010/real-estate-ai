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

export type User = {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role:
    | "TENANT"
    | "LANDLORD"
    | "AGENT"
    | "PROPERTY_MANAGER"
    | "BUSINESS"
    | "ADMIN"
    | "SUPER_ADMIN";
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};
