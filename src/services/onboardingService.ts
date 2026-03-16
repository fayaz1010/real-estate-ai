import { OnboardingStep } from '../types/onboarding';
import { UserRole } from '../types/user';
import { onboardingStepsByRole } from '../data/onboardingSteps';

const STORAGE_KEY = 'onboarding_progress';

function getCompletedStepIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCompletedStepIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function getOnboardingSteps(role: UserRole): OnboardingStep[] {
  const steps = onboardingStepsByRole[role] || [];
  const completedIds = getCompletedStepIds();
  return steps.map((step) => ({
    ...step,
    completed: completedIds.includes(step.id),
  }));
}

export function markStepCompleted(stepId: string): void {
  const completedIds = getCompletedStepIds();
  if (!completedIds.includes(stepId)) {
    completedIds.push(stepId);
    saveCompletedStepIds(completedIds);
  }
}

export function markStepIncomplete(stepId: string): void {
  const completedIds = getCompletedStepIds().filter((id) => id !== stepId);
  saveCompletedStepIds(completedIds);
}

export function getOnboardingProgress(role: UserRole): {
  total: number;
  completed: number;
  percentage: number;
} {
  const steps = getOnboardingSteps(role);
  const total = steps.length;
  const completed = steps.filter((s) => s.completed).length;
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
