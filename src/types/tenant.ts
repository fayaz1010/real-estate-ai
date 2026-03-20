/**
 * TypeScript types for the TenantProfile data model.
 */

export type Tenant = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  employmentStatus?: string | null;
  employerName?: string | null;
  jobTitle?: string | null;
  annualIncome?: number | null;
  creditScore?: number | null;
  hasPets: boolean;
  petsDescription?: string | null;
  hasVehicle: boolean;
  vehicleDescription?: string | null;
  smoking: boolean;
  references?: Record<string, unknown> | null;
  moveInDate?: Date | null;
  leaseTerm?: number | null;
  preferredLocations: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredPropertyTypes: string[];
  specialRequirements?: string | null;
};
