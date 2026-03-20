/**
 * TypeScript types for the Lease data model.
 */

export type Lease = {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  securityDeposit: number;
  leaseDocumentUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
