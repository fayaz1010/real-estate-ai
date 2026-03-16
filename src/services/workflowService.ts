import type { Workflow, WorkflowStep } from '../types/workflow';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export const workflowService = {
  async createWorkflow(
    userId: string,
    data: Omit<Workflow, 'id' | 'createdAt' | 'lastRunAt' | 'runCount'>,
  ): Promise<Workflow> {
    return apiCall<Workflow>(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    });
  },

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      return await apiCall<Workflow>(`${API_BASE_URL}/workflows/${id}`);
    } catch {
      return null;
    }
  },

  async getWorkflows(userId: string): Promise<Workflow[]> {
    return apiCall<Workflow[]>(`${API_BASE_URL}/workflows?userId=${encodeURIComponent(userId)}`);
  },

  async updateWorkflow(id: string, data: Partial<Workflow>): Promise<Workflow> {
    return apiCall<Workflow>(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteWorkflow(id: string): Promise<void> {
    await apiCall<void>(`${API_BASE_URL}/workflows/${id}`, { method: 'DELETE' });
  },

  async executeWorkflow(id: string): Promise<void> {
    await apiCall<void>(`${API_BASE_URL}/workflows/${id}/execute`, { method: 'POST' });
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
