import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  ArrowLeft,
  Shield,
  Loader,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PLANS, formatPrice } from '@/services/billingService';
import { COLORS, TYPOGRAPHY } from '@/types';

import {
  createPaymentIntent,
  getOutstandingBalance,
  getSubscriptionDetails,
} from '../api/paymentService';
import type {
  OutstandingBalance,
  SubscriptionDetails,
} from '../api/paymentService';
import { CheckoutForm } from '../components/CheckoutForm';
import type { PaymentTypeOption } from '../components/CheckoutForm';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';

// ---------------------------------------------------------------------------
// Stripe instance (loaded once)
// ---------------------------------------------------------------------------

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
);

// ---------------------------------------------------------------------------
// Subscription tier cards
// ---------------------------------------------------------------------------

const TIER_FEATURES: Record<string, string[]> = {
  starter: [
    'Up to 25 units',
    'Basic property management',
    'Tenant portal',
    'Rent collection',
    'Limited AI insights',
  ],
  professional: [
    'Up to 100 units',
    'Full AI assistant',
    'Automated tenant screening',
    'Predictive maintenance alerts',
    'Financial reporting',
    'API access',
  ],
  business: [
    'Up to 500 units',
    'Advanced AI analytics',
    'Portfolio optimization',
    'Custom workflows',
    'Priority support',
    'White-label options',
  ],
  enterprise: [
    'Unlimited units',
    'Dedicated AI model training',
    'Custom integrations',
    'SLA guarantees',
    'Dedicated account manager',
    'On-premise option',
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query params: ?type=rent|deposit|subscription&paymentId=xxx&planId=xxx&interval=monthly|yearly
  const paymentType = (searchParams.get('type') ?? 'rent') as PaymentTypeOption;
  const paymentId = searchParams.get('paymentId');
  const planId = searchParams.get('planId');
  const billingInterval = (searchParams.get('interval') ?? 'monthly') as
    | 'monthly'
    | 'yearly';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [balance, setBalance] = useState<OutstandingBalance | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null,
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  // Resolve subscription plan
  const selectedPlan = useMemo(
    () => (planId ? PLANS.find((p) => p.id === planId) : undefined),
    [planId],
  );

  // Compute amount
  const amount = useMemo(() => {
    if (paymentType === 'subscription' && selectedPlan) {
      return billingInterval === 'yearly'
        ? selectedPlan.yearlyPrice
        : selectedPlan.monthlyPrice;
    }
    if (balance) return balance.total;
    return 0;
  }, [paymentType, selectedPlan, billingInterval, balance]);

  // Charge breakdown
  const breakdown = useMemo(() => {
    if (paymentType === 'subscription' && selectedPlan) {
      const items = [
        {
          label: `${selectedPlan.name} Plan (${billingInterval})`,
          amount:
            billingInterval === 'yearly'
              ? selectedPlan.yearlyPrice
              : selectedPlan.monthlyPrice,
        },
      ];
      if (billingInterval === 'yearly') {
        const monthlyCost = selectedPlan.monthlyPrice * 12;
        items.push({
          label: 'Annual discount (20% — 2 months free)',
          amount: -(monthlyCost - selectedPlan.yearlyPrice),
        });
      }
      return items;
    }
    if (balance && balance.payments.length > 0) {
      return balance.payments.map((p) => ({
        label: p.description ?? p.type,
        amount: p.amount,
      }));
    }
    return [];
  }, [paymentType, selectedPlan, billingInterval, balance]);

  // ---- Fetch data on mount ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch balance for rent/deposit
        if (paymentType === 'rent' || paymentType === 'deposit') {
          const balanceData = await getOutstandingBalance();
          if (!cancelled) setBalance(balanceData);
        }

        // Fetch subscription details
        if (paymentType === 'subscription') {
          const subData = await getSubscriptionDetails();
          if (!cancelled) setSubscription(subData);
        }

        // Create payment intent
        if (paymentId) {
          const { clientSecret: secret } =
            await createPaymentIntent(paymentId);
          if (!cancelled) setClientSecret(secret);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load payment information.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentType, paymentId]);

  const handleSuccess = () => {
    navigate('/checkout/success');
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: COLORS.background,
          fontFamily: TYPOGRAPHY.bodyFont,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader
            className="h-8 w-8 animate-spin"
            style={{ color: COLORS.secondary }}
          />
          <span className="text-sm text-gray-500">
            Loading payment information...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: COLORS.background }}
      >
        {/* SEO meta (handled at router level, but set as data attributes for reference) */}
        <div
          data-meta-description="Complete your secure checkout for property management software, rental management software, and automated rent collection software."
          hidden
        />

        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </button>
              <h1
                className="text-3xl font-bold"
                style={{
                  fontFamily: TYPOGRAPHY.displayFont,
                  color: COLORS.primary,
                }}
              >
                Secure Checkout
              </h1>
              <p
                className="mt-1 text-sm text-gray-500"
                style={{ fontFamily: TYPOGRAPHY.bodyFont }}
              >
                Property Management, Powered by AI
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Something went wrong</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Subscription tier display */}
          {paymentType === 'subscription' && selectedPlan && (
            <div
              className="mb-6 rounded-lg border bg-white p-6"
              style={{ fontFamily: TYPOGRAPHY.bodyFont }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="h-5 w-5"
                      style={{ color: COLORS.secondary }}
                    />
                    <h2
                      className="text-lg font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {selectedPlan.name} Plan
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {billingInterval === 'yearly'
                      ? `${formatPrice(selectedPlan.yearlyPrice)}/year (save 20%)`
                      : `${formatPrice(selectedPlan.monthlyPrice)}/month`}
                  </p>
                  {subscription && (
                    <p className="mt-1 text-xs text-gray-400">
                      Current period ends{' '}
                      {new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatPrice(amount)}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{billingInterval === 'yearly' ? 'yr' : 'mo'}
                  </span>
                </div>
              </div>

              {/* Features */}
              {TIER_FEATURES[selectedPlan.id] && (
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TIER_FEATURES[selectedPlan.id].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: COLORS.secondary }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {billingInterval === 'yearly' && (
                <div className="mt-4 rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                  You save{' '}
                  {formatPrice(
                    selectedPlan.monthlyPrice * 12 - selectedPlan.yearlyPrice,
                  )}{' '}
                  per year with annual billing (2 months free)
                </div>
              )}
            </div>
          )}

          {/* All tiers overview (when no specific plan selected) */}
          {paymentType === 'subscription' && !selectedPlan && (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('planId', plan.id);
                    navigate(`?${params.toString()}`, { replace: true });
                  }}
                  className={`rounded-lg border bg-white p-5 text-left transition-shadow hover:shadow-md ${
                    plan.highlighted ? 'border-2 ring-1 ring-blue-100' : ''
                  }`}
                  style={
                    plan.highlighted
                      ? { borderColor: COLORS.secondary }
                      : undefined
                  }
                >
                  {plan.highlighted && (
                    <span
                      className="mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: COLORS.secondary }}
                    >
                      Most Popular
                    </span>
                  )}
                  <h3
                    className="text-lg font-bold"
                    style={{
                      fontFamily: TYPOGRAPHY.displayFont,
                      color: COLORS.primary,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-1">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {formatPrice(plan.monthlyPrice)}
                    </span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    or {formatPrice(plan.yearlyPrice)}/yr (save 20%)
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-1 text-xs text-gray-600"
                      >
                        <Check className="h-3 w-3 text-green-500" />
                        {f}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs text-gray-400">
                        +{plan.features.length - 3} more
                      </li>
                    )}
                  </ul>
                </button>
              ))}
            </div>
          )}

          {/* Two-column layout: Payment method + Checkout form */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left: Payment method selector */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white p-5">
                <PaymentMethodSelector
                  selectedMethodId={selectedMethodId}
                  onSelect={setSelectedMethodId}
                />
              </div>
            </div>

            {/* Right: Checkout form + summary */}
            <div className="lg:col-span-3 space-y-6">
              {/* Charges summary */}
              <div
                className="rounded-lg border bg-white p-5"
                style={{ fontFamily: TYPOGRAPHY.bodyFont }}
              >
                <h3
                  className="mb-4 text-lg font-bold"
                  style={{
                    fontFamily: TYPOGRAPHY.displayFont,
                    color: COLORS.primary,
                  }}
                >
                  Order Summary
                </h3>

                {/* Outstanding balance for rent */}
                {paymentType === 'rent' && balance && (
                  <div className="mb-4 space-y-2">
                    {balance.payments.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>{p.description ?? p.type}</span>
                        <span className="font-medium">
                          {formatPrice(p.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                      <span style={{ color: COLORS.primary }}>
                        Outstanding Balance
                      </span>
                      <span style={{ color: COLORS.primary }}>
                        {formatPrice(balance.total)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkout form */}
                <CheckoutForm
                  paymentType={paymentType}
                  amount={amount}
                  breakdown={breakdown}
                  clientSecret={clientSecret}
                  onSuccess={handleSuccess}
                />
              </div>

              {/* Confirm button (mirrors CheckoutForm submit for page-level CTA) */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Trigger the form submit programmatically
                    const form = document.querySelector<HTMLFormElement>(
                      'form',
                    );
                    form?.requestSubmit();
                  }}
                  disabled={!clientSecret}
                  className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Shield className="h-5 w-5" />
                  Complete Secure Checkout
                </button>
              </div>

              {/* Back to dashboard link */}
              <p
                className="text-center text-sm"
                style={{ fontFamily: TYPOGRAPHY.bodyFont }}
              >
                <a
                  href="/dashboard"
                  className="text-gray-500 underline hover:text-gray-700"
                >
                  Return to Dashboard
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPage;
