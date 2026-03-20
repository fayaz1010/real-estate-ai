import {
  Plus,
  Save,
  ArrowLeft,
  Zap,
  Mail,
  ClipboardList,
  Building2,
  Bell,
  CreditCard,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import React, { useState, useCallback } from "react";

import type {
  WorkflowStep as WorkflowStepType,
  WorkflowStepType as StepType,
  StepConfiguration,
  WorkflowFormData,
} from "../../../features/workflows/types";
import {
  WorkflowTriggerType,
  TRIGGER_TYPE_LABELS,
  STEP_TYPE_LABELS,
} from "../../../features/workflows/types";

import { WorkflowStep } from "./WorkflowStep";

interface WorkflowBuilderProps {
  initialData?: WorkflowFormData & { id?: string };
  onSave: (data: WorkflowFormData) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const AVAILABLE_STEPS: {
  type: StepType;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    type: "send_email",
    icon: <Mail className="w-4 h-4" />,
    description: "Send an automated email to a recipient",
  },
  {
    type: "create_task",
    icon: <ClipboardList className="w-4 h-4" />,
    description: "Create a task for a team member",
  },
  {
    type: "update_property",
    icon: <Building2 className="w-4 h-4" />,
    description: "Update a property field or status",
  },
  {
    type: "send_notification",
    icon: <Bell className="w-4 h-4" />,
    description: "Send an in-app or push notification",
  },
  {
    type: "change_subscription_tier",
    icon: <CreditCard className="w-4 h-4" />,
    description: "Change a user's subscription plan",
  },
  {
    type: "optimize_listing_seo",
    icon: <Search className="w-4 h-4" />,
    description: "Optimize property listing SEO keywords",
  },
];

function getDefaultConfig(type: StepType): StepConfiguration {
  switch (type) {
    case "send_email":
      return { recipient: "", subject: "", body: "" };
    case "create_task":
      return { assignee: "", dueDate: "", description: "" };
    case "update_property":
      return { propertyId: "", field: "", value: "" };
    case "send_notification":
      return { recipientType: "tenant" as const, recipientId: "", message: "" };
    case "change_subscription_tier":
      return { userId: "", newTier: "Professional" as const };
    case "optimize_listing_seo":
      return { propertyId: "", keywords: [] };
  }
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>(
    initialData?.triggerType || WorkflowTriggerType.MANUAL,
  );
  const [steps, setSteps] = useState<WorkflowStepType[]>(
    initialData?.steps || [],
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [conditions, setConditions] = useState<Record<string, string>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addStep = useCallback(
    (type: StepType) => {
      const newStep: WorkflowStepType = {
        id: `step-${Date.now()}-${steps.length}`,
        type,
        configuration: getDefaultConfig(type),
      };
      setSteps((prev) => [...prev, newStep]);
    },
    [steps.length],
  );

  const updateStep = useCallback(
    (stepId: string, updates: Partial<WorkflowStepType>) => {
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  const removeStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
    setConditions((prev) => {
      const next = { ...prev };
      delete next[stepId];
      return next;
    });
  }, []);

  const handleConditionChange = useCallback(
    (stepId: string, condition: string) => {
      setConditions((prev) => ({ ...prev, [stepId]: condition }));
    },
    [],
  );

  const handleDragStart = useCallback((_e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) return;

      setSteps((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(draggedIndex, 1);
        updated.splice(dropIndex, 0, moved);
        return updated;
      });
      setDraggedIndex(null);
    },
    [draggedIndex],
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Workflow name is required";
    if (name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (steps.length === 0) newErrors.steps = "At least one step is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const stepsWithConditions = steps.map((step) => {
      const cond = conditions[step.id];
      if (cond) {
        return {
          ...step,
          configuration: {
            ...(step.configuration as unknown as Record<string, unknown>),
            _condition: cond,
          } as unknown as StepConfiguration,
        };
      }
      return step;
    });

    const data: WorkflowFormData = {
      name: name.trim(),
      description: description.trim() || undefined,
      triggerType,
      steps: stepsWithConditions,
      isActive,
    };

    await onSave(data);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-white text-gray-500 hover:text-[#1A1A2E] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-2xl font-bold text-[#1A1A2E]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {initialData?.id ? "Edit Workflow" : "Create Workflow"}
              </h1>
              <p
                className="text-sm text-gray-500 mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Define automated sequences triggered by property management
                events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {isActive ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              {isActive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#1A1A2E] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Workflow"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2
                className="text-lg font-bold text-[#1A1A2E] mb-4"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Workflow Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="e.g., Tenant Onboarding"
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent ${
                      errors.name ? "border-red-400" : "border-gray-300"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this workflow does..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent resize-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Trigger
                  </label>
                  <select
                    value={triggerType}
                    onChange={(e) =>
                      setTriggerType(e.target.value as WorkflowTriggerType)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {Object.entries(TRIGGER_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF6B35]" />
                  <h2
                    className="text-lg font-bold text-[#1A1A2E]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Workflow Steps
                  </h2>
                  <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded-full font-semibold">
                    {steps.length}
                  </span>
                </div>
              </div>

              {errors.steps && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                  <p className="text-red-600 text-sm">{errors.steps}</p>
                </div>
              )}

              {steps.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p
                    className="text-gray-500 text-sm font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    No steps yet. Add actions from the panel on the right.
                  </p>
                  <p
                    className="text-gray-400 text-xs mt-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Drag and drop to reorder steps after adding them.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      {index > 0 && (
                        <div className="flex justify-center">
                          <div className="w-0.5 h-6 bg-gray-300" />
                        </div>
                      )}
                      <WorkflowStep
                        step={step}
                        index={index}
                        onUpdate={updateStep}
                        onRemove={removeStep}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        conditionEnabled
                        condition={conditions[step.id]}
                        onConditionChange={handleConditionChange}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <h3
                className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-4"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Available Actions
              </h3>
              <p
                className="text-xs text-gray-500 mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Click to add an action step to the workflow.
              </p>
              <div className="space-y-2">
                {AVAILABLE_STEPS.map(({ type, icon, description: desc }) => (
                  <button
                    key={type}
                    onClick={() => addStep(type)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#008080] hover:bg-[#008080]/5 transition-all text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 group-hover:bg-[#008080]/10 flex items-center justify-center text-gray-500 group-hover:text-[#008080] transition-colors">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#008080] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {STEP_TYPE_LABELS[type]}
                      </p>
                      <p
                        className="text-xs text-gray-400 mt-0.5"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {desc}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-300 group-hover:text-[#008080] flex-shrink-0 mt-1 transition-colors" />
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4
                  className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider mb-2"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Template Variables
                </h4>
                <div className="space-y-1">
                  {[
                    "{{tenant.email}}",
                    "{{tenant.firstName}}",
                    "{{landlord.id}}",
                    "{{property.address}}",
                    "{{lease.startDate}}",
                    "{{lease.endDate}}",
                    "{{payment.amount}}",
                    "{{maintenanceRequest.description}}",
                  ].map((v) => (
                    <code
                      key={v}
                      className="block text-xs bg-gray-100 text-[#FF6B35] px-2 py-1 rounded font-mono"
                    >
                      {v}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
