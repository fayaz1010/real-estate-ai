import apiClient from "@/api/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  bankAccount?: {
    bankName: string;
    accountType: string;
    last4: string;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface OutstandingBalance {
  total: number;
  payments: Array<{
    id: string;
    type: string;
    amount: number;
    dueDate: string;
    description: string | null;
  }>;
}

export interface SubscriptionDetails {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  interval: 'monthly' | 'yearly';
  status: string;
  currentPeriodEnd: string;
}

// ---------------------------------------------------------------------------
// Payment Intent
// ---------------------------------------------------------------------------

export async function createPaymentIntent(paymentId: string): Promise<PaymentIntentResponse> {
  const { data } = await apiClient.post<{ data: PaymentIntentResponse }>(
    `/payments/${paymentId}/pay`,
  );
  return data.data;
}

export async function confirmPaymentIntent(paymentId: string): Promise<void> {
  await apiClient.post(`/payments/${paymentId}/confirm`);
}

// ---------------------------------------------------------------------------
// Payment Methods
// ---------------------------------------------------------------------------

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await apiClient.get<{ data: PaymentMethod[] }>(
    "/payments/payment-methods",
  );
  return data.data;
}

export async function addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const { data } = await apiClient.post<{ data: PaymentMethod }>(
    "/payments/payment-methods",
    { paymentMethodId },
  );
  return data.data;
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.put(`/payments/payment-methods/${paymentMethodId}/default`);
}

export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.delete(`/payments/payment-methods/${paymentMethodId}`);
}

// ---------------------------------------------------------------------------
// Balance & Subscription
// ---------------------------------------------------------------------------

export async function getOutstandingBalance(): Promise<OutstandingBalance> {
  const { data } = await apiClient.get<{ data: OutstandingBalance }>(
    "/payments/my-payments?status=PAYMENT_PENDING",
  );
  return data.data;
}

export async function getSubscriptionDetails(): Promise<SubscriptionDetails | null> {
  const { data } = await apiClient.get<{ data: SubscriptionDetails | null }>(
    "/billing/subscription",
  );
  return data.data;
}
