/**
 * TypeScript types for the Application data model.
 */

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

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

export interface Application {
  id: string;
  propertyId: string;
  tenantId: string;
  status: ApplicationStatus;
  submissionDate: Date;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  incomeInfo: IncomeInfo;
  rentalHistory: RentalHistory;
  references: Reference[];
  backgroundCheckConsent: boolean;
  documents: string[];
  score: number | null;
  notes: string;
}
