import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { AlertCircle, Lock, CreditCard, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatPrice, getMonthlyEquivalent } from "@/services/billingService";
import type { Plan, BillingInterval } from "@/types/billing";

interface CheckoutFormProps {
  plan: Plan;
  interval: BillingInterval;
}

export default function CheckoutForm({ plan, interval }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const monthlyEquiv = getMonthlyEquivalent(plan, interval);
  const totalPrice =
    interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found. Please refresh and try again.");
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (stripeError) {
        setError(
          stripeError.message || "An error occurred with your card details.",
        );
        setProcessing(false);
        return;
      }

      // Send to backend to create subscription
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          interval,
          paymentMethodId: paymentMethod.id,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription.");
      }

      // If the payment requires additional authentication (3D Secure)
      if (data.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.clientSecret,
        );
        if (confirmError) {
          setError(confirmError.message || "Payment confirmation failed.");
          setProcessing(false);
          return;
        }
      }

      // Redirect to billing dashboard on success
      navigate("/billing?success=true");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-heading text-lg text-realestate-primary mb-4">
          Order Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between font-body text-sm">
            <span className="text-gray-600">{plan.name} Plan</span>
            <span className="text-realestate-primary font-medium">
              {formatPrice(monthlyEquiv)}/mo
            </span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-gray-600">Billing cycle</span>
            <span className="text-realestate-primary font-medium capitalize">
              {interval}
            </span>
          </div>
          {interval === "yearly" && (
            <div className="flex justify-between font-body text-sm">
              <span className="text-gray-600">Annual savings</span>
              <span className="text-realestate-success font-medium">
                -{formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="font-body text-base font-semibold text-realestate-primary">
                Total {interval === "yearly" ? "per year" : "per month"}
              </span>
              <span className="font-body text-base font-semibold text-realestate-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
        <p className="font-body text-xs text-gray-400 mt-4">
          Includes a 14-day free trial. You won&apos;t be charged until the
          trial ends.
        </p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="flex items-center gap-2 font-body text-sm font-medium text-realestate-primary mb-3">
            <CreditCard className="w-4 h-4" />
            Card Details
          </label>
          <div className="border border-gray-200 rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-realestate-accent focus-within:border-realestate-accent transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    color: "#1A1A2E",
                    "::placeholder": { color: "#94a3b8" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full flex items-center justify-center gap-2 bg-realestate-accent text-realestate-primary font-body font-semibold px-6 py-3.5 rounded-lg hover:bg-realestate-accent/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-realestate-primary/30 border-t-realestate-primary" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Start Free Trial
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <p className="font-body text-xs text-gray-400">
            Secured by Stripe. Your payment info is never stored on our servers.
          </p>
        </div>
      </form>

      {/* Back link */}
      <button
        onClick={() => navigate("/billing")}
        className="flex items-center gap-2 font-body text-sm text-realestate-secondary hover:text-realestate-primary transition-colors mt-8 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to plans
      </button>
    </div>
  );
}
