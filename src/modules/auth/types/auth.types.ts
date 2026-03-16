// FILE PATH: src/modules/auth/types/auth.types.ts
// Module 1.1: User Authentication & Management - Type Definitions

export enum UserRole {
  TENANT = "tenant",
  LANDLORD = "landlord",
  AGENT = "agent",
  PROPERTY_MANAGER = "property_manager",
  BUSINESS = "business",
  ADMIN = "admin",
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  status: AccountStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;

  // Profile completion
  profileCompletionPercentage: number;

  // Role-specific data
  landlordProfile?: LandlordProfile;
  tenantProfile?: TenantProfile;
  agentProfile?: AgentProfile;
}

export interface LandlordProfile {
  businessName?: string;
  businessRegistration?: string;
  taxId?: string;
  bankAccountVerified: boolean;
  propertiesCount: number;
  rating?: number;
  verificationStatus: "pending" | "verified" | "rejected";
}

export interface TenantProfile {
  employmentStatus?: string;
  annualIncome?: number;
  creditScore?: number;
  moveInDate?: string;
  pets?: boolean;
  numberOfOccupants?: number;
  rentalHistory?: RentalHistory[];
}

export interface AgentProfile {
  licenseNumber: string;
  licenseState: string;
  brokerageName: string;
  yearsOfExperience: number;
  specializations: string[];
  rating?: number;
  verificationStatus: "pending" | "verified" | "rejected";
}

export interface RentalHistory {
  address: string;
  landlordName: string;
  landlordContact: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}
