import {
  Mail,
  ClipboardList,
  Building2,
  Bell,
  CreditCard,
  Search,
  Menu,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";

import type {
  WorkflowStep as WorkflowStepType,
  WorkflowStepType as StepType,
  StepConfiguration,
} from "../../../features/workflows/types";
import { STEP_TYPE_LABELS } from "../../../features/workflows/types";

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
  onUpdate: (stepId: string, updates: Partial<WorkflowStepType>) => void;
  onRemove: (stepId: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  conditionEnabled?: boolean;
  condition?: string;
  onConditionChange?: (stepId: string, condition: string) => void;
}

const STEP_ICONS: Record<StepType, React.ReactNode> = {
  send_email: <Mail className="w-5 h-5" />,
  create_task: <ClipboardList className="w-5 h-5" />,
  update_property: <Building2 className="w-5 h-5" />,
  send_notification: <Bell className="w-5 h-5" />,
  change_subscription_tier: <CreditCard className="w-5 h-5" />,
  optimize_listing_seo: <Search className="w-5 h-5" />,
};

const STEP_COLORS: Record<StepType, string> = {
  send_email: "border-l-blue-500 bg-blue-50/50",
  create_task: "border-l-green-500 bg-green-50/50",
  update_property: "border-l-amber-500 bg-amber-50/50",
  send_notification: "border-l-purple-500 bg-purple-50/50",
  change_subscription_tier: "border-l-rose-500 bg-rose-50/50",
  optimize_listing_seo: "border-l-teal-500 bg-teal-50/50",
};

const STEP_ICON_COLORS: Record<StepType, string> = {
  send_email: "text-blue-600 bg-blue-100",
  create_task: "text-green-600 bg-green-100",
  update_property: "text-amber-600 bg-amber-100",
  send_notification: "text-purple-600 bg-purple-100",
  change_subscription_tier: "text-rose-600 bg-rose-100",
  optimize_listing_seo: "text-teal-600 bg-teal-100",
};

function getConfigFields(stepType: StepType): {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}[] {
  switch (stepType) {
    case "send_email":
      return [
        { key: "recipient", label: "Recipient Email", type: "text" },
        { key: "subject", label: "Subject", type: "text" },
        { key: "body", label: "Email Body", type: "textarea" },
      ];
    case "create_task":
      return [
        { key: "assignee", label: "Assignee ID", type: "text" },
        { key: "dueDate", label: "Due Date", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ];
    case "update_property":
      return [
        { key: "propertyId", label: "Property ID", type: "text" },
        { key: "field", label: "Field to Update", type: "text" },
        { key: "value", label: "New Value", type: "text" },
      ];
    case "send_notification":
      return [
        {
          key: "recipientType",
          label: "Recipient Type",
          type: "select",
          options: ["tenant", "landlord", "agent"],
        },
        { key: "recipientId", label: "Recipient ID", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
      ];
    case "change_subscription_tier":
      return [
        { key: "userId", label: "User ID", type: "text" },
        {
          key: "newTier",
          label: "New Tier",
          type: "select",
          options: ["Starter", "Professional", "Business", "Enterprise"],
        },
      ];
    case "optimize_listing_seo":
      return [
        { key: "propertyId", label: "Property ID", type: "text" },
        {
          key: "keywords",
          label: "Keywords (comma separated)",
          type: "textarea",
        },
      ];
  }
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  step,
  index,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  conditionEnabled,
  condition,
  onConditionChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fields = getConfigFields(step.type);
  const config = step.configuration as unknown as Record<string, unknown>;

  const handleConfigChange = (key: string, value: string) => {
    let processedValue: unknown = value;
    if (key === "keywords") {
      processedValue = value
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }

    const newConfig = {
      ...config,
      [key]: processedValue,
    } as unknown as StepConfiguration;
    onUpdate(step.id, { configuration: newConfig });
  };

  const getFieldValue = (key: string): string => {
    const val = config[key];
    if (Array.isArray(val)) return val.join(", ");
    return String(val ?? "");
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`border-l-4 rounded-lg border border-gray-200 ${STEP_COLORS[step.type]} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
            <Menu className="w-5 h-5" />
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${STEP_ICON_COLORS[step.type]}`}
          >
            {STEP_ICONS[step.type]}
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Step {index + 1}
            </span>
            <h4
              className="font-semibold text-sm text-[#091a2b]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {STEP_TYPE_LABELS[step.type]}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md hover:bg-white/60 text-gray-500 transition-colors"
            aria-label={isExpanded ? "Collapse step" : "Expand step"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onRemove(step.id)}
            className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove step"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {conditionEnabled && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <label
                  className="text-xs font-semibold text-amber-700 uppercase tracking-wider"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Condition (optional)
                </label>
              </div>
              <input
                type="text"
                value={condition || ""}
                onChange={(e) => onConditionChange?.(step.id, e.target.value)}
                placeholder="e.g., {{tenant.creditScore}} >= 600"
                className="w-full px-3 py-2 text-sm border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              />
              <p
                className="text-xs text-amber-600 mt-1"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Use template variables like {"{{tenant.creditScore}}"} with
                comparison operators
              </p>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.key}>
              <label
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={getFieldValue(field.key)}
                  onChange={(e) =>
                    handleConfigChange(field.key, e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent resize-none"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : field.type === "select" ? (
                <select
                  value={getFieldValue(field.key)}
                  onChange={(e) =>
                    handleConfigChange(field.key, e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={getFieldValue(field.key)}
                  onChange={(e) =>
                    handleConfigChange(field.key, e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005163] focus:border-transparent"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}

          <p
            className="text-xs text-gray-400 italic"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Use {"{{variable.path}}"} for dynamic values (e.g.,{" "}
            {"{{tenant.email}}"}, {"{{property.address}}"})
          </p>
        </div>
      )}
    </div>
  );
};
