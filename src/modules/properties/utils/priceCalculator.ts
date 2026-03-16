// FILE PATH: src/modules/properties/utils/priceCalculator.ts
// Module 1.2: Property Listings Management - Price & Mortgage Calculation Utilities

export interface MortgageCalculationInput {
  homePrice: number;
  downPayment: number; // dollar amount or percentage
  downPaymentType: "amount" | "percentage";
  interestRate: number; // annual percentage
  loanTerm: number; // years
  propertyTax?: number; // annual amount
  homeInsurance?: number; // annual amount
  hoaFees?: number; // monthly amount
  pmi?: number; // monthly Private Mortgage Insurance
}

export interface MortgageCalculationResult {
  monthlyPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  pmi: number;
  loanAmount: number;
  downPaymentAmount: number;
  totalInterest: number;
  totalCost: number;
  breakdown: PaymentBreakdown[];
}

export interface PaymentBreakdown {
  label: string;
  amount: number;
  percentage: number;
}

export interface AffordabilityInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
}

export interface AffordabilityResult {
  maxHomePrice: number;
  maxLoanAmount: number;
  maxMonthlyPayment: number;
  debtToIncomeRatio: number;
}

export const priceCalculator = {
  /**
   * Calculate monthly mortgage payment
   */
  calculateMortgage: (
    input: MortgageCalculationInput,
  ): MortgageCalculationResult => {
    // Calculate down payment amount
    const downPaymentAmount =
      input.downPaymentType === "percentage"
        ? (input.homePrice * input.downPayment) / 100
        : input.downPayment;

    // Loan amount
    const loanAmount = input.homePrice - downPaymentAmount;

    // Monthly interest rate
    const monthlyRate = input.interestRate / 100 / 12;

    // Number of payments
    const numberOfPayments = input.loanTerm * 12;

    // Calculate principal and interest using mortgage formula
    // M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, numberOfPayments);
      principalAndInterest =
        (loanAmount * (monthlyRate * factor)) / (factor - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }

    // Monthly property tax
    const monthlyPropertyTax = input.propertyTax ? input.propertyTax / 12 : 0;

    // Monthly home insurance
    const monthlyInsurance = input.homeInsurance ? input.homeInsurance / 12 : 0;

    // HOA fees
    const monthlyHoa = input.hoaFees || 0;

    // PMI (if down payment < 20%)
    const downPaymentPercentage = (downPaymentAmount / input.homePrice) * 100;
    const monthlyPmi =
      downPaymentPercentage < 20
        ? input.pmi || (loanAmount * 0.005) / 12 // Default 0.5% annual PMI
        : 0;

    // Total monthly payment
    const monthlyPayment =
      principalAndInterest +
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyHoa +
      monthlyPmi;

    // Total interest over life of loan
    const totalInterest = principalAndInterest * numberOfPayments - loanAmount;

    // Total cost
    const totalCost =
      input.homePrice +
      totalInterest +
      monthlyPropertyTax * numberOfPayments +
      monthlyInsurance * numberOfPayments +
      monthlyHoa * numberOfPayments +
      monthlyPmi * numberOfPayments;

    // Payment breakdown
    const breakdown: PaymentBreakdown[] = [
      {
        label: "Principal & Interest",
        amount: principalAndInterest,
        percentage: (principalAndInterest / monthlyPayment) * 100,
      },
      {
        label: "Property Tax",
        amount: monthlyPropertyTax,
        percentage: (monthlyPropertyTax / monthlyPayment) * 100,
      },
      {
        label: "Home Insurance",
        amount: monthlyInsurance,
        percentage: (monthlyInsurance / monthlyPayment) * 100,
      },
    ];

    if (monthlyHoa > 0) {
      breakdown.push({
        label: "HOA Fees",
        amount: monthlyHoa,
        percentage: (monthlyHoa / monthlyPayment) * 100,
      });
    }

    if (monthlyPmi > 0) {
      breakdown.push({
        label: "PMI",
        amount: monthlyPmi,
        percentage: (monthlyPmi / monthlyPayment) * 100,
      });
    }

    return {
      monthlyPayment,
      principalAndInterest,
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyInsurance,
      hoaFees: monthlyHoa,
      pmi: monthlyPmi,
      loanAmount,
      downPaymentAmount,
      totalInterest,
      totalCost,
      breakdown,
    };
  },

  /**
   * Calculate affordability based on income
   */
  calculateAffordability: (input: AffordabilityInput): AffordabilityResult => {
    const monthlyIncome = input.annualIncome / 12;

    // 28/36 rule: Housing should be max 28% of gross monthly income
    // Total debt (including housing) should be max 36% of gross monthly income
    const maxHousingExpense = monthlyIncome * 0.28;
    const maxTotalDebt = monthlyIncome * 0.36;

    // Maximum monthly payment available for housing
    const maxMonthlyPayment = Math.min(
      maxHousingExpense,
      maxTotalDebt - input.monthlyDebts,
    );

    // Calculate maximum loan amount based on max monthly payment
    const monthlyRate = input.interestRate / 100 / 12;
    const numberOfPayments = input.loanTerm * 12;

    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, numberOfPayments);
      maxLoanAmount =
        maxMonthlyPayment * ((factor - 1) / (monthlyRate * factor));
    } else {
      maxLoanAmount = maxMonthlyPayment * numberOfPayments;
    }

    // Maximum home price (loan + down payment)
    const maxHomePrice = maxLoanAmount + input.downPayment;

    // Debt-to-income ratio
    const debtToIncomeRatio =
      ((input.monthlyDebts + maxMonthlyPayment) / monthlyIncome) * 100;

    return {
      maxHomePrice,
      maxLoanAmount,
      maxMonthlyPayment,
      debtToIncomeRatio,
    };
  },

  /**
   * Calculate price per square foot
   */
  calculatePricePerSqft: (price: number, sqft: number): number => {
    if (sqft === 0) return 0;
    return Math.round((price / sqft) * 100) / 100;
  },

  /**
   * Calculate total move-in cost for rentals
   */
  calculateMoveInCost: (
    monthlyRent: number,
    securityDeposit?: number,
    lastMonthRent?: number,
    applicationFee?: number,
    petDeposit?: number,
  ): number => {
    const firstMonth = monthlyRent;
    const security = securityDeposit || monthlyRent; // Default to 1 month
    const lastMonth = lastMonthRent || 0;
    const appFee = applicationFee || 0;
    const petFee = petDeposit || 0;

    return firstMonth + security + lastMonth + appFee + petFee;
  },

  /**
   * Calculate estimated property tax (if not provided)
   */
  estimatePropertyTax: (homePrice: number, taxRate: number = 1.1): number => {
    // Default tax rate is 1.1% (national average)
    return (homePrice * taxRate) / 100;
  },

  /**
   * Calculate estimated home insurance (if not provided)
   */
  estimateHomeInsurance: (homePrice: number): number => {
    // Average home insurance is ~$1,400/year or ~0.35% of home value
    return Math.max(1400, homePrice * 0.0035);
  },

  /**
   * Calculate closing costs estimate
   */
  estimateClosingCosts: (homePrice: number): { min: number; max: number } => {
    // Closing costs typically 2-5% of home price
    return {
      min: homePrice * 0.02,
      max: homePrice * 0.05,
    };
  },

  /**
   * Format currency
   */
  formatCurrency: (amount: number, includeCents: boolean = false): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: includeCents ? 2 : 0,
      maximumFractionDigits: includeCents ? 2 : 0,
    });
    return formatter.format(amount);
  },

  /**
   * Format number with commas
   */
  formatNumber: (num: number): string => {
    return num.toLocaleString("en-US");
  },

  /**
   * Format price for display (abbreviate large numbers)
   */
  formatPriceAbbreviated: (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  },

  /**
   * Calculate price change percentage
   */
  calculatePriceChange: (oldPrice: number, newPrice: number): number => {
    if (oldPrice === 0) return 0;
    return ((newPrice - oldPrice) / oldPrice) * 100;
  },

  /**
   * Calculate annual ROI for investment property
   */
  calculateROI: (
    purchasePrice: number,
    monthlyRent: number,
    annualExpenses: number,
    appreciation: number = 3,
  ): {
    cashFlow: number;
    capRate: number;
    totalROI: number;
  } => {
    const annualRent = monthlyRent * 12;
    const cashFlow = annualRent - annualExpenses;
    const capRate = (cashFlow / purchasePrice) * 100;
    const totalROI = capRate + appreciation;

    return {
      cashFlow,
      capRate,
      totalROI,
    };
  },

  /**
   * Calculate rent-to-price ratio
   */
  calculateRentToPriceRatio: (
    monthlyRent: number,
    homePrice: number,
  ): number => {
    const annualRent = monthlyRent * 12;
    return (annualRent / homePrice) * 100;
  },

  /**
   * Determine if it's better to rent or buy (simplified)
   */
  rentVsBuyAnalysis: (
    monthlyRent: number,
    homePrice: number,
    mortgagePayment: number,
    yearsToStay: number,
  ): {
    totalRentCost: number;
    totalBuyCost: number;
    recommendation: "rent" | "buy";
    breakEvenYears: number;
  } => {
    // Simplified calculation
    const totalRentCost = monthlyRent * 12 * yearsToStay;
    const totalBuyCost = mortgagePayment * 12 * yearsToStay;

    // Calculate break-even point
    let breakEvenYears = 0;
    if (monthlyRent < mortgagePayment) {
      breakEvenYears = 999; // Never break even if rent is cheaper
    } else {
      breakEvenYears = homePrice / ((monthlyRent - mortgagePayment) * 12);
    }

    return {
      totalRentCost,
      totalBuyCost,
      recommendation: totalRentCost < totalBuyCost ? "rent" : "buy",
      breakEvenYears: Math.round(breakEvenYears * 10) / 10,
    };
  },
};
