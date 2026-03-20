import { Check, Star } from "lucide-react";
import React, { useState } from "react";

import {
  PLANS,
  formatPrice,
  getMonthlyEquivalent,
} from "@/services/billingService";
import type { BillingInterval } from "@/types/billing";

interface PlanSelectorProps {
  currentPlanId?: string;
  onSelect: (planId: string, interval: BillingInterval) => void;
}

export default function PlanSelector({
  currentPlanId,
  onSelect,
}: PlanSelectorProps) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isAnnual = interval === "yearly";

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span
          className={`font-body text-sm font-medium ${!isAnnual ? "text-realestate-primary" : "text-gray-400"}`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAnnual}
          aria-label="Toggle annual billing"
          onClick={() => setInterval(isAnnual ? "monthly" : "yearly")}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 ${
            isAnnual ? "bg-realestate-accent" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isAnnual ? "translate-x-8" : "translate-x-1"}`}
          />
        </button>
        <span
          className={`font-body text-sm font-medium ${isAnnual ? "text-realestate-primary" : "text-gray-400"}`}
        >
          Annual
        </span>
        {isAnnual && (
          <span className="inline-flex items-center rounded-full bg-realestate-success/10 px-3 py-0.5 text-xs font-semibold text-realestate-success">
            Save 20%
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isSelected = plan.id === selectedId;
          const monthlyEquiv = getMonthlyEquivalent(plan, interval);
          const isEnterprise = plan.id === "enterprise";

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                if (!isCurrent && !isEnterprise) {
                  setSelectedId(plan.id);
                }
              }}
              disabled={isCurrent}
              className={`relative text-left rounded-xl p-5 border-2 transition-all duration-200 ${
                isSelected
                  ? "border-realestate-accent bg-realestate-accent/5 shadow-realestate-md"
                  : isCurrent
                    ? "border-realestate-primary/20 bg-gray-50 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-realestate-accent/50 hover:shadow-realestate-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-realestate-accent px-3 py-0.5 text-xs font-bold text-realestate-primary">
                  <Star className="w-3 h-3" />
                  Popular
                </span>
              )}

              <div className="flex items-center justify-between mb-2">
                <h4 className="text-heading text-base text-realestate-primary">
                  {plan.name}
                </h4>
                {isCurrent && (
                  <span className="inline-flex items-center rounded-full bg-realestate-primary/10 px-2.5 py-0.5 text-xs font-semibold text-realestate-primary">
                    Current
                  </span>
                )}
                {isSelected && (
                  <Check className="w-5 h-5 text-realestate-accent" />
                )}
              </div>

              <div className="mb-3">
                <span className="text-display text-2xl text-realestate-primary">
                  {isEnterprise ? "Custom" : formatPrice(monthlyEquiv)}
                </span>
                {!isEnterprise && (
                  <span className="font-body text-sm text-gray-500 ml-1">
                    /mo
                  </span>
                )}
              </div>

              <ul className="space-y-1.5">
                {plan.features.slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 font-body text-xs text-gray-600"
                  >
                    <Check className="w-3.5 h-3.5 text-realestate-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="font-body text-xs text-gray-400">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      {selectedId && selectedId !== currentPlanId && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onSelect(selectedId, interval)}
            className="bg-realestate-accent text-realestate-primary font-body font-semibold px-8 py-3 rounded-lg hover:bg-realestate-accent/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2"
          >
            {currentPlanId ? "Change Plan" : "Select Plan"}
          </button>
        </div>
      )}
    </div>
  );
}
