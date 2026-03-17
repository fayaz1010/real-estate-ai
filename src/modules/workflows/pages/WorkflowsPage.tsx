import {
  Plus,
  Zap,
  Play,
  Pause,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layout,
  ChevronRight,
  Activity,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import {
  defaultWorkflows,
  type WorkflowTemplate,
} from "../../../features/workflows/templates/defaultWorkflows";
import type {
  Workflow,
  WorkflowFormData,
  WorkflowExecution,
} from "../../../features/workflows/types";
import {
  TRIGGER_TYPE_LABELS,
  WorkflowTriggerType,
} from "../../../features/workflows/types";
import { workflowService } from "../api/workflowService";
import { WorkflowBuilder } from "../components/WorkflowBuilder";

type ViewMode = "list" | "create" | "edit" | "templates";

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  [WorkflowTriggerType.MANUAL]: <Play className="w-4 h-4" />,
  [WorkflowTriggerType.NEW_TENANT]: <Plus className="w-4 h-4" />,
  [WorkflowTriggerType.LEASE_EXPIRY]: <Clock className="w-4 h-4" />,
  [WorkflowTriggerType.MAINTENANCE_REQUEST]: (
    <AlertTriangle className="w-4 h-4" />
  ),
  [WorkflowTriggerType.PAYMENT_RECEIVED]: <CheckCircle2 className="w-4 h-4" />,
  [WorkflowTriggerType.SCHEDULED]: <Clock className="w-4 h-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "text-green-600 bg-green-100",
  RUNNING: "text-blue-600 bg-blue-100",
  PENDING: "text-amber-600 bg-amber-100",
  FAILED: "text-red-600 bg-red-100",
};

