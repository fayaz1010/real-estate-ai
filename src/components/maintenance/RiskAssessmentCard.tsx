import React from "react";

interface RiskAssessmentCardProps {
  propertyId: string;
  riskScore: number;
}

const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  riskScore,
}) => {
  let riskLevel = "Low";
  let riskColor = "text-realestate-success";
  let riskBg = "bg-realestate-success/5 border-green-200";
  let progressColor = "bg-realestate-success";

  if (riskScore > 30 && riskScore <= 70) {
    riskLevel = "Medium";
    riskColor = "text-yellow-600";
    riskBg = "bg-yellow-50 border-yellow-200";
    progressColor = "bg-yellow-500";
  } else if (riskScore > 70) {
    riskLevel = "High";
    riskColor = "text-red-600";
    riskBg = "bg-red-50 border-red-200";
    progressColor = "bg-red-500";
  }

  return (
    <div className="bg-white shadow-realestate-md rounded-lg p-6 mb-6 border border-gray-100">
      <h3 className="text-lg font-display font-semibold text-[#091a2b] mb-4">
        Property Risk Assessment
      </h3>
      <div className="flex items-center gap-6">
        <div
          className={`flex-shrink-0 w-24 h-24 rounded-full border-4 ${riskBg} flex items-center justify-center`}
        >
          <div className="text-center">
            <span className={`text-2xl font-bold ${riskColor}`}>
              {riskScore}
            </span>
            <p className={`text-xs font-medium ${riskColor}`}>{riskLevel}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#005163] mb-2">Overall Risk Score</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Low (0)</span>
            <span>Medium (50)</span>
            <span>High (100)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentCard;
