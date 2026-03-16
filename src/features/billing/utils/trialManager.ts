import { Subscription, TRIAL_DURATION_DAYS } from '../types';

export function calculateTrialEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);
  return endDate;
}

export function isTrialActive(subscription: Subscription): boolean {
  if (subscription.status !== 'TRIALING') return false;
  if (!subscription.trialEndDate) return false;
  return new Date(subscription.trialEndDate) > new Date();
}

export function getTrialDaysRemaining(subscription: Subscription): number {
  if (!subscription.trialEndDate) return 0;
  const now = new Date();
  const end = new Date(subscription.trialEndDate);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
