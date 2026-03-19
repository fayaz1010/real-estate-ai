// PLACEHOLDER FILE: utils\scoringAlgorithm.ts
// TODO: Add your implementation here

import {
  Application,
  ScoreBreakdown,
  IncomeInfo,
} from "../types/application.types";

// Scoring weights (totals 100%)
const WEIGHTS = {
  creditScore: 0.3, // 30%
  incomeRatio: 0.25, // 25%
  employment: 0.15, // 15%
  rentalHistory: 0.15, // 15%
  background: 0.1, // 10%
  completeness: 0.05, // 5%
};

/**
 * Main scoring function - calculates overall application score
 * Returns a score from 0-100
 */
export const calculateApplicationScore = (
  application: Partial<Application>,
): number => {
  const breakdown = calculateScoreBreakdown(application);

  const totalScore =
    breakdown.creditScore.score * WEIGHTS.creditScore +
    breakdown.incomeRatio.score * WEIGHTS.incomeRatio +
    breakdown.employmentStability.score * WEIGHTS.employment +
    breakdown.rentalHistory.score * WEIGHTS.rentalHistory +
    breakdown.backgroundCheck.score * WEIGHTS.background +
    breakdown.completeness.score * WEIGHTS.completeness;

  return Math.round(totalScore);
};

/**
 * Calculate detailed score breakdown for transparency
 */
export const calculateScoreBreakdown = (
  application: Partial<Application>,
): ScoreBreakdown => {
  const creditScore = calculateCreditScore(application);
  const incomeRatio = calculateIncomeScore(application);
  const employmentStability = calculateEmploymentScore(application);
  const rentalHistory = calculateRentalScore(application);
  const backgroundCheck = calculateBackgroundScore(application);
  const completeness = calculateCompletenessScore(application);

  return {
    creditScore: {
      value: creditScore.value,
      weight: WEIGHTS.creditScore,
      score: creditScore.score,
    },
    incomeRatio: {
      value: incomeRatio.value,
      weight: WEIGHTS.incomeRatio,
      score: incomeRatio.score,
    },
    employmentStability: {
      value: employmentStability.value,
      weight: WEIGHTS.employment,
      score: employmentStability.score,
    },
    rentalHistory: {
      value: rentalHistory.value,
      weight: WEIGHTS.rentalHistory,
      score: rentalHistory.score,
    },
    backgroundCheck: {
      value: backgroundCheck.value,
      weight: WEIGHTS.background,
      score: backgroundCheck.score,
    },
    completeness: {
      value: completeness.value,
      weight: WEIGHTS.completeness,
      score: completeness.score,
    },
  };
};

/**
 * 1. Credit Score (300-850 → 0-100)
 */
const calculateCreditScore = (application: Partial<Application>) => {
  const creditScore = application.creditCheck?.score || 0;

  if (creditScore === 0) {
    return { value: 0, score: 0 };
  }

  // Convert 300-850 range to 0-100
  // 750+ = 100, 650-749 = 80-99, 550-649 = 50-79, <550 = 0-49
  let score: number;
  if (creditScore >= 750) {
    score = 100;
  } else if (creditScore >= 650) {
    score = 80 + ((creditScore - 650) / 100) * 20;
  } else if (creditScore >= 550) {
    score = 50 + ((creditScore - 550) / 100) * 30;
  } else {
    score = ((creditScore - 300) / 250) * 50;
  }

  return {
    value: creditScore,
    score: Math.max(0, Math.min(100, Math.round(score))),
  };
};

/**
 * 2. Income-to-Rent Ratio
 * 3x rent = 100, 2.5x = 75, 2x = 50, <2x = 25
 */
const calculateIncomeScore = (application: Partial<Application>) => {
  const monthlyIncome = calculateMonthlyIncome(application.income || []);
  const monthlyRent = application.property?.price || 0;

  if (monthlyRent === 0 || monthlyIncome === 0) {
    return { value: 0, score: 0 };
  }

  const ratio = monthlyIncome / monthlyRent;
  let score: number;

  if (ratio >= 3) {
    score = 100;
  } else if (ratio >= 2.5) {
    score = 75 + ((ratio - 2.5) / 0.5) * 25;
  } else if (ratio >= 2) {
    score = 50 + ((ratio - 2) / 0.5) * 25;
  } else if (ratio >= 1.5) {
    score = 25 + ((ratio - 1.5) / 0.5) * 25;
  } else {
    score = (ratio / 1.5) * 25;
  }

  return {
    value: ratio,
    score: Math.round(score),
  };
};

/**
 * 3. Employment Stability
 * Current job 2+ years = 100
 * Current job 1-2 years = 80
 * Current job <1 year but stable history = 60
 * Multiple jobs/gaps = 40
 */
const calculateEmploymentScore = (application: Partial<Application>) => {
  const employment = application.employment || [];

  if (employment.length === 0) {
    return { value: 0, score: 0 };
  }

  const currentJob = employment.find((e) => e.isCurrent);

  if (!currentJob) {
    return { value: 0, score: 40 };
  }

  const yearsAtCurrent = calculateYearsEmployed(currentJob.startDate);
  const totalYearsEmployed = employment.reduce((total, job) => {
    return total + calculateJobDuration(job.startDate, job.endDate);
  }, 0);

  let score: number;

  if (yearsAtCurrent >= 2) {
    score = 100;
  } else if (yearsAtCurrent >= 1) {
    score = 80 + (yearsAtCurrent - 1) * 20;
  } else if (totalYearsEmployed >= 3) {
    score = 60 + yearsAtCurrent * 20;
  } else {
    score = 40 + (totalYearsEmployed / 3) * 20;
  }

  return {
    value: yearsAtCurrent,
    score: Math.round(score),
  };
};

