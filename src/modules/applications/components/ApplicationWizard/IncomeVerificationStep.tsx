// PLACEHOLDER FILE: components\ApplicationWizard\IncomeVerificationStep.tsx
// TODO: Add your implementation here

import React from 'react';
import { DollarSign, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import { IncomeInfo, IncomeSource } from '../../types/application.types';
import { calculateMonthlyIncome } from '../../utils/scoringAlgorithm';

const IncomeVerificationStep: React.FC = () => {
  const { formData, addArrayItem, updateArrayItem, removeArrayItem } = useApplicationForm();
  const income = formData.income || [];

  const emptyIncome: Partial<IncomeInfo> = {
    source: 'employment',
    amount: 0,
    frequency: 'monthly',
    verificationStatus: 'not_started',
    documents: [],
  };

  const handleAdd = () => {
    addArrayItem('income', emptyIncome);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = { ...income[index], [field]: value };
    updateArrayItem('income', index, updated);
  };

  const handleRemove = (index: number) => {
    if (confirm('Remove this income source?')) {
      removeArrayItem('income', index);
    }
  };

  const getTotalMonthlyIncome = () => {
    return calculateMonthlyIncome(income as IncomeInfo[]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Income Verification</h2>
        <p className="text-gray-600">
          List all sources of income. This helps us determine your qualification for the property.
        </p>
      </div>

      {/* Total Monthly Income */}
      {income.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Monthly Income</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(getTotalMonthlyIncome())}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Annual: {formatCurrency(getTotalMonthlyIncome() * 12)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>
      )}

      {/* Income List */}
      <div className="space-y-4">
        {income.map((inc: Partial<IncomeInfo>, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  Income Source #{index + 1}
                </h3>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Income Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Source *
                </label>
                <select
                  value={inc.source || 'employment'}
                  onChange={(e) => handleUpdate(index, 'source', e.target.value as IncomeSource)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employment">Employment</option>
                  <option value="self_employment">Self Employment</option>
                  <option value="investment">Investment Income</option>
                  <option value="social_security">Social Security</option>
                  <option value="disability">Disability Benefits</option>
                  <option value="retirement">Retirement/Pension</option>
                  <option value="alimony">Alimony/Child Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Amount & Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                    <input
                      type="number"
                      value={inc.amount || ''}
                      onChange={(e) => handleUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={inc.frequency || 'monthly'}
                    onChange={(e) => handleUpdate(index, 'frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Monthly Calculation */}
              {inc.amount && inc.frequency && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    Monthly Income from this source:{' '}
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(calculateMonthlyIncome([inc as IncomeInfo]))}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Income Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Income Source
      </button>

      {income.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No income sources added yet. Click the button above to add your first income source.
        </div>
      )}

      {/* Income Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Income Verification Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include all regular sources of income</li>
          <li>• You'll need to upload supporting documents (paystubs, bank statements, etc.)</li>
          <li>• Most landlords require income to be 3x the monthly rent</li>
          <li>• Self-employment income typically requires tax returns or bank statements</li>
        </ul>
      </div>
    </div>
  );
};

export default IncomeVerificationStep;