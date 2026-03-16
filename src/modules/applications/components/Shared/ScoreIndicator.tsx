import { TrendingUp } from "lucide-react";
import React from "react";

import { getScoreRating } from "../../utils/scoringAlgorithm";

interface ScoreIndicatorProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showBar?: boolean;
  className?: string;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  size = "md",
  showLabel = true,
  showBar = false,
  className = "",
}) => {
  const rating = getScoreRating(score);

  const getColorClasses = () => {
    if (score >= 90)
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        bar: "bg-green-500",
        border: "border-green-200",
      };
    if (score >= 75)
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        bar: "bg-blue-500",
        border: "border-blue-200",
      };
    if (score >= 60)
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        bar: "bg-yellow-500",
        border: "border-yellow-200",
      };
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      bar: "bg-red-500",
      border: "border-red-200",
    };
  };

  const sizeClasses = {
    sm: {
      score: "text-lg",
      label: "text-xs",
      icon: "w-3 h-3",
      padding: "p-2",
    },
    md: {
      score: "text-2xl",
      label: "text-sm",
      icon: "w-4 h-4",
      padding: "p-3",
    },
    lg: {
      score: "text-4xl",
      label: "text-base",
      icon: "w-6 h-6",
      padding: "p-4",
    },
  };

  const colors = getColorClasses();
  const sizes = sizeClasses[size];

  return (
    <div className={className}>
      <div
        className={`${colors.bg} ${colors.border} border rounded-lg ${sizes.padding} inline-flex flex-col items-center`}
      >
        <div className="flex items-center">
          <TrendingUp className={`${sizes.icon} ${colors.text} mr-2`} />
          <span className={`${sizes.score} font-bold ${colors.text}`}>
            {score}
          </span>
        </div>
        {showLabel && (
          <span className={`${sizes.label} font-medium ${colors.text} mt-1`}>
            {rating.label}
          </span>
        )}
      </div>

      {showBar && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${colors.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreIndicator;
