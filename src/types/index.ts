/**
 * Shared types for the Real Estate Platform.
 * Central location for all reusable TypeScript type definitions.
 */

// ==========================================
// GENERIC / UTILITY TYPES
// ==========================================

/**
 * Generic API response wrapper.
 * Used for consistent handling of all API responses throughout the application.
 *
 * @template T - The type of the response data payload.
 */
export interface ApiResponse<T> {
  /** The response data, or null if an error occurred. */
  data: T | null;
  /** The error message, or null if the request succeeded. */
  error: string | null;
  /** The HTTP status code of the response. */
  status: number;
}

/**
 * Generic search parameters as key-value string pairs.
 * Used for constructing URL query strings and filter objects.
 */
export interface SearchParams {
  [key: string]: string;
}

/**
 * Pagination metadata for paginated API responses.
 */
export interface Pagination {
  /** Total number of items across all pages. */
  totalItems: number;
  /** Total number of pages available. */
  totalPages: number;
  /** The current page number (1-indexed). */
  currentPage: number;
  /** Number of items per page. */
  itemsPerPage: number;
}

/**
 * Sort order direction for ordered queries.
 */
export type SortOrder = "asc" | "desc";

/**
 * Configuration options for debounced operations.
 */
export interface DebounceSettings {
  /** Whether the function should be invoked on the leading edge of the timeout. */
  leading?: boolean;
  /** Whether the function should be invoked on the trailing edge of the timeout. */
  trailing?: boolean;
}

// ==========================================
// DESIGN SYSTEM TOKENS
// ==========================================

/**
 * Design system color tokens.
 */
export const COLORS = {
  primary: "#091a2b",
  secondary: "#005163",
  accent: "#3b4876",
  background: "#f1f3f4",
  textPrimary: "#091a2b",
} as const;

/**
 * Design system typography tokens.
 */
export const TYPOGRAPHY = {
  displayFont: "Montserrat",
  bodyFont: "Open Sans",
} as const;

// ==========================================
// ENUMS
// ==========================================

export enum UserRole {
  TENANT = "TENANT",
  LANDLORD = "LANDLORD",
  AGENT = "AGENT",
  PROPERTY_MANAGER = "PROPERTY_MANAGER",
  BUSINESS = "BUSINESS",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

export enum PropertyStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  RENTED = "RENTED",
  SOLD = "SOLD",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  STUDIO = "STUDIO",
  LOFT = "LOFT",
  COMMERCIAL = "COMMERCIAL",
}

export enum InspectionType {
  IN_PERSON = "IN_PERSON",
  VIRTUAL = "VIRTUAL",
  OPEN_HOUSE = "OPEN_HOUSE",
}

export enum InspectionStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  NO_SHOW = "NO_SHOW",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum LeaseStatus {
  DRAFT = "DRAFT",
  PENDING_SIGNATURES = "PENDING_SIGNATURES",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
  RENEWED = "RENEWED",
}

export enum PaymentType {
  RENT = "RENT",
  DEPOSIT = "DEPOSIT",
  LATE_FEE = "LATE_FEE",
  MAINTENANCE = "MAINTENANCE",
  UTILITY = "UTILITY",
  OTHER = "OTHER",
}

export enum PaymentStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  PARTIAL = "PARTIAL",
  REFUNDED = "REFUNDED",
  PAYMENT_CANCELLED = "PAYMENT_CANCELLED",
}

export enum MaintenanceSystemType {
  HVAC = "HVAC",
  PLUMBING = "PLUMBING",
  ELECTRICAL = "ELECTRICAL",
  ROOFING = "ROOFING",
  APPLIANCE = "APPLIANCE",
  STRUCTURAL = "STRUCTURAL",
}

export enum MaintenanceRequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

export enum MaintenancePriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  IN_APP = "IN_APP",
  SMS = "SMS",
  PUSH = "PUSH",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

// ==========================================
// PERMISSION TYPES
// ==========================================

