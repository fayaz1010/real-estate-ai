import { TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  changePercent: number;
  icon: React.ReactNode;
  loading?: boolean;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  changePercent,
  icon,
  loading = false,
}) => {
  const isPositive = changePercent >= 0;

  if (loading) {
    return (
      <div className="bg-[#f1f3f4] rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f4] rounded-lg p-6 transition-shadow hover:shadow-realestate-md">
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-medium text-[#091a2b]/70 uppercase tracking-wide"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {title}
        </h3>
        <div className="text-[#3b4876]">{icon}</div>
      </div>
      <p
        className="text-2xl font-bold text-[#091a2b] mb-2"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        {value}
      </p>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-[#005163]" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[#dc2626]" />
        )}
        <span
          className={`text-sm font-semibold ${isPositive ? "text-[#005163]" : "text-[#dc2626]"}`}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {isPositive ? "+" : ""}
          {changePercent.toFixed(1)}%
        </span>
        <span
          className="text-xs text-[#091a2b]/50 ml-1"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          vs previous period
        </span>
      </div>
    </div>
  );
};
