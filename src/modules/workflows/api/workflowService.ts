import apiClient from "@/api/client";
import type {
  Workflow,
  WorkflowExecution,
  WorkflowFormData,
} from "../../../features/workflows/types";

export const workflowService = {
  getAll: async (): Promise<Workflow[]> => {
    const response = await apiClient.get("/workflows");
    return response.data.data;
  },

  getById: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get(`/workflows/${id}`);
    return response.data.data;
  },

  create: async (data: WorkflowFormData): Promise<Workflow> => {
    const response = await apiClient.post("/workflows", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<WorkflowFormData>): Promise<Workflow> => {
    const response = await apiClient.patch(`/workflows/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await apiClient.delete(`/workflows/${id}`);
    return response.data.data;
  },

  toggle: async (id: string): Promise<Workflow> => {
    const response = await apiClient.post(`/workflows/${id}/toggle`);
    return response.data.data;
  },

  execute: async (id: string): Promise<WorkflowExecution> => {
    const response = await apiClient.post(`/workflows/${id}/execute`);
    return response.data.data;
  },

  getExecutions: async (id: string): Promise<WorkflowExecution[]> => {
    const response = await apiClient.get(`/workflows/${id}/executions`);
    return response.data.data;
  },
};
