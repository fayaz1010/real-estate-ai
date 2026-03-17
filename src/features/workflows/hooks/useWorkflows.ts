import { useState, useCallback, useEffect } from "react";

import type { Workflow, WorkflowFormData } from "../types";

const STORAGE_KEY = "realestate_workflows";

function loadWorkflows(): Workflow[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((w: Workflow) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      }));
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveWorkflows(workflows: Workflow[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
}

export function useWorkflows(userId: string = "current-user") {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWorkflows = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const all = loadWorkflows();
      const userWorkflows = all.filter((w) => w.userId === userId);
      setWorkflows(userWorkflows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workflows");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getWorkflows();
  }, [getWorkflows]);

  const createWorkflow = useCallback(
    (data: WorkflowFormData): Workflow => {
      const now = new Date();
      const newWorkflow: Workflow = {
        id: crypto.randomUUID?.() ?? `wf-${Date.now()}`,
        userId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        steps: data.steps,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
      };

      const all = loadWorkflows();
      all.push(newWorkflow);
      saveWorkflows(all);
      setWorkflows((prev) => [...prev, newWorkflow]);
      return newWorkflow;
    },
    [userId],
  );

  const updateWorkflow = useCallback(
    (workflowId: string, updates: Partial<Workflow>): Workflow | null => {
      const all = loadWorkflows();
      const index = all.findIndex((w) => w.id === workflowId);
      if (index === -1) return null;

      const updated: Workflow = {
        ...all[index],
        ...updates,
        updatedAt: new Date(),
      };
      all[index] = updated;
      saveWorkflows(all);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === workflowId ? updated : w)),
      );
      return updated;
    },
    [],
  );

  const deleteWorkflow = useCallback((workflowId: string): boolean => {
    const all = loadWorkflows();
    const filtered = all.filter((w) => w.id !== workflowId);
    if (filtered.length === all.length) return false;
    saveWorkflows(filtered);
    setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
    return true;
  }, []);

  const toggleWorkflow = useCallback(
    (workflowId: string): Workflow | null => {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (!workflow) return null;
      return updateWorkflow(workflowId, { isActive: !workflow.isActive });
    },
    [workflows, updateWorkflow],
  );

  return {
    workflows,
    isLoading,
    error,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
  };
}
