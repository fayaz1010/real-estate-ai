// PLACEHOLDER FILE: components\ApplicationReview\ScoringBreakdown.tsx
// TODO: Add your implementation here

import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";

import { Application } from "../../types/application.types";
import { getScoreRating } from "../../utils/scoringAlgorithm";

interface ScoringBreakdownProps {
  application: Application;
}

const ScoringBreakdown: React.FC<ScoringBreakdownProps> = ({ application }) => {
  const scoreRating = getScoreRating(application.score);
  const breakdown = application.scoreBreakdown;

  const scoreCategories = [
    {
      name: "Credit Score",
      key: "creditScore",
      data: breakdown.creditScore,
      icon: "💳",
      description: "Based on credit report (300-850 range)",
    },
    {
      name: "Income-to-Rent Ratio",
      key: "incomeRatio",
      data: breakdown.incomeRatio,
      icon: "💰",
      description: "Monthly income compared to rent (3x is ideal)",
    },
    {
      name: "Employment Stability",
      key: "employmentStability",
      data: breakdown.employmentStability,
      icon: "💼",
      description: "Length and stability of employment history",
    },
    {
      name: "Rental History",
      key: "rentalHistory",
      data: breakdown.rentalHistory,
      icon: "🏠",
      description: "Previous rental experience and landlord references",
    },
    {
      name: "Background Check",
      key: "backgroundCheck",
      data: breakdown.backgroundCheck,
      icon: "🛡️",
      description: "Criminal and eviction record check",
    },
    {
      name: "Application Completeness",
      key: "completeness",
      data: breakdown.completeness,
      icon: "📋",
      description: "How complete the application submission is",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div
        className={`rounded-lg border-2 p-6 ${getScoreColor(application.score)}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Overall Application Score
            </h3>
            <p className="text-sm opacity-80">{scoreRating.description}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-1">{application.score}</div>
            <div className="text-sm font-medium">
              {scoreRating.label} Applicant
            </div>
          </div>
        </div>

        <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(application.score)}`}
            style={{ width: `${application.score}%` }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Score Breakdown
        </h3>
        <div className="space-y-4">
          {scoreCategories.map((category) => {
            const weightedScore = Math.round(
              category.data.score * category.data.weight,
            );
            const maxWeightedScore = Math.round(100 * category.data.weight);

            return (
              <div
                key={category.key}
                className="bg-white border border-gray-200 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-2xl mr-2">{category.icon}</span>
                      <h4 className="font-semibold text-gray-900">
                        {category.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div
                      className={`text-2xl font-bold ${
                        category.data.score >= 90
                          ? "text-green-600"
                          : category.data.score >= 75
                            ? "text-blue-600"
                            : category.data.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                      }`}
                    >
                      {Math.round(category.data.score)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Weight: {Math.round(category.data.weight * 100)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(category.data.score)}`}
                      style={{ width: `${category.data.score}%` }}
                    />
                  </div>
                </div>

                {/* Raw Value & Weighted Score */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    {category.key === "creditScore" && (
                      <span>Credit Score: {category.data.value}</span>
                    )}
                    {category.key === "incomeRatio" && (
                      <span>Ratio: {category.data.value.toFixed(2)}x</span>
                    )}
                    {category.key === "employmentStability" && (
                      <span>Years: {category.data.value.toFixed(1)}</span>
                    )}
                    {category.key === "rentalHistory" && (
                      <span>Years: {category.data.value.toFixed(1)}</span>
                    )}
                    {category.key === "backgroundCheck" && (
                      <span>
                        {category.data.value === 0 ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Clean Record
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Issues Found
                          </span>
                        )}
                      </span>
                    )}
                    {category.key === "completeness" && (
                      <span>{category.data.value}% Complete</span>
                    )}
                  </div>
                  <div className="font-medium text-gray-700">
                    Contributes: {weightedScore} / {maxWeightedScore} points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How Scoring Works</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            The application score is calculated using a weighted algorithm that
            considers multiple factors:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Credit Score (30%):</strong> Higher credit scores indicate
              financial responsibility
            </li>
            <li>
              <strong>Income Ratio (25%):</strong> Monthly income should be 3x
              the rent ideally
            </li>
            <li>
              <strong>Employment (15%):</strong> Longer, stable employment
              history is preferred
            </li>
            <li>
              <strong>Rental History (15%):</strong> Positive references and no
              evictions
            </li>
            <li>
              <strong>Background Check (10%):</strong> Clean criminal and
              eviction record
            </li>
            <li>
              <strong>Completeness (5%):</strong> Fully completed application
              with all documents
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div
        className={`rounded-lg border-2 p-4 ${
          application.score >= 90
            ? "bg-green-50 border-green-200"
            : application.score >= 75
              ? "bg-blue-50 border-blue-200"
              : application.score >= 60
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
        }`}
      >
        <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
        <p className="text-sm">
          {application.score >= 90 && (
            <span className="text-green-800">
              <strong>Strongly Recommended:</strong> This is an excellent
              applicant with high scores across all categories. They meet or
              exceed all qualification criteria.
            </span>
          )}
          {application.score >= 75 && application.score < 90 && (
            <span className="text-blue-800">
              <strong>Recommended:</strong> This is a good applicant who meets
              qualification standards. Consider approving with standard lease
              terms.
            </span>
          )}
          {application.score >= 60 && application.score < 75 && (
            <span className="text-yellow-800">
              <strong>Consider Carefully:</strong> This applicant meets minimum
              requirements but may need additional verification or conditions.
              Review weak areas before deciding.
            </span>
          )}
          {application.score < 60 && (
            <span className="text-red-800">
              <strong>Not Recommended:</strong> This applicant falls below
              standard qualification criteria. Consider requesting additional
              information or co-signer before approval.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ScoringBreakdown;
