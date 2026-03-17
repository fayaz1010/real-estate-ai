import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

interface TrialBannerProps {
  trialExpirationDate: string;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({
  trialExpirationDate,
}) => {
  const now = new Date();
  const endDate = new Date(trialExpirationDate);
  const msRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(
    0,
    Math.ceil(msRemaining / (1000 * 60 * 60 * 24)),
  );

  if (daysRemaining <= 0) return null;

  const isExpiringSoon = daysRemaining <= 3;

  let statusText: string;
  if (daysRemaining === 1) {
    statusText = "Your free trial ends tomorrow!";
  } else if (isExpiringSoon) {
    statusText = `Trial Expiring Soon - ${daysRemaining} days remaining`;
  } else {
    statusText = `Free Trial - ${daysRemaining} days remaining`;
  }

  return (
    <div
      className={`w-full py-3 px-4 flex items-center justify-center gap-3 flex-wrap ${isExpiringSoon ? "animate-pulse" : ""}`}
      style={{
        backgroundColor: "#091a2b",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#f1f3f4" }} />
      <p className="text-sm font-medium" style={{ color: "#f1f3f4" }}>
        {statusText}
      </p>
      <Link
        to="/pricing"
        className="inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "#3b4876",
          color: "#f1f3f4",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        Upgrade Now
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
