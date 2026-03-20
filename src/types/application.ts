/**
 * TypeScript types for the Application data model.
 */

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFICATION_PENDING"
  | "CONDITIONALLY_APPROVED"
  | "APPROVED"
  | "APPROVED_WITH_CONDITIONS"
  | "REJECTED"
  | "WITHDRAWN";

export type Application = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  propertyId: string;
  primaryApplicantId: string;
  status: ApplicationStatus;
  score: number;
  scoreBreakdown?: Record<string, unknown> | null;
  personalInfo: Record<string, unknown>;
  employment: Record<string, unknown>[];
  income: Record<string, unknown>[];
  rentalHistory: Record<string, unknown>[];
  references: Record<string, unknown>[];
  identityVerification?: Record<string, unknown> | null;
  incomeVerification?: Record<string, unknown> | null;
  creditCheck?: Record<string, unknown> | null;
  backgroundCheck?: Record<string, unknown> | null;
  moveInDate?: Date | null;
  leaseTerm?: number | null;
  pets: Record<string, unknown>[];
  vehicles: Record<string, unknown>[];
  emergencyContact?: Record<string, unknown> | null;
  applicantNotes?: string | null;
  coApplicants: Record<string, unknown>[];
  landlordNotes?: string | null;
  rejectionReason?: string | null;
  conditions: string[];
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  submittedAt?: Date | null;
  expiresAt?: Date | null;
};
