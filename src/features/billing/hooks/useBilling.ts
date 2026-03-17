import { useState, useCallback } from "react";

import type { Subscription, Invoice, Plan, BillingInterval } from "../types";

import apiClient from "@/api/client";

interface UseBillingReturn {
  subscription: Subscription | null;
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  createSubscription: (
    plan: Plan,
    interval: BillingInterval,
    paymentMethodId: string,
  ) => Promise<void>;
  cancelSubscription: (cancelAtPeriodEnd: boolean) => Promise<void>;
  updateSubscription: (plan: Plan, interval?: BillingInterval) => Promise<void>;
}

export function useBilling(): UseBillingReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Subscription }>(
        "/billing/subscription",
      );
      setSubscription(res.data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch subscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Invoice[] }>("/billing/invoices");
      setInvoices(res.data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch invoices";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(
    async (plan: Plan, interval: BillingInterval, paymentMethodId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.post<{ data: Subscription }>(
          "/billing/subscribe",
          {
            plan,
            interval,
            paymentMethodId,
          },
        );
        setSubscription(res.data.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create subscription";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cancelSubscription = useCallback(
    async (cancelAtPeriodEnd: boolean) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.post("/billing/cancel", { cancelAtPeriodEnd });
        await fetchSubscription();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to cancel subscription";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscription],
  );

  const updateSubscription = useCallback(
    async (plan: Plan, interval?: BillingInterval) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.put<{ data: Subscription }>(
          "/billing/subscription",
          {
            plan,
            interval,
          },
        );
        setSubscription(res.data.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update subscription";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    subscription,
    invoices,
    loading,
    error,
    fetchSubscription,
    fetchInvoices,
    createSubscription,
    cancelSubscription,
    updateSubscription,
  };
}
