import type {
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  UpdateSubscriptionRequest,
  Plan,
  Subscription,
  Invoice,
} from '../../features/billing/types';
import * as stripeService from '../services/stripeService';

type ApiHandler<T> = () => Promise<{ data: T | null; error: string | null; status: number }>;

export const subscribe: ApiHandler<Subscription> = async () => {
  return { data: null, error: 'Server-side only — use API endpoint POST /api/billing/subscribe', status: 501 };
};

export const cancel: ApiHandler<{ success: boolean }> = async () => {
  return { data: null, error: 'Server-side only — use API endpoint POST /api/billing/cancel', status: 501 };
};

export const getSubscription: ApiHandler<Subscription> = async () => {
  return { data: null, error: 'Server-side only — use API endpoint GET /api/billing/subscription', status: 501 };
};

export const getInvoices: ApiHandler<Invoice[]> = async () => {
  return { data: null, error: 'Server-side only — use API endpoint GET /api/billing/invoices', status: 501 };
};

export type {
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  UpdateSubscriptionRequest,
  Plan,
  Subscription,
  Invoice,
};

export { stripeService };
