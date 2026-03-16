// PLACEHOLDER FILE: utils\applicationValidation.ts
// TODO: Add your implementation here

import {
  PersonalInfo,
  EmploymentInfo,
  IncomeInfo,
  RentalHistoryEntry,
  Reference,
} from "../types/application.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Personal Info Validation
export const validatePersonalInfo = (
  data: Partial<PersonalInfo>,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s\-()]+$/.test(data.phone)) {
    errors.phone = "Invalid phone number format";
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const age = calculateAge(data.dateOfBirth);
    if (age < 18) {
      errors.dateOfBirth = "Must be 18 years or older";
    }
  }

  if (!data.ssn?.trim()) {
    errors.ssn = "SSN is required";
  } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(data.ssn)) {
    errors.ssn = "Invalid SSN format (XXX-XX-XXXX)";
  }

  if (!data.currentAddress?.street) {
    errors.currentAddress = "Current address is required";
  }

  if (!data.idType) {
    errors.idType = "ID type is required";
  }

  if (!data.idNumber?.trim()) {
    errors.idNumber = "ID number is required";
  }

  if (!data.idExpiration) {
    errors.idExpiration = "ID expiration date is required";
  } else if (new Date(data.idExpiration) < new Date()) {
    errors.idExpiration = "ID has expired";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Employment Validation
export const validateEmployment = (
  data: Partial<EmploymentInfo>,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.employerName?.trim()) {
    errors.employerName = "Employer name is required";
  }

  if (!data.jobTitle?.trim()) {
    errors.jobTitle = "Job title is required";
  }

  if (!data.employmentType) {
    errors.employmentType = "Employment type is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.isCurrent && !data.endDate) {
    errors.endDate = "End date is required for past employment";
  }

  if (
    data.startDate &&
    data.endDate &&
    new Date(data.startDate) > new Date(data.endDate)
  ) {
    errors.endDate = "End date must be after start date";
  }

  if (!data.address?.street) {
    errors.address = "Employer address is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Income Validation
export const validateIncome = (data: Partial<IncomeInfo>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.source) {
    errors.source = "Income source is required";
  }

  if (!data.amount || data.amount <= 0) {
    errors.amount = "Valid income amount is required";
  }

  if (!data.frequency) {
    errors.frequency = "Payment frequency is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Rental History Validation
export const validateRentalHistory = (
  data: Partial<RentalHistoryEntry>,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.address?.street) {
    errors.address = "Property address is required";
  }

  if (!data.landlordName?.trim()) {
    errors.landlordName = "Landlord name is required";
  }

  if (!data.landlordPhone?.trim()) {
    errors.landlordPhone = "Landlord phone is required";
  }

  if (!data.monthlyRent || data.monthlyRent <= 0) {
    errors.monthlyRent = "Monthly rent is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (
    data.startDate &&
    data.endDate &&
    new Date(data.startDate) > new Date(data.endDate)
  ) {
    errors.endDate = "End date must be after start date";
  }

  if (!data.reasonForLeaving?.trim()) {
    errors.reasonForLeaving = "Reason for leaving is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Reference Validation
export const validateReference = (
  data: Partial<Reference>,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Reference name is required";
  }

  if (!data.relationship) {
    errors.relationship = "Relationship is required";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  }

  if (data.yearsKnown !== undefined && data.yearsKnown < 0) {
    errors.yearsKnown = "Years known cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper Functions
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const formatSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  return ssn;
};

export const maskSSN = (ssn: string): string => {
  const formatted = formatSSN(ssn);
  return `***-**-${formatted.slice(-4)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Application Completeness Check
export const calculateCompleteness = (application: any): number => {
  let totalFields = 0;
  let completedFields = 0;

  // Personal Info (8 required fields)
  totalFields += 8;
  if (application.personalInfo) {
    const pi = application.personalInfo;
    if (pi.firstName) completedFields++;
    if (pi.lastName) completedFields++;
    if (pi.email) completedFields++;
    if (pi.phone) completedFields++;
    if (pi.dateOfBirth) completedFields++;
    if (pi.ssn) completedFields++;
    if (pi.currentAddress?.street) completedFields++;
    if (pi.idNumber) completedFields++;
  }

  // Employment (at least 1)
  totalFields += 1;
  if (application.employment?.length > 0) completedFields++;

  // Income (at least 1)
  totalFields += 1;
  if (application.income?.length > 0) completedFields++;

  // Rental History (at least 1)
  totalFields += 1;
  if (application.rentalHistory?.length > 0) completedFields++;

  // References (at least 2)
  totalFields += 1;
  if (application.references?.length >= 2) completedFields++;

  // Emergency Contact
  totalFields += 1;
  if (application.emergencyContact?.name) completedFields++;

  // Move-in preferences
  totalFields += 2;
  if (application.moveInDate) completedFields++;
  if (application.leaseTerm) completedFields++;

  // Background consent
  totalFields += 1;
  if (application.backgroundConsentGiven) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};
