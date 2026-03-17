// PLACEHOLDER FILE: utils\autoFillHelper.ts
// TODO: Add your implementation here

import {
  PersonalInfo,
  EmploymentInfo,
  IncomeInfo,
  Address,
  ApplicationFormData,
  RentalHistoryEntry,
} from "../types/application.types";

export interface AutoFillSource {
  source:
    | "previous_application"
    | "user_profile"
    | "browser"
    | "document_parse"
    | "third_party";
  confidence: number;
  data: Partial<ApplicationFormData>;
}

/**
 * Get autofill suggestions from multiple sources
 */
export const getAutoFillSuggestions = async (
  userId: string,
  propertyId: string,
): Promise<AutoFillSource[]> => {
  const suggestions: AutoFillSource[] = [];

  // 1. From previous applications
  const previousAppData = await fetchPreviousApplicationData(userId);
  if (previousAppData) {
    suggestions.push({
      source: "previous_application",
      confidence: 95,
      data: previousAppData,
    });
  }

  // 2. From user profile
  const profileData = await fetchUserProfileData(userId);
  if (profileData) {
    suggestions.push({
      source: "user_profile",
      confidence: 90,
      data: profileData,
    });
  }

  // 3. From browser autofill (if available)
  const browserData = detectBrowserAutofill();
  if (browserData) {
    suggestions.push({
      source: "browser",
      confidence: 70,
      data: browserData,
    });
  }

  return suggestions;
};

/**
 * Merge autofill suggestions intelligently
 */
export const mergeAutoFillData = (
  suggestions: AutoFillSource[],
): Partial<ApplicationFormData> => {
  const merged: Partial<ApplicationFormData> = {};

  // Sort by confidence (highest first)
  const sorted = [...suggestions].sort((a, b) => b.confidence - a.confidence);

  // Merge data, preferring higher confidence sources
  sorted.forEach((suggestion) => {
    Object.entries(suggestion.data).forEach(([key, value]) => {
      if (!(key in merged)) {
        (merged as Record<string, unknown>)[key] = value;
      }
    });
  });

  return merged;
};

/**
 * Apply parsed document data to form
 */
export const applyDocumentData = (
  currentForm: Partial<ApplicationFormData>,
  documentType: string,
  extractedData: Record<string, unknown>,
): Partial<ApplicationFormData> => {
  const updated = { ...currentForm };

  switch (documentType) {
    case "paystub":
      updated.employment = mergeEmploymentFromPaystub(
        currentForm.employment || [],
        extractedData,
      );
      updated.income = mergeIncomeFromPaystub(
        currentForm.income || [],
        extractedData,
      );
      break;

    case "id":
      updated.personalInfo = mergePersonalInfoFromID(
        currentForm.personalInfo || {},
        extractedData,
      );
      break;

    case "bank_statement":
      updated.income = mergeIncomeFromBankStatement(
        currentForm.income || [],
        extractedData,
      );
      break;

    case "lease":
      updated.rentalHistory = mergeRentalHistoryFromLease(
        currentForm.rentalHistory || [],
        extractedData,
      );
      break;
  }

  return updated;
};

/**
 * Smart field suggestions based on partial input
 */
export const getFieldSuggestions = (
  fieldName: string,
  partialValue: string,
  context: Partial<ApplicationFormData>,
): string[] => {
  const suggestions: string[] = [];

  switch (fieldName) {
    case "employerName":
      // Could integrate with LinkedIn or company databases
      suggestions.push(...getSuggestedEmployers(partialValue));
      break;

    case "jobTitle":
      suggestions.push(
        ...getSuggestedJobTitles(
          partialValue,
          context.employment?.[0]?.employerName,
        ),
      );
      break;

    case "city":
      suggestions.push(...getSuggestedCities(partialValue));
      break;

    case "state":
      suggestions.push(...getSuggestedStates(partialValue));
      break;
  }

  return suggestions.slice(0, 5); // Limit to top 5
};

// Private helper functions

const fetchPreviousApplicationData = async (
  userId: string,
): Promise<Partial<ApplicationFormData> | null> => {
  try {
    // In production, fetch from API
    const response = await fetch(`/api/applications/autofill?userId=${userId}`);
    if (!response.ok) return null;

    const data = await response.json();
    return mapPreviousApplicationToForm(data);
  } catch (error) {
    console.error("Failed to fetch previous application data:", error);
    return null;
  }
};

const fetchUserProfileData = async (
  userId: string,
): Promise<Partial<ApplicationFormData> | null> => {
  try {
    // In production, fetch from API
    const response = await fetch(`/api/users/${userId}/profile`);
    if (!response.ok) return null;

    const data = await response.json();
    return mapUserProfileToForm(data);
  } catch (error) {
    console.error("Failed to fetch user profile data:", error);
    return null;
  }
};

const detectBrowserAutofill = (): Partial<ApplicationFormData> | null => {
  // Browser autofill detection (simplified)
  // In production, use browser APIs or libraries
  return null;
};

const mapPreviousApplicationToForm = (
  application: Partial<ApplicationFormData>,
): Partial<ApplicationFormData> => {
  return {
    personalInfo: application.personalInfo,
    employment: application.employment,
    income: application.income,
    rentalHistory: application.rentalHistory,
    references: application.references,
    emergencyContact: application.emergencyContact,
    pets: application.pets,
    vehicles: application.vehicles,
  };
};

const mapUserProfileToForm = (
  profile: Record<string, unknown>,
): Partial<ApplicationFormData> => {
  const formData: Partial<ApplicationFormData> = {};

  if (profile.firstName || profile.lastName) {
    formData.personalInfo = {
      firstName: profile.firstName as string,
      lastName: profile.lastName as string,
      email: profile.email as string,
      phone: profile.phone as string,
      currentAddress: profile.address as Address,
    };
  }

  return formData;
};

