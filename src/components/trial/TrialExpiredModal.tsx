import { AlertTriangle, ArrowRight, X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-expired-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center">
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: "#091a2b" }}
          >
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>

          <h2
            id="trial-expired-title"
            className="mb-2 text-2xl font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#091a2b",
            }}
          >
            Your Free Trial Has Ended
          </h2>

          <p
            className="mb-6 text-gray-600 leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Your AI Property Manager — Never Miss a Beat. Upgrade now to keep
            managing smarter with AI-powered insights, automated workflows, and
            predictive maintenance alerts.
          </p>

          <p
            className="mb-8 text-sm text-gray-500"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Your data is preserved for 30 days. Choose a plan to continue where
            you left off.
          </p>

          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#3b4876",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Choose a Plan
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p
            className="mt-4 text-xs text-gray-400"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Need help deciding?{" "}
            <Link to="/contact" className="underline hover:text-gray-600">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
