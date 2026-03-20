/**
 * TypeScript types for the Application data model.
 */

export type Application = {
  id: string;
  propertyId: string;
  tenantId: string;
  status: string;
  applicationDate: Date;
  creditScore: number;
  income: number;
  rentalHistory: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};
