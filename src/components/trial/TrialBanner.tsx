import { Clock, ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import type { TrialStatus } from "../../types/trial";

interface TrialBannerProps {
  trialStatus: TrialStatus;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ trialStatus }) => {
  if (!trialStatus.isTrialing || trialStatus.hasConverted) return null;

  const urgencyClass = trialStatus.daysRemaining <= 3 ? "animate-pulse" : "";

  return (
    <div
      className="w-full py-3 px-4 flex items-center justify-center gap-3 flex-wrap"
      style={{
        backgroundColor: "#091a2b",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#f1f3f4" }} />
      <p
        className={`text-sm font-medium ${urgencyClass}`}
        style={{ color: "#f1f3f4" }}
      >
        {trialStatus.daysRemaining === 1
          ? "Your free trial ends tomorrow!"
          : `${trialStatus.daysRemaining} days remaining in your free trial`}
        {" — "}
        <span className="font-semibold">
          Property Management, Powered by AI
        </span>
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
