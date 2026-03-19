// FILE PATH: src/components/MortgageCalculator.tsx
// Mortgage calculator component for non-signed-in users

import { DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";
import React, { useState, useEffect } from "react";

interface MortgageCalculatorProps {
  propertyPrice?: number;
  className?: string;
}

interface MortgageInputs {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
}

interface MortgageResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanToValue: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice = 500000,
  className = "",
}) => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    loanAmount: propertyPrice * 0.8, // Default 80% LTV
    downPayment: propertyPrice * 0.2, // Default 20% down
    interestRate: 6.5, // Current average mortgage rate
    loanTerm: 30,
  });

  const [results, setResults] = useState<MortgageResults>({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    loanToValue: 80,
  });

  // Calculate mortgage when inputs change
  useEffect(() => {
    calculateMortgage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const calculateMortgage = () => {
    const { loanAmount, interestRate, loanTerm } = inputs;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setResults({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        loanToValue: (loanAmount / propertyPrice) * 100,
      });
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    const loanToValue = (loanAmount / propertyPrice) * 100;

    setResults({
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalPayment: isFinite(totalPayment) ? totalPayment : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      loanToValue,
    });
  };

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Mortgage Calculator</h3>
      </div>

      {/* Property Price Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Property Price
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(propertyPrice)}
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              value={inputs.downPayment}
              onChange={(e) => handleInputChange("downPayment", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
              min="0"
              step="1000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ${(propertyPrice * 0.2).toLocaleString()} minimum recommended (20%)
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (APR)
          </label>
          <div className="relative">
            <Percent
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              value={inputs.interestRate}
              onChange={(e) =>
                handleInputChange("interestRate", e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6.5"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Typical range: 5.5% - 7.5%
          </p>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={inputs.loanTerm}
              onChange={(e) => handleInputChange("loanTerm", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          Monthly Payment Estimate
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(results.monthlyPayment)}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(inputs.loanAmount)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Payment:</span>
            <span className="font-medium">
              {formatCurrency(results.totalPayment)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Interest:</span>
            <span className="font-medium">
              {formatCurrency(results.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Loan-to-Value:</span>
            <span className="font-medium">
              {results.loanToValue.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="mb-2">
          <strong>Disclaimer:</strong> This calculator provides estimates only.
          Actual mortgage payments may vary based on your credit score, lender
          fees, property taxes, insurance, and current market rates.
        </p>
        <p>
          Consult with a licensed mortgage professional for accurate quotes and
          pre-approval.
        </p>
      </div>
    </div>
  );
};

export default MortgageCalculator;
