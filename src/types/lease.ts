/**
 * TypeScript types for the Lease data model.
 */

export type LeaseStatus =
  | "DRAFT"
  | "PENDING_SIGNATURES"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED"
  | "RENEWED";

export type Lease = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
  leaseDocumentUrl?: string | null;
  signedByTenant: boolean;
  signedByLandlord: boolean;
  signedAt?: Date | null;
  terminatedAt?: Date | null;
  terminationReason?: string | null;
};
