// PLACEHOLDER FILE: components\ApplicationReview\CompareApplications.tsx
// TODO: Add your implementation here

import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';
import { Application } from '../../types/application.types';
import { calculateMonthlyIncome } from '../../utils/scoringAlgorithm';

interface CompareApplicationsProps {
  applications: Application[];
  onClose: () => void;
}

const CompareApplications: React.FC<CompareApplicationsProps> = ({ applications, onClose }) => {
  if (applications.length < 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <AlertCircle className="w-6 h-6 text-yellow-600 mb-2" />
        <p className="text-yellow-800">Select at least 2 applications to compare</p>
      </div>
    );
  }

  const comparisonRows = [
    {
      label: 'Overall Score',
      getValue: (app: Application) => app.score,
      format: (val: number) => `${val}/100`,
      highlight: 'max',
    },
    {
      label: 'Credit Score',
      getValue: (app: Application) => app.creditCheck.score,
      format: (val: number) => val.toString(),
      highlight: 'max',
    },
    {
      label: 'Monthly Income',
      getValue: (app: Application) => calculateMonthlyIncome(app.income),
      format: (val: number) => `$${val.toLocaleString()}`,
      highlight: 'max',
    },
    {
      label: 'Income-to-Rent Ratio',
      getValue: (app: Application) => {
        const income = calculateMonthlyIncome(app.income);
        return app.property ? income / app.property.price : 0;
      },
      format: (val: number) => `${val.toFixed(2)}x`,
      highlight: 'max',
    },
    {
      label: 'Employment Years',
      getValue: (app: Application) => {
        const currentJob = app.employment.find(e => e.isCurrent);
        if (!currentJob) return 0;
        const years = (new Date().getTime() - new Date(currentJob.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return years;
      },
      format: (val: number) => `${val.toFixed(1)} years`,
      highlight: 'max',
    },
    {
      label: 'Rental History',
      getValue: (app: Application) => app.rentalHistory.length,
      format: (val: number) => `${val} properties`,
      highlight: 'max',
    },
    {
      label: 'References',
      getValue: (app: Application) => app.references.length,
      format: (val: number) => `${val} references`,
      highlight: 'none',
    },
    {
      label: 'Documents Uploaded',
      getValue: (app: Application) => app.documents.length,
      format: (val: number) => `${val} documents`,
      highlight: 'max',
    },
    {
      label: 'Criminal Records',
      getValue: (app: Application) => app.backgroundCheck.criminalRecords?.length || 0,
      format: (val: number) => val === 0 ? 'Clean' : `${val} record(s)`,
      highlight: 'min',
    },
    {
      label: 'Eviction Records',
      getValue: (app: Application) => app.backgroundCheck.evictionRecords?.length || 0,
      format: (val: number) => val === 0 ? 'None' : `${val} eviction(s)`,
      highlight: 'min',
    },
    {
      label: 'Application Date',
      getValue: (app: Application) => new Date(app.submittedAt || app.createdAt).getTime(),
      format: (val: number) => new Date(val).toLocaleDateString(),
      highlight: 'none',
    },
  ];

  const getHighlightClass = (row: typeof comparisonRows[0], value: number, allValues: number[]) => {
    if (row.highlight === 'none') return '';
    
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    if (row.highlight === 'max' && value === max) {
      return 'bg-green-100 font-semibold text-green-900';
    }
    if (row.highlight === 'min' && value === min && value === 0) {
      return 'bg-green-100 font-semibold text-green-900';
    }
    if (row.highlight === 'min' && value === max && value > 0) {
      return 'bg-red-100 font-semibold text-red-900';
    }
    
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compare Applications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Side-by-side comparison of {applications.length} applicants
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                  Criteria
                </th>
                {applications.map((app) => (
                  <th key={app.id} className="p-4 text-center min-w-[200px]">
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900">
                        {app.personalInfo.firstName} {app.personalInfo.lastName}
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        app.score >= 90 ? 'bg-green-100 text-green-800' :
                        app.score >= 75 ? 'bg-blue-100 text-blue-800' :
                        app.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Score: {app.score}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, rowIndex) => {
                const values = applications.map(app => row.getValue(app));
                
                return (
                  <tr
                    key={rowIndex}
                    className={`border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="p-4 font-medium text-gray-700 sticky left-0 bg-inherit z-10">
                      {row.label}
                    </td>
                    {applications.map((app, appIndex) => {
                      const value = values[appIndex];
                      const highlightClass = getHighlightClass(row, value, values);
                      
                      return (
                        <td
                          key={app.id}
                          className={`p-4 text-center ${highlightClass}`}
                        >
                          {row.format(value)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2" />
              <span className="text-gray-700">Best Value</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2" />
              <span className="text-gray-700">Concern</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareApplications;