export type WorkflowTriggerType = "event" | "schedule" | "manual";

export type WorkflowTriggerEvent =
  | "lease_expiring"
  | "rent_overdue"
  | "maintenance_request_created"
  | "tenant_application_received";

export type WorkflowStepType =
  | "send_email"
  | "create_task"
  | "update_property"
  | "send_sms";

export type WorkflowStep = {
  id: string;
  workflowId: string;
  type: WorkflowStepType;
  order: number;
  configuration: Record<string, unknown>;
};

export type Workflow = {
  id: string;
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  triggerEvent?: WorkflowTriggerEvent;
  triggerSchedule?: string;
  steps: WorkflowStep[];
  enabled: boolean;
  createdAt: Date;
  lastRunAt?: Date;
  runCount: number;
  userId: string;
};
