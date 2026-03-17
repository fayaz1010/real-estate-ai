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
}

export interface TenantProfile {
  currentAddress: string;
  moveInDate: string;
  preferredLocation: string;
  budget: number;
  pets: boolean;
  employmentStatus: string;
}

export interface LandlordProfile {
  companyName: string;
  totalProperties: number;
  businessLicense: string;
  preferredContactMethod: string;
}

export interface AgentProfile {
  agencyName: string;
  licenseNumber: string;
  specializations: string[];
  yearsOfExperience: number;
  bio: string;
}

export interface PropertyManagerProfile {
  companyName: string;
  managedProperties: number;
  certifications: string[];
  serviceAreas: string[];
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  taxId: string;
  website: string;
}

export interface AdminProfile {
  department: string;
  accessLevel: number;
}

export interface UserProfile {
  tenantProfile?: TenantProfile;
  landlordProfile?: LandlordProfile;
  agentProfile?: AgentProfile;
  propertyManagerProfile?: PropertyManagerProfile;
  businessProfile?: BusinessProfile;
  adminProfile?: AdminProfile;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}
