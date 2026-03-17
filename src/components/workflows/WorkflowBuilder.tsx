import { Plus, Save, ArrowLeft } from "lucide-react";
import React, { useState } from "react";

import { createEmptyStep } from "../../services/workflowService";
import type {
  Workflow,
  WorkflowStep,
  WorkflowTriggerType,
  WorkflowTriggerEvent,
} from "../../types/workflow";

import { TriggerSelector } from "./TriggerSelector";
import { WorkflowStepEditor } from "./WorkflowStepEditor";

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (
    data: Omit<Workflow, "id" | "createdAt" | "lastRunAt" | "runCount">,
  ) => void;
  onCancel: () => void;
  saving?: boolean;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
  onCancel,
  saving,
}) => {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>(
    workflow?.triggerType || "manual",
  );
  const [triggerEvent, setTriggerEvent] = useState<
    WorkflowTriggerEvent | undefined
  >(workflow?.triggerEvent);
  const [triggerSchedule, setTriggerSchedule] = useState(
    workflow?.triggerSchedule || "",
  );
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || []);
  const [enabled, setEnabled] = useState(workflow?.enabled ?? true);

  const handleAddStep = () => {
    const newStep = createEmptyStep(workflow?.id || "new", steps.length + 1);
    setSteps([...steps, newStep]);
  };

  const handleStepChange = (index: number, updatedStep: WorkflowStep) => {
    const updated = [...steps];
    updated[index] = updatedStep;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, order: i + 1 }));
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description: description || undefined,
      triggerType,
      triggerEvent: triggerType === "event" ? triggerEvent : undefined,
      triggerSchedule: triggerType === "schedule" ? triggerSchedule : undefined,
      steps,
      enabled,
      userId: workflow?.userId || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#091a2b] transition-colors"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workflows
        </button>
        <div className="flex items-center gap-3">
          <label
            className="flex items-center gap-2 text-sm"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#3b4876] focus:ring-[#3b4876]"
            />
            <span className="text-gray-600">Enabled</span>
          </label>
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#091a2b] text-white rounded-lg text-sm font-semibold hover:bg-[#091a2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Workflow"}
          </button>
        </div>
      </div>

      {/* Name & Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2
          className="text-lg font-bold text-[#091a2b]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Workflow Details
        </h2>
        <div>
          <label
            className="block text-sm font-semibold text-[#091a2b] mb-1.5"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Late Rent Reminder"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#091a2b] focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
            style={{ fontFamily: "Open Sans, sans-serif" }}
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-semibold text-[#091a2b] mb-1.5"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this workflow do?"
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#091a2b] focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none resize-none"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          />
        </div>
      </div>

      {/* Trigger */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2
          className="text-lg font-bold text-[#091a2b] mb-4"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Trigger
        </h2>
        <TriggerSelector
          triggerType={triggerType}
          triggerEvent={triggerEvent}
          triggerSchedule={triggerSchedule}
          onTriggerTypeChange={setTriggerType}
          onTriggerEventChange={setTriggerEvent}
          onTriggerScheduleChange={setTriggerSchedule}
        />
      </div>

      {/* Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-[#091a2b]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Steps ({steps.length})
          </h2>
          <button
            type="button"
            onClick={handleAddStep}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b4876]/10 text-[#3b4876] rounded-lg text-sm font-semibold hover:bg-[#3b4876]/20 transition-colors"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              No steps yet. Add a step to define what this workflow does.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <WorkflowStepEditor
                key={step.id}
                step={step}
                onChange={(updated) => handleStepChange(index, updated)}
                onRemove={() => handleRemoveStep(index)}
              />
            ))}
          </div>
        )}
      </div>
    </form>
  );
};
