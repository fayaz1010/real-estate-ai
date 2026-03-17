import axios from 'axios';

const API_BASE = '/api/payments';

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
  const { data } = await axios.post<{ data: PaymentIntentResponse }>(
    `${API_BASE}/${paymentId}/pay`,
  );
  return data.data;
}

export async function confirmPaymentIntent(paymentId: string): Promise<void> {
  await axios.post(`${API_BASE}/${paymentId}/confirm`);
}

// ---------------------------------------------------------------------------
// Payment Methods
// ---------------------------------------------------------------------------

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await axios.get<{ data: PaymentMethod[] }>(
    `${API_BASE}/payment-methods`,
  );
  return data.data;
}

export async function addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const { data } = await axios.post<{ data: PaymentMethod }>(
    `${API_BASE}/payment-methods`,
    { paymentMethodId },
  );
  return data.data;
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  await axios.put(`${API_BASE}/payment-methods/${paymentMethodId}/default`);
}

export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  await axios.delete(`${API_BASE}/payment-methods/${paymentMethodId}`);
}

// ---------------------------------------------------------------------------
// Balance & Subscription
// ---------------------------------------------------------------------------

export async function getOutstandingBalance(): Promise<OutstandingBalance> {
  const { data } = await axios.get<{ data: OutstandingBalance }>(
    `${API_BASE}/my-payments?status=PAYMENT_PENDING`,
  );
  return data.data;
}

export async function getSubscriptionDetails(): Promise<SubscriptionDetails | null> {
  const { data } = await axios.get<{ data: SubscriptionDetails | null }>(
    '/api/billing/subscription',
  );
  return data.data;
}
