import apiClient from '@/api/client';
import type { Workflow, WorkflowStep } from '../types/workflow';

export const workflowService = {
  async createWorkflow(
    userId: string,
    data: Omit<Workflow, 'id' | 'createdAt' | 'lastRunAt' | 'runCount'>,
  ): Promise<Workflow> {
    const { data: result } = await apiClient.post<Workflow>('/workflows', { ...data, userId });
    return result;
  },

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      const { data } = await apiClient.get<Workflow>(`/workflows/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  async getWorkflows(userId: string): Promise<Workflow[]> {
    const { data } = await apiClient.get<Workflow[]>(
      `/workflows?userId=${encodeURIComponent(userId)}`,
    );
    return data;
  },

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const { data } = await apiClient.patch<Workflow>(`/workflows/${id}`, updates);
    return data;
  },

  async deleteWorkflow(id: string): Promise<void> {
    await apiClient.delete(`/workflows/${id}`);
  },

  async executeWorkflow(id: string): Promise<void> {
    await apiClient.post(`/workflows/${id}/execute`);
  },
};

// Local-only helpers for step management (used by the builder UI)
export function createEmptyStep(workflowId: string, order: number): WorkflowStep {
  return {
    id: `step-${Date.now()}-${order}`,
    workflowId,
    type: 'send_email',
    order,
    configuration: {},
  };
}