export type Permission =
  | "createProperty"
  | "editProperty"
  | "deleteProperty"
  | "viewProperty"
  | "publishProperty"
  | "viewTenantApplications"
  | "approveTenantApplications"
  | "rejectTenantApplications"
  | "createInspection"
  | "editInspection"
  | "cancelInspection"
  | "viewInspection"
  | "createLease"
  | "editLease"
  | "terminateLease"
  | "viewLease"
  | "signLease"
  | "processPayment"
  | "viewPayment"
  | "refundPayment"
  | "manageUsers"
  | "viewReports"
  | "manageNotifications"
  | "submitApplication"
  | "withdrawApplication";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.TENANT]: [
    "viewProperty",
    "submitApplication",
    "withdrawApplication",
    "viewInspection",
    "signLease",
    "viewLease",
    "processPayment",
    "viewPayment",
  ],
  [UserRole.LANDLORD]: [
    "createProperty",
    "editProperty",
    "deleteProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "approveTenantApplications",
    "rejectTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "createLease",
    "editLease",
    "terminateLease",
    "viewLease",
    "signLease",
    "processPayment",
    "viewPayment",
    "refundPayment",
    "viewReports",
    "manageNotifications",
  ],
  [UserRole.AGENT]: [
    "createProperty",
    "editProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "viewLease",
    "viewReports",
  ],
  [UserRole.PROPERTY_MANAGER]: [
    "createProperty",
    "editProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "approveTenantApplications",
    "rejectTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "createLease",
    "editLease",
    "terminateLease",
    "viewLease",
    "signLease",
    "processPayment",
    "viewPayment",
    "refundPayment",
    "viewReports",
    "manageNotifications",
  ],
  [UserRole.BUSINESS]: [
    "createProperty",
    "editProperty",
    "deleteProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "approveTenantApplications",
    "rejectTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "createLease",
    "editLease",
    "terminateLease",
    "viewLease",
    "signLease",
    "processPayment",
    "viewPayment",
    "refundPayment",
    "viewReports",
    "manageNotifications",
    "manageUsers",
  ],
  [UserRole.ADMIN]: [
    "createProperty",
    "editProperty",
    "deleteProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "approveTenantApplications",
    "rejectTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "createLease",
    "editLease",
    "terminateLease",
    "viewLease",
    "signLease",
    "processPayment",
    "viewPayment",
    "refundPayment",
    "viewReports",
    "manageNotifications",
    "manageUsers",
    "submitApplication",
    "withdrawApplication",
  ],
  [UserRole.SUPER_ADMIN]: [
    "createProperty",
    "editProperty",
    "deleteProperty",
    "viewProperty",
    "publishProperty",
    "viewTenantApplications",
    "approveTenantApplications",
    "rejectTenantApplications",
    "createInspection",
    "editInspection",
    "cancelInspection",
    "viewInspection",
    "createLease",
    "editLease",
    "terminateLease",
    "viewLease",
    "signLease",
    "processPayment",
    "viewPayment",
    "refundPayment",
    "viewReports",
    "manageNotifications",
    "manageUsers",
    "submitApplication",
    "withdrawApplication",
  ],
};

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  avatar: string | null;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  profileCompletion: number;
  lastLoginAt: Date | null;
  passwordResetToken: string | null;
  emailVerificationToken: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// ==========================================
// PROPERTY TYPES
// ==========================================

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  slug: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  address: PropertyAddress;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  price: number;
  pricePerSqft: number | null;
  deposit: number | null;
  amenities: string[];
  images: string[];
  virtualTourUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  availableFrom: Date | null;
  leaseTerm: number | null;
  views: number;
  featured: boolean;
  verified: boolean;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// ==========================================
// INSPECTION TYPES
// ==========================================

export interface Inspection {
  id: string;
  propertyId: string;
  inspectorId: string;
  tenantId: string;
  type: InspectionType;
  status: InspectionStatus;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  checkInAt: Date | null;
  checkOutAt: Date | null;
  tenantNotes: string | null;
  landlordNotes: string | null;
  confirmedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  meetingLink: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// APPLICATION TYPES
// ==========================================

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmploymentInfo {
  employerName: string;
  position: string;
  employmentDuration: string;
  employerPhone: string;
  employerAddress: string;
  employmentType: string;
}

export interface IncomeInfo {
  annualIncome: number;
  monthlyIncome: number;
  additionalIncomeSource: string;
  additionalIncomeAmount: number;
}

export interface RentalHistory {
  previousAddress: string;
  landlordName: string;
  landlordPhone: string;
  rentAmount: number;
  durationOfStay: string;
  reasonForLeaving: string;
}

export interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface ApplicationScoring {
  creditScore: number;
  incomeScore: number;
  employmentScore: number;
  rentalHistoryScore: number;
  overallScore: number;
}

export interface Application {
  id: string;
  applicantId: string;
  propertyId: string;
  status: ApplicationStatus;
  submissionDate: Date;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  incomeInfo: IncomeInfo;
  rentalHistory: RentalHistory;
  references: Reference[];
  backgroundCheckConsent: boolean;
  documents: string[];
  scoring: ApplicationScoring | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// LEASE TYPES
// ==========================================

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status: LeaseStatus;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  depositAmount: number;
  depositPaid: boolean;
  lateFeeAmount: number;
  lateFeeGraceDays: number;
  leaseDocumentUrl: string | null;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  signedAt: Date | null;
  terminatedAt: Date | null;
  terminationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PAYMENT TYPES
// ==========================================

export interface Payment {
  id: string;
  leaseId: string;
  payerId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  dueDate: Date;
  paidAt: Date | null;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  description: string | null;
  receiptUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// TENANT TYPES
// ==========================================

export interface Tenant {
  id: string;
  userId: string;
  employmentStatus: string | null;
  employerName: string | null;
  jobTitle: string | null;
  annualIncome: number | null;
  creditScore: number | null;
  hasPets: boolean;
  petsDescription: string | null;
  hasVehicle: boolean;
  vehicleDescription: string | null;
  smoking: boolean;
  references: Record<string, unknown> | null;
  moveInDate: Date | null;
  leaseTerm: number | null;
  preferredLocations: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  preferredPropertyTypes: string[];
  specialRequirements: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// MAINTENANCE REQUEST TYPES
// ==========================================

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  systemType: MaintenanceSystemType;
  description: string;
  status: MaintenanceRequestStatus;
  priority: MaintenancePriority;
  cost: number | null;
  assignedVendor: string | null;
  completedAt: Date | null;
  nextPredictedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  subject: string;
  body: string;
  status: NotificationStatus;
  data: Record<string, unknown> | null;
  readAt: Date | null;
  sentAt: Date | null;
  failReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inspectionReminders: boolean;
  inspectionUpdates: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
}
