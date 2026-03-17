// PLACEHOLDER FILE: types\application.types.ts
// TODO: Add your implementation here

// Application Status Flow
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verification_pending"
  | "conditionally_approved"
  | "approved"
  | "approved_with_conditions"
  | "rejected"
  | "withdrawn";

// Income Sources
export type IncomeSource =
  | "employment"
  | "self_employment"
  | "investment"
  | "social_security"
  | "disability"
  | "retirement"
  | "alimony"
  | "other";

// Verification Status
export type VerificationStatus =
  | "not_started"
  | "pending"
  | "in_progress"
  | "verified"
  | "failed"
  | "manual_review";

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string; // Encrypted on backend
  currentAddress: Address;
  previousAddresses: Address[];
  idType: "drivers_license" | "passport" | "state_id";
  idNumber: string;
  idExpiration: string;
}

export interface EmploymentInfo {
  employerName: string;
  jobTitle: string;
  employmentType: "full_time" | "part_time" | "contract" | "self_employed";
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  address: Address;
  verificationStatus: VerificationStatus;
}

export interface IncomeInfo {
  source: IncomeSource;
  amount: number;
  frequency: "hourly" | "weekly" | "biweekly" | "monthly" | "annually";
  verificationStatus: VerificationStatus;
  documents: string[]; // Document IDs
}

export interface RentalHistoryEntry {
  address: Address;
  landlordName: string;
  landlordPhone: string;
  landlordEmail?: string;
  monthlyRent: number;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  canContact: boolean;
  verificationStatus: VerificationStatus;
}

export interface Reference {
  name: string;
  relationship: "employer" | "personal" | "professional" | "previous_landlord";
  phone: string;
  email?: string;
  yearsKnown: number;
  contacted: boolean;
  contactedAt?: string;
  feedback?: string;
}

export interface PetInfo {
  type: "dog" | "cat" | "other";
  breed?: string;
  weight: number;
  age: number;
  name: string;
  vaccinated: boolean;
  spayedNeutered: boolean;
  serviceAnimal: boolean;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  state: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface CreditCheckResult {
  id: string;
  provider: "experian" | "equifax" | "transunion";
  score: number;
  reportUrl: string;
  pulledAt: string;
  status: VerificationStatus;
  alerts: string[];
}

export interface CriminalRecord {
  type: "misdemeanor" | "felony";
  description: string;
  date: string;
  jurisdiction: string;
  disposition: string;
}

export interface EvictionRecord {
  filedDate: string;
  court: string;
  amount?: number;
  status: "filed" | "dismissed" | "judgment";
}

export interface BackgroundCheckResult {
  id: string;
  provider: "checkr" | "backgroundchecks.com";
  status: VerificationStatus;
  completedAt?: string;
  criminalRecords: CriminalRecord[];
  evictionRecords: EvictionRecord[];
  sexOffenderCheck: boolean;
  reportUrl?: string;
}

export interface ScoreBreakdown {
  creditScore: {
    value: number;
    weight: number;
    score: number;
  };
  incomeRatio: {
    value: number;
    weight: number;
    score: number;
  };
  employmentStability: {
    value: number;
    weight: number;
    score: number;
  };
  rentalHistory: {
    value: number;
    weight: number;
    score: number;
  };
  backgroundCheck: {
    value: number;
    weight: number;
    score: number;
  };
  completeness: {
    value: number;
    weight: number;
    score: number;
  };
}

export interface CoApplicant {
  id: string;
  email: string;
  status: "invited" | "in_progress" | "completed";
  relationship: "spouse" | "partner" | "roommate" | "family" | "other";
  personalInfo?: PersonalInfo;
  employment?: EmploymentInfo[];
  income?: IncomeInfo[];
  invitedAt: string;
  completedAt?: string;
}

export interface ApplicationDocument {
  id: string;
  type:
    | "id"
    | "paystub"
    | "bank_statement"
    | "tax_return"
    | "employment_letter"
    | "other";
  filename: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  parsed: boolean;
  extractedData?: Record<string, unknown>;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface Property {
  id: string;
  address: Address;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
}

export interface Application {
  id: string;
  propertyId: string;
  property?: Property;

  // Applicants
  primaryApplicantId: string;
  coApplicants: CoApplicant[];

  // Status
  status: ApplicationStatus;
  score: number; // 0-100
  scoreBreakdown: ScoreBreakdown;

  // Personal Information
  personalInfo: PersonalInfo;

  // Employment & Income
  employment: EmploymentInfo[];
  income: IncomeInfo[];

  // Rental History
  rentalHistory: RentalHistoryEntry[];

  // References
  references: Reference[];

  // Verification
  identityVerification: VerificationRecord;
  incomeVerification: VerificationRecord;
  creditCheck: CreditCheckResult;
  backgroundCheck: BackgroundCheckResult;

  // Documents
  documents: ApplicationDocument[];

  // Preferences & Notes
  moveInDate: string;
  leaseTerm: number; // months
  pets: PetInfo[];
  vehicles: VehicleInfo[];
  emergencyContact: EmergencyContact;
  applicantNotes: string;

  // Landlord Review
  landlordNotes: string;
  rejectionReason?: string;
  conditions?: string[]; // For conditional approval
  reviewedBy?: string;
  reviewedAt?: string;

  // Metadata
  submittedAt?: string;
  lastModified: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ApplicationFormData {
  step: number;
  personalInfo?: Partial<PersonalInfo>;
  employment?: Partial<EmploymentInfo>[];
  income?: Partial<IncomeInfo>[];
  rentalHistory?: Partial<RentalHistoryEntry>[];
  references?: Partial<Reference>[];
  pets?: PetInfo[];
  vehicles?: VehicleInfo[];
  emergencyContact?: Partial<EmergencyContact>;
  moveInDate?: string;
  leaseTerm?: number;
  applicantNotes?: string;
  backgroundConsentGiven?: boolean;
}

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  propertyId?: string;
  minScore?: number;
  maxScore?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ApplicationSummary {
  totalApplications: number;
  byStatus: Record<ApplicationStatus, number>;
  averageScore: number;
  pendingReview: number;
  approvalRate: number;
}
