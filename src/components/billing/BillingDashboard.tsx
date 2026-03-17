import {
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import InvoiceHistory from "./InvoiceHistory";
import PlanSelector from "./PlanSelector";

import {
  getCurrentSubscription,
  getUsageSummary,
  createBillingPortalSession,
  cancelSubscription,
  getPlanById,
  formatPrice,
  PLANS,
} from "@/services/billingService";
import type { Subscription, UsageSummary } from "@/types/billing";
import type { BillingInterval } from "@/types/billing";

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="font-body text-sm text-gray-700">{label}</span>
        <span
          className={`font-body text-sm font-medium ${isNearLimit ? "text-red-600" : "text-gray-600"}`}
        >
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearLimit ? "bg-red-400" : "bg-realestate-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="font-body text-xs text-red-500 mt-1">
          Approaching limit — consider upgrading your plan.
        </p>
      )}
    </div>
  );
}

export default function BillingDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const showSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    Promise.all([getCurrentSubscription(), getUsageSummary()])
      .then(([sub, usg]) => {
        setSubscription(sub);
        setUsage(usg);
      })
      .catch(() => setError("Failed to load billing data."))
      .finally(() => setLoading(false));
  }, []);

  const currentPlan = subscription ? getPlanById(subscription.planId) : null;

  const handleManagePayment = async () => {
    try {
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch {
      setError("Failed to open billing portal. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel? Your access will continue until the end of the current billing period.",
      )
    ) {
      return;
    }
    setCancelling(true);
    try {
      await cancelSubscription();
      const sub = await getCurrentSubscription();
      setSubscription(sub);
    } catch {
      setError(
        "Failed to cancel subscription. Please try again or contact support.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handlePlanChange = (planId: string, interval: BillingInterval) => {
    navigate(`/billing/checkout?plan=${planId}&interval=${interval}`);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="section-container max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-100 rounded w-48" />
            <div className="h-48 bg-gray-100 rounded-xl" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="section-container max-w-4xl">
        <h1 className="text-display text-3xl text-realestate-primary mb-2">
          Billing & Subscription
        </h1>
        <p className="font-body text-sm text-gray-500 mb-8">
          Manage your plan, payment method, and view invoices.
        </p>

        {/* Success message */}
        {showSuccess && (
          <div
            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            role="status"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="font-body text-sm text-green-700">
              Your subscription has been updated successfully.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="font-body text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Current Plan */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-realestate-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading text-lg text-realestate-primary flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Plan
            </h2>
            {subscription && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                  subscription.status === "active"
                    ? "bg-green-100 text-green-700"
                    : subscription.status === "trialing"
                      ? "bg-blue-100 text-blue-700"
                      : subscription.status === "past_due"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                }`}
              >
                {subscription.status === "trialing"
                  ? "Trial"
                  : subscription.status.replace("_", " ")}
              </span>
            )}
          </div>

          {currentPlan ? (
            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-display text-2xl text-realestate-primary">
                  {currentPlan.name}
                </span>
                <span className="font-body text-sm text-gray-500">
                  {formatPrice(currentPlan.monthlyPrice)}/mo
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {currentPlan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 font-body text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {subscription?.cancelAtPeriodEnd && (
                <p className="font-body text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">
                  Your subscription will be canceled at the end of the current
                  billing period (
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                  ).
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPlanSelector(!showPlanSelector)}
                  className="inline-flex items-center gap-2 font-body text-sm font-medium text-realestate-primary border border-realestate-primary rounded-lg px-4 py-2 hover:bg-realestate-primary hover:text-white transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Change Plan
                </button>
                <button
                  onClick={handleManagePayment}
                  className="inline-flex items-center gap-2 font-body text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Update Payment Method
                </button>
                {!subscription?.cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="inline-flex items-center gap-2 font-body text-sm font-medium text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Subscription"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="font-body text-gray-500 mb-4">
                You don&apos;t have an active subscription.
              </p>
              <button
                onClick={() => navigate("/billing")}
                className="bg-realestate-accent text-realestate-primary font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-realestate-accent/90 transition-all"
              >
                View Plans
              </button>
            </div>
          )}
        </section>

        {/* Plan Selector (toggle) */}
        {showPlanSelector && (
          <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-realestate-sm">
            <h2 className="text-heading text-lg text-realestate-primary mb-4">
              Select a New Plan
            </h2>
            <PlanSelector
              currentPlanId={subscription?.planId}
              onSelect={handlePlanChange}
            />
          </section>
        )}

        {/* Usage */}
        {usage && currentPlan && (
          <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-realestate-sm">
            <h2 className="text-heading text-lg text-realestate-primary flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              Usage
            </h2>
            <div className="space-y-5">
              <UsageBar
                label="Properties"
                used={usage.properties.used}
                limit={usage.properties.limit}
              />
              <UsageBar
                label="Units"
                used={usage.units.used}
                limit={usage.units.limit}
              />
              <UsageBar
                label="Team Members"
                used={usage.users.used}
                limit={usage.users.limit}
              />
            </div>
          </section>
        )}

        {/* Invoice History */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-realestate-sm">
          <h2 className="text-heading text-lg text-realestate-primary flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            Invoice History
          </h2>
          <InvoiceHistory />
        </section>

        {/* Support */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-heading text-base text-realestate-primary mb-2">
            Need help with billing?
          </h2>
          <p className="font-body text-sm text-gray-600 mb-3">
            Contact our support team for any billing inquiries, payment issues,
            or plan recommendations.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-realestate-accent hover:text-realestate-accent/80 transition-colors"
          >
            Contact Support
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