export const WorkflowsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [executionMap, setExecutionMap] = useState<
    Record<string, WorkflowExecution[]>
  >({});

  const fetchWorkflows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workflows");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleCreate = async (data: WorkflowFormData) => {
    setIsSaving(true);
    try {
      await workflowService.create(data);
      await fetchWorkflows();
      setViewMode("list");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create workflow",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: WorkflowFormData) => {
    if (!editingWorkflow) return;
    setIsSaving(true);
    try {
      await workflowService.update(editingWorkflow.id, data);
      await fetchWorkflows();
      setViewMode("list");
      setEditingWorkflow(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update workflow",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await workflowService.delete(id);
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete workflow",
      );
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await workflowService.toggle(id);
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isActive: updated.isActive } : w,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle workflow",
      );
    }
  };

  const handleExecute = async (id: string) => {
    try {
      const execution = await workflowService.execute(id);
      setExecutionMap((prev) => ({
        ...prev,
        [id]: [execution, ...(prev[id] || [])],
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to execute workflow",
      );
    }
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    setEditingWorkflow(null);
    setViewMode("create");
    setTimeout(() => {
      setEditingWorkflow({
        id: "",
        userId: "",
        name: template.name,
        description: template.description,
        triggerType: template.triggerType,
        steps: template.steps,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setViewMode("create");
    }, 0);
  };

  const startEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setViewMode("edit");
  };

  if (viewMode === "create") {
    return (
      <WorkflowBuilder
        initialData={
          editingWorkflow
            ? {
                name: editingWorkflow.name,
                description: editingWorkflow.description,
                triggerType: editingWorkflow.triggerType,
                steps: editingWorkflow.steps,
                isActive: editingWorkflow.isActive,
              }
            : undefined
        }
        onSave={handleCreate}
        onCancel={() => {
          setViewMode("list");
          setEditingWorkflow(null);
        }}
        isSaving={isSaving}
      />
    );
  }

  if (viewMode === "edit" && editingWorkflow) {
    return (
      <WorkflowBuilder
        initialData={{
          id: editingWorkflow.id,
          name: editingWorkflow.name,
          description: editingWorkflow.description,
          triggerType: editingWorkflow.triggerType,
          steps: editingWorkflow.steps,
          isActive: editingWorkflow.isActive,
        }}
        onSave={handleUpdate}
        onCancel={() => {
          setViewMode("list");
          setEditingWorkflow(null);
        }}
        isSaving={isSaving}
      />
    );
  }

  if (viewMode === "templates") {
    return (
      <div className="min-h-screen bg-[#f1f3f4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-bold text-[#091a2b]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Workflow Templates
              </h1>
              <p
                className="text-sm text-gray-500 mt-1"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Start with a pre-built template and customize it
              </p>
            </div>
            <button
              onClick={() => setViewMode("list")}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#091a2b] transition-colors"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Back to Workflows
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultWorkflows.map((template, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#005163]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3b4876]/10 flex items-center justify-center text-[#3b4876]">
                      {TRIGGER_ICONS[template.triggerType] || (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3
                        className="font-bold text-[#091a2b] text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {template.name}
                      </h3>
                      <span
                        className="text-xs text-[#005163] font-medium"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {template.steps.length} steps
                  </span>
                </div>
                <p
                  className="text-sm text-gray-500 mb-4 line-clamp-2"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-[#091a2b]/5 text-[#091a2b] px-2 py-1 rounded font-medium">
                    {TRIGGER_TYPE_LABELS[template.triggerType]}
                  </span>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex items-center gap-1 text-sm font-semibold text-[#005163] hover:text-[#091a2b] transition-colors group-hover:underline"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Use Template
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-[#091a2b]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Workflows
            </h1>
            <p
              className="text-sm text-gray-500 mt-1"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Automate property management tasks with custom workflows
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("templates")}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:border-[#005163] hover:text-[#005163] transition-all"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <Layout className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => {
                setEditingWorkflow(null);
                setViewMode("create");
              }}
              className="flex items-center gap-2 bg-[#091a2b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#091a2b]/90 transition-colors"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#3b4876] mx-auto mb-3" />
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Loading workflows...
              </p>
            </div>
          </div>
        ) : workflows.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-[#3b4876]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#3b4876]" />
            </div>
            <h2
              className="text-xl font-bold text-[#091a2b] mb-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No Workflows Yet
            </h2>
            <p
              className="text-gray-500 text-sm max-w-md mx-auto mb-6"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Create automated workflows to streamline your property management.
              Send emails, create tasks, and update properties automatically.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setViewMode("templates")}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <Layout className="w-4 h-4" />
                Browse Templates
              </button>
              <button
                onClick={() => {
                  setEditingWorkflow(null);
                  setViewMode("create");
                }}
                className="flex items-center gap-2 bg-[#091a2b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#091a2b]/90 transition-colors"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                Create from Scratch
              </button>
            </div>
          </div>
        ) : (
          /* Workflow Cards */
          <div className="space-y-4">
            {workflows.map((workflow) => {
              const executions = executionMap[workflow.id] || [];
              const lastExecution = executions[0];

              return (
                <div
                  key={workflow.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          workflow.isActive
                            ? "bg-[#005163]/10 text-[#005163]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3
                            className="font-bold text-[#091a2b] text-base"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {workflow.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              workflow.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {workflow.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {workflow.description && (
                          <p
                            className="text-sm text-gray-500 mb-3 line-clamp-1"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {workflow.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            {TRIGGER_ICONS[workflow.triggerType] || (
                              <Zap className="w-3 h-3" />
                            )}
                            {TRIGGER_TYPE_LABELS[workflow.triggerType]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {workflow.steps.length} step
                            {workflow.steps.length !== 1 ? "s" : ""}
                          </span>
                          {lastExecution && (
                            <span
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${STATUS_COLORS[lastExecution.status] || ""}`}
                            >
                              {lastExecution.status === "COMPLETED" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : lastExecution.status === "FAILED" ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              Last: {lastExecution.status.toLowerCase()}
                            </span>
                          )}
                          <span>
                            Updated{" "}
                            {new Date(workflow.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => handleExecute(workflow.id)}
                        disabled={!workflow.isActive}
                        className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Execute workflow"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(workflow.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          workflow.isActive
                            ? "hover:bg-amber-50 text-gray-400 hover:text-amber-600"
                            : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                        }`}
                        title={
                          workflow.isActive
                            ? "Pause workflow"
                            : "Activate workflow"
                        }
                      >
                        {workflow.isActive ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => startEdit(workflow)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit workflow"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete workflow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
