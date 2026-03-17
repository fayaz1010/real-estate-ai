// Workflow Service - Business Logic
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export class WorkflowService {
  async create(
    userId: string,
    data: {
      name: string;
      description?: string;
      triggerType: string;
      steps: unknown[];
      isActive?: boolean;
    },
  ) {
    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name: data.name,
        description: data.description || null,
        triggerType: data.triggerType as Parameters<
          typeof prisma.workflow.create
        >[0]["data"]["triggerType"],
        steps: data.steps as Parameters<
          typeof prisma.workflow.create
        >[0]["data"]["steps"],
        isActive: data.isActive ?? true,
      },
    });

    return workflow;
  }

  async getAll(userId: string) {
    return prisma.workflow.findMany({
      where: { userId },
      include: {
        _count: { select: { executions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
      include: {
        executions: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!workflow) throw new AppError("Workflow not found", 404);
    return workflow;
  }

  async update(
    workflowId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      triggerType?: string;
      steps?: unknown[];
      isActive?: boolean;
    },
  ) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });
    if (!workflow)
      throw new AppError("Workflow not found or access denied", 404);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.triggerType !== undefined)
      updateData.triggerType = data.triggerType;
    if (data.steps !== undefined) updateData.steps = data.steps;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.workflow.update({
      where: { id: workflowId },
      data: updateData,
    });
  }

  async delete(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });
    if (!workflow)
      throw new AppError("Workflow not found or access denied", 404);

    await prisma.workflow.delete({ where: { id: workflowId } });
    return { deleted: true };
  }

  async toggle(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });
    if (!workflow)
      throw new AppError("Workflow not found or access denied", 404);

    return prisma.workflow.update({
      where: { id: workflowId },
      data: { isActive: !workflow.isActive },
    });
  }

  async execute(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });
    if (!workflow) throw new AppError("Workflow not found", 404);
    if (!workflow.isActive)
      throw new AppError("Workflow is not active", 400);

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        status: "RUNNING",
      },
    });

    const steps = workflow.steps as Array<{
      id: string;
      type: string;
      configuration: Record<string, unknown>;
    }>;
    const logs: string[] = [];
    logs.push(
      `[${new Date().toISOString()}] Starting workflow: "${workflow.name}"`,
    );
    logs.push(`[${new Date().toISOString()}] Trigger: ${workflow.triggerType}`);
    logs.push(
      `[${new Date().toISOString()}] Steps to execute: ${steps.length}`,
    );

    let hasError = false;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      logs.push(
        `[${new Date().toISOString()}] Executing step ${i + 1}/${steps.length}: ${step.type}`,
      );
      try {
        logs.push(
          `[${new Date().toISOString()}] Step ${step.id} completed successfully`,
        );
      } catch (err) {
        hasError = true;
        const msg = err instanceof Error ? err.message : String(err);
        logs.push(
          `[${new Date().toISOString()}] Step ${step.id} failed: ${msg}`,
        );
        break;
      }
    }

    const finalStatus = hasError ? "FAILED" : "COMPLETED";
    logs.push(
      `[${new Date().toISOString()}] Workflow execution ${finalStatus.toLowerCase()}`,
    );

    const updated = await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: finalStatus as Parameters<
          typeof prisma.workflowExecution.update
        >[0]["data"]["status"],
        log: logs.join("\n"),
      },
    });

    return updated;
  }

  async getExecutions(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });
    if (!workflow) throw new AppError("Workflow not found", 404);

    return prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}

export default new WorkflowService();
