// PLACEHOLDER FILE: components\Verification\CreditReport.tsx
// TODO: Add your implementation here

import { CreditCard, AlertTriangle, CheckCircle, Download } from "lucide-react";
import React from "react";

import { Application } from "../../types/application.types";

interface CreditReportProps {
  application: Application;
}

const CreditReport: React.FC<CreditReportProps> = ({ application }) => {
  const creditCheck = application.creditCheck;

  if (!creditCheck || creditCheck.status !== "verified") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mb-2" />
        <p className="text-yellow-800">Credit report not yet available</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 750)
      return {
        bg: "bg-green-50",
        border: "border-green-500",
        text: "text-green-700",
        rating: "Excellent",
      };
    if (score >= 700)
      return {
        bg: "bg-blue-50",
        border: "border-blue-500",
        text: "text-blue-700",
        rating: "Good",
      };
    if (score >= 650)
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-500",
        text: "text-yellow-700",
        rating: "Fair",
      };
    if (score >= 600)
      return {
        bg: "bg-orange-50",
        border: "border-orange-500",
        text: "text-orange-700",
        rating: "Poor",
      };
    return {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
      rating: "Very Poor",
    };
  };

  const colors = getScoreColor(creditCheck.score);

  return (
    <div className="space-y-6">
      {/* Credit Score */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Credit Score
            </p>
            <p className={`text-5xl font-bold ${colors.text}`}>
              {creditCheck.score}
            </p>
            <p className={`text-sm font-medium mt-1 ${colors.text}`}>
              {colors.rating}
            </p>
          </div>
          <CreditCard className={`w-16 h-16 ${colors.text}`} />
        </div>

        <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all ${colors.border.replace("border", "bg")}`}
            style={{ width: `${((creditCheck.score - 300) / 550) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>300</span>
          <span>850</span>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Credit Report Details
          </h3>
          {creditCheck.reportUrl && (
            <a
              href={creditCheck.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Full Report
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Provider</p>
            <p className="font-medium text-gray-900 capitalize">
              {creditCheck.provider}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Report Date</p>
            <p className="font-medium text-gray-900">
              {new Date(creditCheck.pulledAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="font-medium text-green-700">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {creditCheck.alerts && creditCheck.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">
                Credit Alerts
              </h4>
              <ul className="space-y-1">
                {creditCheck.alerts.map((alert, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Score Interpretation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">
          What This Score Means
        </h4>
        <div className="space-y-4 text-sm text-blue-800">
          {creditCheck.score >= 750 && (
            <div>
              <p className="font-medium mb-1">Excellent Credit (750+)</p>
              <p>
                This applicant has excellent credit and is likely to be approved
                for most rentals. They have a strong history of on-time payments
                and responsible credit use.
              </p>
            </div>
          )}
          {creditCheck.score >= 700 && creditCheck.score < 750 && (
            <div>
              <p className="font-medium mb-1">Good Credit (700-749)</p>
              <p>
                This applicant has good credit and should qualify for most
                rentals. They demonstrate reliable payment history with minor
                blemishes if any.
              </p>
            </div>
          )}
          {creditCheck.score >= 650 && creditCheck.score < 700 && (
            <div>
              <p className="font-medium mb-1">Fair Credit (650-699)</p>
              <p>
                This applicant has fair credit. They may qualify but might need
                additional verification or a higher deposit. Review other
                factors carefully.
              </p>
            </div>
          )}
          {creditCheck.score >= 600 && creditCheck.score < 650 && (
            <div>
              <p className="font-medium mb-1">Poor Credit (600-649)</p>
              <p>
                This applicant has poor credit. Consider requiring a co-signer,
                higher deposit, or additional verification before approval.
              </p>
            </div>
          )}
          {creditCheck.score < 600 && (
            <div>
              <p className="font-medium mb-1">Very Poor Credit (Below 600)</p>
              <p>
                This applicant has significant credit challenges. Strongly
                consider requiring a co-signer or guarantor, and verify other
                qualifications thoroughly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Credit Score Range Guide */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Credit Score Ranges
        </h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-600">800-850</div>
            <div className="flex-1 h-8 bg-green-100 rounded flex items-center px-3">
              <span className="text-sm font-medium text-green-800">
                Exceptional
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-600">740-799</div>
            <div className="flex-1 h-8 bg-green-50 rounded flex items-center px-3">
              <span className="text-sm font-medium text-green-700">
                Very Good
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-600">670-739</div>
            <div className="flex-1 h-8 bg-blue-50 rounded flex items-center px-3">
              <span className="text-sm font-medium text-blue-700">Good</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-600">580-669</div>
            <div className="flex-1 h-8 bg-yellow-50 rounded flex items-center px-3">
              <span className="text-sm font-medium text-yellow-700">Fair</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm text-gray-600">300-579</div>
            <div className="flex-1 h-8 bg-red-50 rounded flex items-center px-3">
              <span className="text-sm font-medium text-red-700">Poor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Credit scores are provided by{" "}
          {creditCheck.provider} and are one factor in the application decision.
          Other factors including income, employment, and rental history are
          also considered. This information is confidential and should only be
          used for application evaluation purposes.
        </p>
      </div>
    </div>
  );
};

export default CreditReport;
