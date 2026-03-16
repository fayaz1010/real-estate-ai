import { priceCalculator } from "../priceCalculator";

describe("priceCalculator", () => {
  describe("calculateMortgage", () => {
    it("calculates a standard 30-year mortgage", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 80000,
        downPaymentType: "amount",
        interestRate: 6.5,
        loanTerm: 30,
      });

      expect(result.loanAmount).toBe(320000);
      expect(result.downPaymentAmount).toBe(80000);
      expect(result.principalAndInterest).toBeGreaterThan(2000);
      expect(result.principalAndInterest).toBeLessThan(2100);
      expect(result.monthlyPayment).toBeGreaterThanOrEqual(
        result.principalAndInterest,
      );
    });

    it("handles percentage-based down payment", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 500000,
        downPayment: 20,
        downPaymentType: "percentage",
        interestRate: 5,
        loanTerm: 30,
      });

      expect(result.downPaymentAmount).toBe(100000);
      expect(result.loanAmount).toBe(400000);
    });

    it("includes PMI when down payment < 20%", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 10,
        downPaymentType: "percentage",
        interestRate: 6,
        loanTerm: 30,
      });

      expect(result.pmi).toBeGreaterThan(0);
    });

    it("excludes PMI when down payment >= 20%", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 20,
        downPaymentType: "percentage",
        interestRate: 6,
        loanTerm: 30,
      });

      expect(result.pmi).toBe(0);
    });

    it("includes property tax and insurance", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 80000,
        downPaymentType: "amount",
        interestRate: 6,
        loanTerm: 30,
        propertyTax: 6000,
        homeInsurance: 1800,
      });

      expect(result.propertyTax).toBe(500);
      expect(result.homeInsurance).toBe(150);
      expect(result.monthlyPayment).toBe(
        result.principalAndInterest +
          result.propertyTax +
          result.homeInsurance +
          result.hoaFees +
          result.pmi,
      );
    });

    it("includes HOA fees", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 80000,
        downPaymentType: "amount",
        interestRate: 6,
        loanTerm: 30,
        hoaFees: 300,
      });

      expect(result.hoaFees).toBe(300);
      expect(result.breakdown.some((b) => b.label === "HOA Fees")).toBe(true);
    });

    it("handles zero interest rate", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 360000,
        downPayment: 0,
        downPaymentType: "amount",
        interestRate: 0,
        loanTerm: 30,
      });

      expect(result.principalAndInterest).toBe(1000);
    });

    it("calculates total interest correctly", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 300000,
        downPayment: 60000,
        downPaymentType: "amount",
        interestRate: 5,
        loanTerm: 30,
      });

      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalCost).toBeGreaterThan(result.loanAmount);
    });

    it("produces breakdown with correct percentages", () => {
      const result = priceCalculator.calculateMortgage({
        homePrice: 400000,
        downPayment: 80000,
        downPaymentType: "amount",
        interestRate: 6,
        loanTerm: 30,
      });

      const totalPercentage = result.breakdown.reduce(
        (sum, b) => sum + b.percentage,
        0,
      );
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });

  describe("calculateAffordability", () => {
    it("calculates max home price based on income", () => {
      const result = priceCalculator.calculateAffordability({
        annualIncome: 120000,
        monthlyDebts: 500,
        downPayment: 50000,
        interestRate: 6,
        loanTerm: 30,
      });

      expect(result.maxHomePrice).toBeGreaterThan(0);
      expect(result.maxLoanAmount).toBeGreaterThan(0);
      expect(result.maxMonthlyPayment).toBeGreaterThan(0);
      expect(result.debtToIncomeRatio).toBeLessThanOrEqual(36);
    });

    it("higher debts reduce affordability", () => {
      const low = priceCalculator.calculateAffordability({
        annualIncome: 100000,
        monthlyDebts: 200,
        downPayment: 50000,
        interestRate: 6,
        loanTerm: 30,
      });

      const high = priceCalculator.calculateAffordability({
        annualIncome: 100000,
        monthlyDebts: 2000,
        downPayment: 50000,
        interestRate: 6,
        loanTerm: 30,
      });

      expect(high.maxHomePrice).toBeLessThan(low.maxHomePrice);
    });
  });

  describe("calculatePricePerSqft", () => {
    it("calculates correctly", () => {
      expect(priceCalculator.calculatePricePerSqft(500000, 2000)).toBe(250);
    });

    it("returns 0 for zero sqft", () => {
      expect(priceCalculator.calculatePricePerSqft(500000, 0)).toBe(0);
    });

    it("rounds to two decimal places", () => {
      const result = priceCalculator.calculatePricePerSqft(100000, 3);
      expect(result).toBe(33333.33);
    });
  });

  describe("calculateMoveInCost", () => {
    it("calculates with all fees", () => {
      const cost = priceCalculator.calculateMoveInCost(
        2000,
        2000,
        2000,
        50,
        500,
      );
      expect(cost).toBe(6550);
    });

    it("defaults security deposit to one month rent", () => {
      const cost = priceCalculator.calculateMoveInCost(2000);
      expect(cost).toBe(4000); // first month + security deposit
    });
  });

  describe("estimatePropertyTax", () => {
    it("uses default 1.1% rate", () => {
      expect(priceCalculator.estimatePropertyTax(400000)).toBeCloseTo(4400);
    });

    it("accepts custom rate", () => {
      expect(priceCalculator.estimatePropertyTax(400000, 2)).toBe(8000);
    });
  });

  describe("estimateHomeInsurance", () => {
    it("returns minimum of $1400", () => {
      expect(priceCalculator.estimateHomeInsurance(100000)).toBe(1400);
    });

    it("scales with home price", () => {
      expect(priceCalculator.estimateHomeInsurance(1000000)).toBe(3500);
    });
  });

  describe("estimateClosingCosts", () => {
    it("returns 2-5% range", () => {
      const result = priceCalculator.estimateClosingCosts(500000);
      expect(result.min).toBe(10000);
      expect(result.max).toBe(25000);
    });
  });

  describe("formatCurrency", () => {
    it("formats without cents by default", () => {
      expect(priceCalculator.formatCurrency(1500)).toBe("$1,500");
    });

    it("formats with cents when requested", () => {
      expect(priceCalculator.formatCurrency(1500.5, true)).toBe("$1,500.50");
    });
  });

  describe("formatPriceAbbreviated", () => {
    it("formats millions", () => {
      expect(priceCalculator.formatPriceAbbreviated(1500000)).toBe("$1.50M");
    });

    it("formats thousands", () => {
      expect(priceCalculator.formatPriceAbbreviated(250000)).toBe("$250K");
    });

    it("formats small amounts", () => {
      expect(priceCalculator.formatPriceAbbreviated(500)).toBe("$500");
    });
  });

  describe("calculatePriceChange", () => {
    it("calculates percentage decrease", () => {
      expect(priceCalculator.calculatePriceChange(1000000, 900000)).toBeCloseTo(
        -10,
      );
    });

    it("calculates percentage increase", () => {
      expect(
        priceCalculator.calculatePriceChange(1000000, 1100000),
      ).toBeCloseTo(10);
    });

    it("returns 0 for same price", () => {
      expect(priceCalculator.calculatePriceChange(500000, 500000)).toBe(0);
    });

    it("returns 0 when old price is 0", () => {
      expect(priceCalculator.calculatePriceChange(0, 500000)).toBe(0);
    });
  });

  describe("calculateROI", () => {
    it("calculates investment metrics", () => {
      const result = priceCalculator.calculateROI(300000, 2500, 18000);
      expect(result.cashFlow).toBe(12000);
      expect(result.capRate).toBeCloseTo(4);
      expect(result.totalROI).toBeCloseTo(7); // 4% cap rate + 3% appreciation
    });
  });

  describe("calculateRentToPriceRatio", () => {
    it("calculates correctly", () => {
      expect(
        priceCalculator.calculateRentToPriceRatio(2000, 400000),
      ).toBeCloseTo(6);
    });
  });

  describe("rentVsBuyAnalysis", () => {
    it("recommends buy when renting costs more", () => {
      const result = priceCalculator.rentVsBuyAnalysis(3000, 400000, 2000, 10);
      expect(result.recommendation).toBe("buy");
      expect(result.totalRentCost).toBe(360000);
      expect(result.totalBuyCost).toBe(240000);
    });

    it("recommends rent when buying costs more", () => {
      const result = priceCalculator.rentVsBuyAnalysis(1500, 600000, 3000, 5);
      expect(result.recommendation).toBe("rent");
    });
  });
});
