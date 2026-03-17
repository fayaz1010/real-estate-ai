import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  CreditCard,
  Building2,
  Plus,
  Check,
  Star,
  Trash2,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import {
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  removePaymentMethod,
} from "../api/paymentService";
import type { PaymentMethod } from "../api/paymentService";

import { COLORS, TYPOGRAPHY } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AddMethodMode = null | "card" | "bank";

interface BankFormData {
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: "checking" | "savings";
}

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onSelect: (methodId: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: TYPOGRAPHY.bodyFont,
      fontSize: "16px",
      color: COLORS.textPrimary,
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

const CARD_BRAND_NAMES: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
};

const INITIAL_BANK_FORM: BankFormData = {
  accountHolderName: "",
  routingNumber: "",
  accountNumber: "",
  accountType: "checking",
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateBankForm(data: BankFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.accountHolderName.trim()) {
    errors.accountHolderName = "Account holder name is required";
  }
  if (!/^\d{9}$/.test(data.routingNumber)) {
    errors.routingNumber = "Routing number must be 9 digits";
  }
  if (!/^\d{4,17}$/.test(data.accountNumber)) {
    errors.accountNumber = "Account number must be 4-17 digits";
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethodId,
  onSelect,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState<AddMethodMode>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [bankForm, setBankForm] = useState<BankFormData>(INITIAL_BANK_FORM);
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});

  // ---- Fetch methods ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getPaymentMethods();
        if (!cancelled) {
          setMethods(result);
          // Auto-select default
          const defaultMethod = result.find((m) => m.isDefault);
          if (defaultMethod && !selectedMethodId) {
            onSelect(defaultMethod.id);
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load payment methods.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Add card ----
  const handleAddCard = async () => {
    if (!stripe || !elements) return;
    setAddLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found.");
      setAddLoading(false);
      return;
    }

    const { error: stripeErr, paymentMethod } =
      await stripe.createPaymentMethod({ type: "card", card: cardElement });

    if (stripeErr) {
      setError(stripeErr.message ?? "Failed to add card.");
      setAddLoading(false);
      return;
    }

    try {
      const saved = await addPaymentMethod(paymentMethod!.id);
      setMethods((prev) => [...prev, saved]);
      onSelect(saved.id);
      setAddMode(null);
    } catch {
      setError("Failed to save payment method.");
    } finally {
      setAddLoading(false);
    }
  };

  // ---- Add bank account ----
  const handleAddBank = async () => {
    const validation = validateBankForm(bankForm);
    if (Object.keys(validation).length > 0) {
      setBankErrors(validation);
      return;
    }
    setBankErrors({});
    setAddLoading(true);
    setError(null);

    try {
      // Bank accounts are added via backend/Plaid - send form data to API
      const { data } = await (
        await import("axios")
      ).default.post<{
        data: PaymentMethod;
      }>("/api/payments/payment-methods/bank", bankForm);
      const saved = data.data;
      setMethods((prev) => [...prev, saved]);
      onSelect(saved.id);
      setAddMode(null);
      setBankForm(INITIAL_BANK_FORM);
    } catch {
      setError("Failed to add bank account. Please verify your details.");
    } finally {
      setAddLoading(false);
    }
  };

  // ---- Set default ----
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    } catch {
      setError("Failed to set default payment method.");
    }
  };

  // ---- Remove ----
  const handleRemove = async (id: string) => {
    try {
      await removePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
      if (selectedMethodId === id) onSelect("");
    } catch {
      setError("Failed to remove payment method.");
    }
  };

  // ---- Render helpers ----
  const renderCard = (method: PaymentMethod) => {
    const { card } = method;
    if (!card) return null;
    const brand = CARD_BRAND_NAMES[card.brand] ?? card.brand;
    return (
      <div className="flex items-center gap-3">
        <CreditCard
          className="h-5 w-5 flex-shrink-0"
          style={{ color: COLORS.secondary }}
        />
        <div>
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.primary }}
          >
            {brand} ending in {card.last4}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            Exp {String(card.expMonth).padStart(2, "0")}/{card.expYear}
          </span>
        </div>
      </div>
    );
  };

  const renderBank = (method: PaymentMethod) => {
    const { bankAccount } = method;
    if (!bankAccount) return null;
    return (
      <div className="flex items-center gap-3">
        <Building2
          className="h-5 w-5 flex-shrink-0"
          style={{ color: COLORS.secondary }}
        />
        <div>
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.primary }}
          >
            {bankAccount.bankName} &middot; {bankAccount.accountType}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            ****{bankAccount.last4}
          </span>
        </div>
      </div>
    );
  };

  // ---- Main render ----
  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-12"
        style={{ fontFamily: TYPOGRAPHY.bodyFont }}
      >
        <Loader className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">
          Loading payment methods...
        </span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: TYPOGRAPHY.bodyFont }} className="space-y-4">
      <h4
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: COLORS.primary }}
      >
        Payment Method
      </h4>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Saved methods */}
      {methods.length > 0 && (
        <ul className="space-y-2">
          {methods.map((method) => (
            <li
              key={method.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(method.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(method.id);
              }}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                selectedMethodId === method.id
                  ? "border-2"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={
                selectedMethodId === method.id
                  ? { borderColor: COLORS.primary, backgroundColor: "#f0f4f8" }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                {selectedMethodId === method.id && (
                  <Check
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: COLORS.primary }}
                  />
                )}
                {method.type === "card"
                  ? renderCard(method)
                  : renderBank(method)}
                {method.isDefault && (
                  <span className="ml-2 flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    <Star className="h-3 w-3" /> Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(method.id);
                    }}
                    className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                    title="Set as default"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(method.id);
                  }}
                  className="rounded p-1 text-gray-400 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {methods.length === 0 && !addMode && (
        <p className="text-sm text-gray-500">
          No saved payment methods. Add one below to get started.
        </p>
      )}

      {/* Add method buttons */}
      {!addMode && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAddMode("card")}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium transition-colors hover:border-gray-400"
            style={{ color: COLORS.secondary }}
          >
            <Plus className="h-4 w-4" />
            Add Credit Card
          </button>
          <button
            type="button"
            onClick={() => setAddMode("bank")}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium transition-colors hover:border-gray-400"
            style={{ color: COLORS.secondary }}
          >
            <Plus className="h-4 w-4" />
            Add Bank Account
          </button>
        </div>
      )}

      {/* Add card form */}
      {addMode === "card" && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.primary }}
            >
              Add New Card
            </span>
            <button
              type="button"
              onClick={() => setAddMode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Enter your card details below. Your information is encrypted and
            processed securely by Stripe.
          </p>
          <div className="rounded-md border border-gray-300 px-4 py-3 focus-within:border-blue-400">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          <button
            type="button"
            onClick={handleAddCard}
            disabled={addLoading || !stripe}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: COLORS.primary }}
          >
            {addLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {addLoading ? "Adding..." : "Add Card"}
          </button>
        </div>
      )}

      {/* Add bank form */}
      {addMode === "bank" && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.primary }}
            >
              Add Bank Account
            </span>
            <button
              type="button"
              onClick={() => {
                setAddMode(null);
                setBankErrors({});
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Enter your bank account details. You can also connect via Plaid for
            instant verification if available.
          </p>

          <div className="space-y-3">
            {/* Account holder name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankForm.accountHolderName}
                onChange={(e) =>
                  setBankForm((f) => ({
                    ...f,
                    accountHolderName: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                placeholder="John Doe"
              />
              {bankErrors.accountHolderName && (
                <span className="text-xs text-red-500">
                  {bankErrors.accountHolderName}
                </span>
              )}
            </div>

            {/* Account type */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Account Type
              </label>
              <select
                value={bankForm.accountType}
                onChange={(e) =>
                  setBankForm((f) => ({
                    ...f,
                    accountType: e.target.value as "checking" | "savings",
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            {/* Routing number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Routing Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={bankForm.routingNumber}
                onChange={(e) =>
                  setBankForm((f) => ({
                    ...f,
                    routingNumber: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                placeholder="123456789"
              />
              {bankErrors.routingNumber && (
                <span className="text-xs text-red-500">
                  {bankErrors.routingNumber}
                </span>
              )}
            </div>

            {/* Account number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Account Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={17}
                value={bankForm.accountNumber}
                onChange={(e) =>
                  setBankForm((f) => ({
                    ...f,
                    accountNumber: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                placeholder="0000000000"
              />
              {bankErrors.accountNumber && (
                <span className="text-xs text-red-500">
                  {bankErrors.accountNumber}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBank}
            disabled={addLoading}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: COLORS.primary }}
          >
            {addLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            {addLoading ? "Adding..." : "Add Bank Account"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
