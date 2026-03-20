/**
 * TypeScript types for the Tenant data model.
 */

export type Tenant = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  occupation: string;
  income: number;
  creditScore: number;
  rentalHistory: string;
  createdAt: Date;
  updatedAt: Date;
};
