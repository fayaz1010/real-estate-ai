import {
  type Workflow,
  type WorkflowExecution,
  type WorkflowStep,
  WorkflowExecutionStatus,
} from "../types";

export interface WorkflowContext {
  tenant?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  landlord?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  property?: {
    id: string;
    address: string;
    title: string;
  };
  lease?: {
    id: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
  };
  payment?: {
    amount: string;
    date: string;
    receiptUrl?: string;
  };
  maintenanceRequest?: {
    id: string;
    description: string;
    priority: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
  };
  [key: string]: unknown;
}

interface StepExecutionResult {
  stepId: string;
  stepType: string;
  status: "success" | "error";
  message: string;
  timestamp: string;
}

function interpolateTemplate(
  template: string,
  context: WorkflowContext,
): string {
  return template.replace(
    /\{\{(\w+(?:\.\w+)*)\}\}/g,
    (_match, path: string) => {
      const parts = path.split(".");
      let value: unknown = context;
      for (const part of parts) {
        if (value && typeof value === "object" && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return `{{${path}}}`;
        }
      }
      return String(value ?? `{{${path}}}`);
    },
  );
}

function interpolateConfig<T>(config: T, context: WorkflowContext): T {
  if (typeof config === "string") {
    return interpolateTemplate(config, context) as T;
  }
  if (Array.isArray(config)) {
    return config.map((item) => interpolateConfig(item, context)) as T;
  }
  if (config && typeof config === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      result[key] = interpolateConfig(value, context);
    }
    return result as T;
  }
  return config;
}

async function executeSendEmail(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { recipient, subject, body } = resolved as {
    recipient: string;
    subject: string;
    body: string;
  };

  // In production, this would integrate with an email service (SendGrid, SES, etc.)
  console.log(`[Workflow Engine] Sending email to ${recipient}: "${subject}"`);

  return {
    stepId: "",
    stepType: "send_email",
    status: "success",
    message: `Email sent to ${recipient} with subject "${subject}" (${body.length} chars)`,
    timestamp: new Date().toISOString(),
  };
}

async function executeCreateTask(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { assignee, dueDate, description } = resolved as {
    assignee: string;
    dueDate: string;
    description: string;
  };

  console.log(
    `[Workflow Engine] Creating task for ${assignee}: "${description}" due ${dueDate}`,
  );

  return {
    stepId: "",
    stepType: "create_task",
    status: "success",
    message: `Task created for ${assignee}: "${description}" (due: ${dueDate})`,
    timestamp: new Date().toISOString(),
  };
}

async function executeUpdateProperty(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { propertyId, field, value } = resolved as {
    propertyId: string;
    field: string;
    value: string;
  };

  console.log(
    `[Workflow Engine] Updating property ${propertyId}: ${field} = ${value}`,
  );

  return {
    stepId: "",
    stepType: "update_property",
    status: "success",
    message: `Property ${propertyId} updated: ${field} set to "${value}"`,
    timestamp: new Date().toISOString(),
  };
}

async function executeSendNotification(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { recipientType, recipientId, message } = resolved as {
    recipientType: string;
    recipientId: string;
    message: string;
  };

  console.log(
    `[Workflow Engine] Sending notification to ${recipientType} (${recipientId}): "${message}"`,
  );

  return {
    stepId: "",
    stepType: "send_notification",
    status: "success",
    message: `Notification sent to ${recipientType} (${recipientId}): "${message.substring(0, 80)}..."`,
    timestamp: new Date().toISOString(),
  };
}

async function executeChangeSubscriptionTier(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { userId, newTier } = resolved as { userId: string; newTier: string };

  console.log(
    `[Workflow Engine] Changing subscription for user ${userId} to ${newTier}`,
  );

  return {
    stepId: "",
    stepType: "change_subscription_tier",
    status: "success",
    message: `Subscription tier changed to ${newTier} for user ${userId}`,
    timestamp: new Date().toISOString(),
  };
}

async function executeOptimizeListingSEO(
  config: Record<string, unknown>,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const resolved = interpolateConfig(config, context);
  const { propertyId, keywords } = resolved as {
    propertyId: string;
    keywords: string[];
  };

  console.log(
    `[Workflow Engine] Optimizing SEO for property ${propertyId} with keywords: ${(keywords || []).join(", ")}`,
  );

  return {
    stepId: "",
    stepType: "optimize_listing_seo",
    status: "success",
    message: `SEO optimized for property ${propertyId} with ${(keywords || []).length} keywords`,
    timestamp: new Date().toISOString(),
  };
}

async function executeStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const config: Record<string, unknown> = { ...step.configuration };

  let result: StepExecutionResult;

  switch (step.type) {
    case "send_email":
      result = await executeSendEmail(config, context);
      break;
    case "create_task":
      result = await executeCreateTask(config, context);
      break;
    case "update_property":
      result = await executeUpdateProperty(config, context);
      break;
    case "send_notification":
      result = await executeSendNotification(config, context);
      break;
    case "change_subscription_tier":
      result = await executeChangeSubscriptionTier(config, context);
      break;
    case "optimize_listing_seo":
      result = await executeOptimizeListingSEO(config, context);
      break;
    default:
      result = {
        stepId: step.id,
        stepType: step.type,
        status: "error",
        message: `Unknown step type: ${step.type}`,
        timestamp: new Date().toISOString(),
      };
  }

  result.stepId = step.id;
  return result;
}

export async function runWorkflow(
  workflow: Workflow,
  context: WorkflowContext,
): Promise<WorkflowExecution> {
  const executionId = crypto.randomUUID?.() ?? `exec-${Date.now()}`;
  const logs: string[] = [];

  logs.push(
    `[${new Date().toISOString()}] Starting workflow: "${workflow.name}" (${workflow.id})`,
  );
  logs.push(`[${new Date().toISOString()}] Trigger: ${workflow.triggerType}`);
  logs.push(
    `[${new Date().toISOString()}] Steps to execute: ${workflow.steps.length}`,
  );

  let hasError = false;

  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    logs.push(
      `[${new Date().toISOString()}] Executing step ${i + 1}/${workflow.steps.length}: ${step.type} (${step.id})`,
    );

    try {
      const result = await executeStep(step, context);
      logs.push(
        `[${new Date().toISOString()}] Step ${step.id} ${result.status}: ${result.message}`,
      );

      if (result.status === "error") {
        hasError = true;
        logs.push(
          `[${new Date().toISOString()}] Workflow halted due to step failure`,
        );
        break;
      }
    } catch (error) {
      hasError = true;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logs.push(
        `[${new Date().toISOString()}] Step ${step.id} threw an exception: ${errorMessage}`,
      );
      logs.push(
        `[${new Date().toISOString()}] Workflow halted due to exception`,
      );
      break;
    }
  }

  const finalStatus = hasError
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  logs.push(
    `[${new Date().toISOString()}] Workflow execution ${finalStatus.toLowerCase()}`,
  );

  return {
    id: executionId,
    workflowId: workflow.id,
    status: finalStatus,
    log: logs.join("\n"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
