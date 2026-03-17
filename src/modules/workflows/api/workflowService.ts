import type {
  Workflow,
  WorkflowExecution,
  WorkflowFormData,
} from "../../../features/workflows/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.error?.message || error.message || "Request failed");
  }

  const result = await response.json();
  return result.data as T;
};

export const workflowService = {
  getAll: () => apiCall<Workflow[]>("/workflows"),

  getById: (id: string) => apiCall<Workflow>(`/workflows/${id}`),

  create: (data: WorkflowFormData) =>
    apiCall<Workflow>("/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<WorkflowFormData>) =>
    apiCall<Workflow>(`/workflows/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ deleted: boolean }>(`/workflows/${id}`, {
      method: "DELETE",
    }),

  toggle: (id: string) =>
    apiCall<Workflow>(`/workflows/${id}/toggle`, {
      method: "POST",
    }),

  execute: (id: string) =>
    apiCall<WorkflowExecution>(`/workflows/${id}/execute`, {
      method: "POST",
    }),

  getExecutions: (id: string) =>
    apiCall<WorkflowExecution[]>(`/workflows/${id}/executions`),
};
