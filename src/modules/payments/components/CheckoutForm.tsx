import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

import { COLORS, TYPOGRAPHY } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentTypeOption = 'rent' | 'deposit' | 'subscription';

interface ChargeBreakdown {
  label: string;
  amount: number;
}

interface CheckoutFormProps {
  paymentType: PaymentTypeOption;
  amount: number;
  breakdown?: ChargeBreakdown[];
  clientSecret: string | null;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

// ---------------------------------------------------------------------------
// Stripe card element styling
// ---------------------------------------------------------------------------

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: TYPOGRAPHY.bodyFont,
      fontSize: '16px',
      color: COLORS.textPrimary,
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function friendlyStripeError(code: string | undefined): string {
  switch (code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different card.';
    case 'insufficient_funds':
      return 'Insufficient funds. Please try a different payment method.';
    case 'incorrect_number':
      return 'The card number is incorrect. Please check and try again.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    case 'incorrect_cvc':
      return 'The CVC code is incorrect. Please check and try again.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    default:
      return 'Payment failed. Please check your card details and try again.';
  }
}

const PAYMENT_TYPE_LABELS: Record<PaymentTypeOption, string> = {
  rent: 'Rent Payment',
  deposit: 'Security Deposit',
  subscription: 'Subscription Fee',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  paymentType,
  amount,
  breakdown,
  clientSecret,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found.');
      setProcessing(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
        setup_future_usage: saveCard ? 'off_session' : undefined,
      });

    if (stripeError) {
      const message = friendlyStripeError(stripeError.decline_code ?? stripeError.code);
      setError(message);
      onError?.(message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setSucceeded(true);
      onSuccess();
    }

    setProcessing(false);
  };

  // ---- Success state ----
  if (succeeded) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-8 text-center"
        style={{ fontFamily: TYPOGRAPHY.bodyFont }}
      >
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3
          className="mb-2 text-xl font-semibold"
          style={{ color: COLORS.primary }}
        >
          Payment Successful!
        </h3>
        <p className="text-sm text-gray-600">
          Your {PAYMENT_TYPE_LABELS[paymentType].toLowerCase()} of{' '}
          {formatCurrency(amount)} has been processed. A confirmation will be
          sent to your email.
        </p>
      </div>
    );
  }

  // ---- Form ----
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      style={{ fontFamily: TYPOGRAPHY.bodyFont }}
    >
      {/* Charge breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h4
          className="mb-3 text-sm font-semibold uppercase tracking-wide"
          style={{ color: COLORS.primary }}
        >
          {PAYMENT_TYPE_LABELS[paymentType]}
        </h4>

        {breakdown && breakdown.length > 0 ? (
          <ul className="space-y-2">
            {breakdown.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm text-gray-600"
              >
                <span>{item.label}</span>
                <span className="font-medium">{formatCurrency(item.amount)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-semibold">
              <span style={{ color: COLORS.primary }}>Total</span>
              <span style={{ color: COLORS.primary }}>
                {formatCurrency(amount)}
              </span>
            </li>
          </ul>
        ) : (
          <div className="flex items-center justify-between text-base font-semibold">
            <span style={{ color: COLORS.primary }}>Total</span>
            <span style={{ color: COLORS.primary }}>
              {formatCurrency(amount)}
            </span>
          </div>
        )}
      </div>

      {/* Card input */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="h-5 w-5" style={{ color: COLORS.secondary }} />
          <span
            className="text-sm font-semibold"
            style={{ color: COLORS.primary }}
          >
            Card Details
          </span>
        </div>
        <div className="rounded-md border border-gray-300 px-4 py-3 transition-colors focus-within:border-blue-400">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {/* Save card toggle */}
      <label className="flex items-center gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        Save this card for future payments
      </label>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing || !cardComplete || !clientSecret}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Shield className="h-5 w-5" />
        {processing ? 'Processing...' : 'Securely Pay Now'}
      </button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500">
        By completing this payment you agree to our{' '}
        <a href="/terms" className="underline" style={{ color: COLORS.secondary }}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline" style={{ color: COLORS.secondary }}>
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default CheckoutForm;