/**
 * 4. Rental History
 * Clean history 2+ years = 100
 * Some history, good refs = 80
 * Limited history = 60
 * Negative feedback = 40
 */
const calculateRentalScore = (application: Partial<Application>) => {
  const rentalHistory = application.rentalHistory || [];

  if (rentalHistory.length === 0) {
    return { value: 0, score: 50 }; // Neutral for first-time renters
  }

  const totalYears = rentalHistory.reduce((total, entry) => {
    return total + calculateRentalDuration(entry.startDate, entry.endDate);
  }, 0);

  const hasNegativeReasons = rentalHistory.some(
    (entry) =>
      entry.reasonForLeaving.toLowerCase().includes("evict") ||
      entry.reasonForLeaving.toLowerCase().includes("dispute") ||
      entry.reasonForLeaving.toLowerCase().includes("late payment"),
  );

  const canContactAll = rentalHistory.every((entry) => entry.canContact);

  let score: number;

  if (hasNegativeReasons) {
    score = 40;
  } else if (totalYears >= 2 && canContactAll) {
    score = 100;
  } else if (totalYears >= 1 && canContactAll) {
    score = 80 + (totalYears - 1) * 20;
  } else if (totalYears >= 1) {
    score = 60 + (totalYears - 1) * 20;
  } else {
    score = 50 + totalYears * 10;
  }

  return {
    value: totalYears,
    score: Math.round(score),
  };
};

/**
 * 5. Background Check
 * Clean = 100
 * Minor issues = 70
 * Major issues = 40
 * Evictions = 20
 */
const calculateBackgroundScore = (application: Partial<Application>) => {
  const backgroundCheck = application.backgroundCheck;

  if (!backgroundCheck || backgroundCheck.status !== "verified") {
    return { value: 0, score: 0 };
  }

  const hasCriminalRecords = backgroundCheck.criminalRecords.length > 0;
  const hasEvictions = backgroundCheck.evictionRecords.length > 0;
  const hasFelonies = backgroundCheck.criminalRecords.some(
    (r) => r.type === "felony",
  );

  let score: number;

  if (hasEvictions) {
    score = 20;
  } else if (hasFelonies) {
    score = 40;
  } else if (hasCriminalRecords) {
    score = 70;
  } else {
    score = 100;
  }

  return {
    value: hasCriminalRecords || hasEvictions ? 1 : 0,
    score,
  };
};

/**
 * 6. Application Completeness
 */
const calculateCompletenessScore = (application: Partial<Application>) => {
  let totalFields = 0;
  let completedFields = 0;

  // Personal Info (8 fields)
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
  if (application.employment && application.employment.length > 0)
    completedFields++;

  // Income (at least 1)
  totalFields += 1;
  if (application.income && application.income.length > 0) completedFields++;

  // Rental History (at least 1)
  totalFields += 1;
  if (application.rentalHistory && application.rentalHistory.length > 0)
    completedFields++;

  // References (at least 2)
  totalFields += 1;
  if (application.references && application.references.length >= 2)
    completedFields++;

  // Emergency Contact
  totalFields += 1;
  if (application.emergencyContact?.name) completedFields++;

  // Move-in preferences
  totalFields += 2;
  if (application.moveInDate) completedFields++;
  if (application.leaseTerm) completedFields++;

  const percentage = (completedFields / totalFields) * 100;

  return {
    value: Math.round(percentage),
    score: Math.round(percentage),
  };
};

// Helper Functions

export const calculateMonthlyIncome = (income: IncomeInfo[]): number => {
  return income.reduce((total, item) => {
    let monthlyAmount = item.amount;

    switch (item.frequency) {
      case "hourly":
        monthlyAmount = item.amount * 40 * 4.33; // 40 hrs/week * 4.33 weeks/month
        break;
      case "weekly":
        monthlyAmount = item.amount * 4.33;
        break;
      case "biweekly":
        monthlyAmount = item.amount * 2.17;
        break;
      case "monthly":
        monthlyAmount = item.amount;
        break;
      case "annually":
        monthlyAmount = item.amount / 12;
        break;
    }

    return total + monthlyAmount;
  }, 0);
};

const calculateYearsEmployed = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears;
};

const calculateJobDuration = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears;
};

const calculateRentalDuration = (
  startDate: string,
  endDate: string,
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears;
};

/**
 * Get rating label based on score
 */
export const getScoreRating = (
  score: number,
): {
  label: "Strong" | "Good" | "Fair" | "Weak";
  color: string;
  description: string;
} => {
  if (score >= 90) {
    return {
      label: "Strong",
      color: "green",
      description: "Excellent applicant - highly recommended",
    };
  } else if (score >= 75) {
    return {
      label: "Good",
      color: "blue",
      description: "Good applicant - recommended with standard verification",
    };
  } else if (score >= 60) {
    return {
      label: "Fair",
      color: "yellow",
      description: "Fair applicant - consider with additional verification",
    };
  } else {
    return {
      label: "Weak",
      color: "red",
      description: "Weak applicant - requires careful review",
    };
  }
};

/**
 * Determine if application qualifies for conditional instant approval
 */
export const qualifiesForInstantApproval = (
  application: Partial<Application>,
): boolean => {
  const score = calculateApplicationScore(application);
  const breakdown = calculateScoreBreakdown(application);

  // Must have 90+ overall score
  if (score < 90) return false;

  // Must have verified credit check
  if (breakdown.creditScore.value < 700) return false;

  // Must have 3x income ratio
  if (breakdown.incomeRatio.value < 3) return false;

  // Must have clean background
  if (breakdown.backgroundCheck.score < 100) return false;

  // Must have employment verification
  if (breakdown.employmentStability.score < 80) return false;

  // Must be 100% complete
  if (breakdown.completeness.score < 100) return false;

  return true;
};
