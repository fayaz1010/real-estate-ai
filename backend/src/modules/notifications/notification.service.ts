// Notification Service
import { NotificationType } from "@prisma/client";

import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import {
  sendEmail,
  wrapEmailTemplate,
  COLORS,
  FONTS,
  INSPECTION_EMAIL_SENDERS,
} from "../../utils/emailService";
import type { InspectionEmailVars } from "../../utils/emailService";

export class NotificationService {
  // ─── Core: create + deliver ───────────────────────────────────────

  private async createAndDeliver(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    inspectionId?: string;
    propertyId?: string;
    emailVars?: Record<string, string>;
  }) {
    // Check user preferences
    const preferences = await this.getOrCreatePreferences(params.userId);

    // Always create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: "IN_APP",
        status: "DELIVERED",
        title: params.title,
        message: params.message,
        data: params.data || {},
        inspectionId: params.inspectionId,
        propertyId: params.propertyId,
        sentAt: new Date(),
      },
    });

    // Send email if enabled
    if (preferences.email && params.emailVars) {
      await this.sendInspectionEmail(params.userId, params.type, params.emailVars).catch(
        (err) => {
          console.error(
            `Email delivery failed for notification ${notification.id}:`,
            err.message,
          );
        },
      );
    }

    return notification;
  }

  private async sendInspectionEmail(
    userId: string,
    type: NotificationType,
    vars: Record<string, string>,
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true },
    });

    if (!user) return;

    const sender = INSPECTION_EMAIL_SENDERS[type];
    if (!sender) return;

    const emailVars: InspectionEmailVars = {
      userName: vars.userName || user.firstName,
      propertyTitle: vars.propertyTitle || "",
      ...vars,
    };

    // Record email notification
    const emailNotification = await prisma.notification.create({
      data: {
        userId,
        type,
        channel: "EMAIL",
        status: "PENDING",
        title: `${type} – ${vars.propertyTitle || ""}`,
        message: `${type} – ${vars.propertyTitle || ""}`,
        sentAt: new Date(),
      },
    });

    try {
      await sender(user.email, emailVars);

      await prisma.notification.update({
        where: { id: emailNotification.id },
        data: { status: "DELIVERED" },
      });
    } catch (error: unknown) {
      await prisma.notification.update({
        where: { id: emailNotification.id },
        data: { status: "FAILED", failReason: error instanceof Error ? error.message : String(error) },
      });
      throw error;
    }
  }

  // ─── Inspection notifications ─────────────────────────────────────

  async sendInspectionConfirmation(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_CONFIRMATION",
      title: "Inspection Confirmed",
      message: `Your inspection for "${inspection.property.title}" on ${this.formatDate(inspection.scheduledDate)} at ${inspection.scheduledTime} has been confirmed.`,
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
        date: this.formatDate(inspection.scheduledDate),
        time: inspection.scheduledTime,
        type: inspection.type,
        meetingLink: inspection.meetingLink || "",
      },
    });
  }

  async sendReminder(inspectionId: string, reminderType: "24h" | "2h" | "30m") {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    const reminderLabels: Record<string, string> = {
      "24h": "24 hours",
      "2h": "2 hours",
      "30m": "30 minutes",
    };

    const notification = await this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_REMINDER",
      title: `Inspection in ${reminderLabels[reminderType]}`,
      message: `Reminder: Your inspection for "${inspection.property.title}" is in ${reminderLabels[reminderType]}.`,
      data: { reminderType },
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
        reminderTime: reminderLabels[reminderType],
        date: this.formatDate(inspection.scheduledDate),
        time: inspection.scheduledTime,
        meetingLink: inspection.meetingLink || "",
      },
    });

    // Mark reminder as sent on inspection
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: { reminderSent: true, reminderSentAt: new Date() },
    });

    return notification;
  }

  async sendCancellationNotification(inspectionId: string, reason: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_CANCELLATION",
      title: "Inspection Cancelled",
      message: `Your inspection for "${inspection.property.title}" has been cancelled.${reason ? ` Reason: ${reason}` : ""}`,
      data: { reason },
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
        date: this.formatDate(inspection.scheduledDate),
        time: inspection.scheduledTime,
        reason,
      },
    });
  }

  async sendRescheduleNotification(
    inspectionId: string,
    newDate: string,
    newTime: string,
  ) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_RESCHEDULE",
      title: "Inspection Rescheduled",
      message: `Your inspection for "${inspection.property.title}" has been rescheduled to ${newDate} at ${newTime}.`,
      data: { newDate, newTime },
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
        newDate,
        newTime,
      },
    });
  }

  async sendCheckInNotification(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    // Notify the property owner that tenant has checked in
    return this.createAndDeliver({
      userId: inspection.property.ownerId,
      type: "INSPECTION_CHECK_IN",
      title: "Tenant Checked In",
      message: `${inspection.user.firstName} ${inspection.user.lastName} has checked in for the inspection at "${inspection.property.title}".`,
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: "", // Will be filled by sendEmail
        tenantName: `${inspection.user.firstName} ${inspection.user.lastName}`,
        propertyTitle: inspection.property.title,
        time: new Date().toLocaleTimeString(),
      },
    });
  }

  async sendCheckOutNotification(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.property.ownerId,
      type: "INSPECTION_CHECK_OUT",
      title: "Inspection Completed",
      message: `${inspection.user.firstName} ${inspection.user.lastName} has completed the inspection at "${inspection.property.title}".`,
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: "",
        tenantName: `${inspection.user.firstName} ${inspection.user.lastName}`,
        propertyTitle: inspection.property.title,
      },
    });
  }

  async sendFollowUp(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_FOLLOW_UP",
      title: "How was your inspection?",
      message: `Thanks for visiting "${inspection.property.title}". We'd love to hear your feedback!`,
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
      },
    });
  }

  async sendNoShowNotification(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    return this.createAndDeliver({
      userId: inspection.userId,
      type: "INSPECTION_NO_SHOW",
      title: "Missed Inspection",
      message: `It looks like you missed your inspection for "${inspection.property.title}". Please reschedule at your convenience.`,
      inspectionId,
      propertyId: inspection.propertyId,
      emailVars: {
        userName: inspection.user.firstName,
        propertyTitle: inspection.property.title,
        date: this.formatDate(inspection.scheduledDate),
        time: inspection.scheduledTime,
      },
    });
  }

  // ─── User notifications (list, read, preferences) ────────────────

  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false,
  ) {
    const where: Record<string, unknown> = { userId, channel: "IN_APP" };
    if (unreadOnly) {
      where.readAt = null;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, channel: "IN_APP", readAt: null },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404,
        "NOTIFICATION_NOT_FOUND",
      );
    }

    if (notification.userId !== userId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date(), status: "READ" },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, channel: "IN_APP", readAt: null },
      data: { readAt: new Date(), status: "READ" },
    });

    return { updated: result.count };
  }

  // ─── Preferences ──────────────────────────────────────────────────

  async getOrCreatePreferences(userId: string) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  async updatePreferences(
    userId: string,
    data: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      inspectionReminders?: boolean;
      inspectionUpdates?: boolean;
      applicationUpdates?: boolean;
      marketingEmails?: boolean;
    },
  ) {
    // Ensure the preference row exists
    await this.getOrCreatePreferences(userId);

    return prisma.notificationPreference.update({
      where: { userId },
      data,
    });
  }

  // ─── Batch operations ─────────────────────────────────────────────

  async batchSendNotifications(
    inspectionIds: string[],
    type: "confirmation" | "reminder" | "cancellation",
  ) {
    const failed: string[] = [];

    for (const id of inspectionIds) {
      try {
        switch (type) {
          case "confirmation":
            await this.sendInspectionConfirmation(id);
            break;
          case "reminder":
            await this.sendReminder(id, "24h");
            break;
          case "cancellation":
            await this.sendCancellationNotification(id, "Batch cancellation");
            break;
        }
      } catch {
        failed.push(id);
      }
    }

    return { success: failed.length === 0, failed };
  }

  // ─── Schedule reminders ───────────────────────────────────────────

  async scheduleReminders(inspectionId: string) {
    const inspection = await this.getInspectionWithDetails(inspectionId);

    // For now, send a 24h reminder immediately if within 24 hours
    // In production, this would use a job queue (Bull, Agenda, etc.)
    const scheduledDate = new Date(inspection.scheduledDate);
    const now = new Date();
    const hoursUntil =
      (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntil <= 24 && hoursUntil > 2) {
      await this.sendReminder(inspectionId, "24h");
    } else if (hoursUntil <= 2 && hoursUntil > 0.5) {
      await this.sendReminder(inspectionId, "2h");
    } else if (hoursUntil <= 0.5 && hoursUntil > 0) {
      await this.sendReminder(inspectionId, "30m");
    }

    return { success: true };
  }

  async cancelReminders(inspectionId: string) {
    // Mark reminders as cancelled (in a production system, would cancel queued jobs)
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: { reminderSent: false, reminderSentAt: null },
    });

    return { success: true };
  }

  // ─── Test notification ────────────────────────────────────────────

  async testNotification(
    userId: string,
    type: "email" | "sms" | "push",
    template: string,
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (type === "email") {
      const bodyHtml = `
        <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Test Notification</h2>
        <p>Hi ${user.firstName}, this is a test ${type} notification using template: <strong>${template}</strong>.</p>
      `;
      await sendEmail({
        to: user.email,
        subject: "Test Notification – RealEstateAI",
        html: wrapEmailTemplate("Test Notification", bodyHtml),
      });
    }

    // Record a test in-app notification regardless of channel
    await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        channel: "IN_APP",
        status: "DELIVERED",
        title: "Test Notification",
        message: `Test ${type} notification (template: ${template})`,
        sentAt: new Date(),
      },
    });

    return { success: true };
  }

  // ─── Templates ────────────────────────────────────────────────────

  getTemplates() {
    const templates: Record<
      string,
      { subject: string; body: string; variables: Record<string, string> }
    > = {};

    const templateTypes = [
      "INSPECTION_CONFIRMATION",
      "INSPECTION_REMINDER",
      "INSPECTION_CANCELLATION",
      "INSPECTION_RESCHEDULE",
      "INSPECTION_CHECK_IN",
      "INSPECTION_CHECK_OUT",
      "INSPECTION_FOLLOW_UP",
      "INSPECTION_NO_SHOW",
    ];

    for (const key of templateTypes) {
      templates[key] = {
        subject: `${key.replace(/_/g, " ")} – {{propertyTitle}}`,
        body: "(HTML template)",
        variables: this.getTemplateVariables(key),
      };
    }

    return templates;
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private async getInspectionWithDetails(inspectionId: string) {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      include: {
        property: {
          select: { id: true, title: true, address: true, ownerId: true },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!inspection) {
      throw new AppError("Inspection not found", 404, "INSPECTION_NOT_FOUND");
    }

    return inspection;
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  private getTemplateVariables(type: string): Record<string, string> {
    const common = { userName: "string", propertyTitle: "string" };
    const vars: Record<string, Record<string, string>> = {
      INSPECTION_CONFIRMATION: {
        ...common,
        date: "string",
        time: "string",
        type: "string",
        meetingLink: "string",
      },
      INSPECTION_REMINDER: {
        ...common,
        reminderTime: "string",
        date: "string",
        time: "string",
        meetingLink: "string",
      },
      INSPECTION_CANCELLATION: {
        ...common,
        date: "string",
        time: "string",
        reason: "string",
      },
      INSPECTION_RESCHEDULE: {
        ...common,
        newDate: "string",
        newTime: "string",
      },
      INSPECTION_CHECK_IN: { ...common, tenantName: "string", time: "string" },
      INSPECTION_CHECK_OUT: { ...common, tenantName: "string" },
      INSPECTION_FOLLOW_UP: common,
      INSPECTION_NO_SHOW: { ...common, date: "string", time: "string" },
    };
    return vars[type] || common;
  }
}

export default new NotificationService();
