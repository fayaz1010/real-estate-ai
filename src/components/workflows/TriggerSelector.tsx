import { Clock, Calendar, Play } from "lucide-react";
import React from "react";

import type {
  WorkflowTriggerType,
  WorkflowTriggerEvent,
} from "../../types/workflow";

const TRIGGER_TYPES: {
  value: WorkflowTriggerType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "event",
    label: "Event",
    icon: <Play className="w-4 h-4" />,
    description: "Triggered when a specific event occurs",
  },
  {
    value: "schedule",
    label: "Schedule",
    icon: <Calendar className="w-4 h-4" />,
    description: "Runs on a recurring schedule",
  },
  {
    value: "manual",
    label: "Manual",
    icon: <Clock className="w-4 h-4" />,
    description: "Run manually on demand",
  },
];

const TRIGGER_EVENTS: { value: WorkflowTriggerEvent; label: string }[] = [
  { value: "lease_expiring", label: "Lease Expiring" },
  { value: "rent_overdue", label: "Rent Overdue" },
  {
    value: "maintenance_request_created",
    label: "Maintenance Request Created",
  },
  {
    value: "tenant_application_received",
    label: "Tenant Application Received",
  },
];

interface TriggerSelectorProps {
  triggerType: WorkflowTriggerType;
  triggerEvent?: WorkflowTriggerEvent;
  triggerSchedule?: string;
  onTriggerTypeChange: (type: WorkflowTriggerType) => void;
  onTriggerEventChange: (event: WorkflowTriggerEvent) => void;
  onTriggerScheduleChange: (schedule: string) => void;
}

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({
  triggerType,
  triggerEvent,
  triggerSchedule,
  onTriggerTypeChange,
  onTriggerEventChange,
  onTriggerScheduleChange,
}) => {
  return (
    <div className="space-y-4">
      <label
        className="block text-sm font-semibold text-[#091a2b]"
        style={{ fontFamily: "Open Sans, sans-serif" }}
      >
        Trigger Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TRIGGER_TYPES.map((trigger) => (
          <button
            key={trigger.value}
            type="button"
            onClick={() => onTriggerTypeChange(trigger.value)}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
              triggerType === trigger.value
                ? "border-[#3b4876] bg-[#3b4876]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`p-2 rounded-md ${triggerType === trigger.value ? "bg-[#3b4876] text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {trigger.icon}
            </div>
            <div>
              <p
                className="font-semibold text-sm text-[#091a2b]"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {trigger.label}
              </p>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {trigger.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {triggerType === "event" && (
        <div className="mt-4">
          <label
            className="block text-sm font-semibold text-[#091a2b] mb-2"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Event
          </label>
          <select
            value={triggerEvent || ""}
            onChange={(e) =>
              onTriggerEventChange(e.target.value as WorkflowTriggerEvent)
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#091a2b] focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <option value="">Select an event...</option>
            {TRIGGER_EVENTS.map((event) => (
              <option key={event.value} value={event.value}>
                {event.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {triggerType === "schedule" && (
        <div className="mt-4">
          <label
            className="block text-sm font-semibold text-[#091a2b] mb-2"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Cron Expression
          </label>
          <input
            type="text"
            value={triggerSchedule || ""}
            onChange={(e) => onTriggerScheduleChange(e.target.value)}
            placeholder="e.g. 0 9 * * 1 (every Monday at 9am)"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#091a2b] focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          />
          <p
            className="mt-1 text-xs text-gray-400"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Standard cron format: minute hour day month weekday
          </p>
        </div>
      )}
    </div>
  );
};