const mergeEmploymentFromPaystub = (
  current: Partial<EmploymentInfo>[],
  paystubData: Record<string, unknown>,
): Partial<EmploymentInfo>[] => {
  const newEmployment: Partial<EmploymentInfo> = {
    employerName: paystubData.employerName as string,
    isCurrent: true,
    verificationStatus: "pending",
  };

  // Check if employer already exists
  const existingIndex = current.findIndex(
    (e) =>
      e.employerName?.toLowerCase() ===
      (paystubData.employerName as string)?.toLowerCase(),
  );

  if (existingIndex >= 0) {
    // Update existing
    current[existingIndex] = { ...current[existingIndex], ...newEmployment };
    return current;
  } else {
    // Add new
    return [...current, newEmployment];
  }
};

const mergeIncomeFromPaystub = (
  current: Partial<IncomeInfo>[],
  paystubData: Record<string, unknown>,
): Partial<IncomeInfo>[] => {
  const frequency = determinePayFrequency(paystubData);

  const newIncome: Partial<IncomeInfo> = {
    source: "employment",
    amount: (paystubData.grossPay as number) || 0,
    frequency,
    verificationStatus: "pending",
  };

  // Check if employment income already exists
  const existingIndex = current.findIndex((e) => e.source === "employment");

  if (existingIndex >= 0) {
    current[existingIndex] = { ...current[existingIndex], ...newIncome };
    return current;
  } else {
    return [...current, newIncome];
  }
};

const mergePersonalInfoFromID = (
  current: Partial<PersonalInfo>,
  idData: Record<string, unknown>,
): Partial<PersonalInfo> => {
  return {
    ...current,
    firstName: (idData.firstName as string) || current.firstName,
    lastName: (idData.lastName as string) || current.lastName,
    middleName: (idData.middleName as string) || current.middleName,
    dateOfBirth: (idData.dateOfBirth as string) || current.dateOfBirth,
    idType: (idData.idType as PersonalInfo["idType"]) || current.idType,
    idNumber: (idData.idNumber as string) || current.idNumber,
    idExpiration: (idData.expirationDate as string) || current.idExpiration,
    currentAddress: (idData.address as Address) || current.currentAddress,
  };
};

const mergeIncomeFromBankStatement = (
  current: Partial<IncomeInfo>[],
  _bankData: Record<string, unknown>,
): Partial<IncomeInfo>[] => {
  // Could analyze deposits to estimate income
  // This is a simplified version
  return current;
};

const mergeRentalHistoryFromLease = (
  current: Partial<RentalHistoryEntry>[],
  leaseData: Record<string, unknown>,
): Partial<RentalHistoryEntry>[] => {
  const newHistory: Partial<RentalHistoryEntry> = {
    landlordName: leaseData.landlordName as string,
    landlordPhone: leaseData.landlordPhone as string,
    landlordEmail: leaseData.landlordEmail as string,
    monthlyRent: leaseData.monthlyRent as number,
    startDate: leaseData.leaseStartDate as string,
    endDate: leaseData.leaseEndDate as string,
    address: leaseData.propertyAddress as Address,
    canContact: true,
    verificationStatus: "pending",
  };

  return [...current, newHistory];
};

const determinePayFrequency = (
  paystubData: Record<string, unknown>,
): "weekly" | "biweekly" | "monthly" => {
  // Analyze pay period to determine frequency
  if (paystubData.payPeriodStart && paystubData.payPeriodEnd) {
    const start = new Date(paystubData.payPeriodStart as string);
    const end = new Date(paystubData.payPeriodEnd as string);
    const days = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (days <= 7) return "weekly";
    if (days <= 14) return "biweekly";
    return "monthly";
  }

  return "biweekly"; // Default
};

// Suggestion helpers (mock data - in production, use real databases)

const getSuggestedEmployers = (partial: string): string[] => {
  const employers = [
    "Amazon",
    "Microsoft",
    "Google",
    "Apple",
    "Meta",
    "Tesla",
    "Walmart",
    "Target",
    "Starbucks",
    "McDonald's",
  ];

  return employers.filter((e) =>
    e.toLowerCase().includes(partial.toLowerCase()),
  );
};

const getSuggestedJobTitles = (
  partial: string,
  employer?: string,
): string[] => {
  const titles = [
    "Software Engineer",
    "Project Manager",
    "Sales Manager",
    "Marketing Manager",
    "Accountant",
    "Teacher",
    "Nurse",
    "Customer Service Representative",
    "Operations Manager",
  ];

  return titles.filter((t) => t.toLowerCase().includes(partial.toLowerCase()));
};

const getSuggestedCities = (partial: string): string[] => {
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  return cities.filter((c) => c.toLowerCase().includes(partial.toLowerCase()));
};

const getSuggestedStates = (partial: string): string[] => {
  const states = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI"];

  return states.filter((s) => s.toLowerCase().includes(partial.toLowerCase()));
};

/**
 * Validate autofilled data before applying
 */
export const validateAutoFillData = (
  data: Partial<ApplicationFormData>,
): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Check for stale data
  if (data.personalInfo?.idExpiration) {
    const expDate = new Date(data.personalInfo.idExpiration);
    if (expDate < new Date()) {
      warnings.push("ID from previous application has expired");
    }
  }

  // Check for missing critical fields
  if (!data.personalInfo?.email) {
    warnings.push("Email address is missing from autofill data");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
};
