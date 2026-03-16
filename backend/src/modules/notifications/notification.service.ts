// Notification Service
import { NotificationType } from "@prisma/client";

import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { sendEmail, wrapEmailTemplate, COLORS, FONTS } from "../../utils/email";

// Email templates (using design system typography and colors)
const EMAIL_TEMPLATES: Record<
  string,
  { subject: string; body: (vars: Record<string, string>) => string }
> = {
  INSPECTION_CONFIRMATION: {
    subject: "Inspection Confirmed – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Confirmed</h2>
      <p>Hi ${vars.userName},</p>
      <p>Your inspection for <strong>${vars.propertyTitle}</strong> has been confirmed.</p>
      <p><strong>Date:</strong> ${vars.date}</p>
      <p><strong>Time:</strong> ${vars.time}</p>
      <p><strong>Type:</strong> ${vars.type}</p>
      ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.secondary};">${vars.meetingLink}</a></p>` : ""}
      <p style="color: ${COLORS.textMuted}; font-size: 13px;">Please arrive on time. If you need to reschedule, please do so at least 24 hours in advance.</p>
    `,
  },
  INSPECTION_REMINDER: {
    subject: "Reminder: Inspection in {{reminderTime}} – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Reminder</h2>
      <p>Hi ${vars.userName},</p>
      <p>This is a reminder that your inspection for <strong>${vars.propertyTitle}</strong> is coming up in <strong>${vars.reminderTime}</strong>.</p>
      <p><strong>Date:</strong> ${vars.date}</p>
      <p><strong>Time:</strong> ${vars.time}</p>
      ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.secondary};">${vars.meetingLink}</a></p>` : ""}
    `,
  },
  INSPECTION_CANCELLATION: {
    subject: "Inspection Cancelled – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Cancelled</h2>
      <p>Hi ${vars.userName},</p>
      <p>The inspection for <strong>${vars.propertyTitle}</strong> scheduled on ${vars.date} at ${vars.time} has been cancelled.</p>
      ${vars.reason ? `<div style="padding: 12px 16px; background-color: #f1f3f4; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; margin: 12px 0;"><p style="margin: 0;"><strong>Reason:</strong> ${vars.reason}</p></div>` : ""}
      <p>You can reschedule a new inspection at any time.</p>
    `,
  },
  INSPECTION_RESCHEDULE: {
    subject: "Inspection Rescheduled – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Rescheduled</h2>
      <p>Hi ${vars.userName},</p>
      <p>Your inspection for <strong>${vars.propertyTitle}</strong> has been rescheduled.</p>
      <p><strong>New Date:</strong> ${vars.newDate}</p>
      <p><strong>New Time:</strong> ${vars.newTime}</p>
    `,
  },
  INSPECTION_CHECK_IN: {
    subject: "Tenant Checked In – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Tenant Checked In</h2>
      <p>Hi ${vars.userName},</p>
      <p><strong>${vars.tenantName}</strong> has checked in for the inspection at <strong>${vars.propertyTitle}</strong>.</p>
      <p><strong>Time:</strong> ${vars.time}</p>
    `,
  },
  INSPECTION_CHECK_OUT: {
    subject: "Inspection Completed – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Completed</h2>
      <p>Hi ${vars.userName},</p>
      <p>The inspection for <strong>${vars.propertyTitle}</strong> has been completed.</p>
      <p><strong>${vars.tenantName}</strong> has checked out.</p>
    `,
  },
  INSPECTION_FOLLOW_UP: {
    subject: "How was your inspection? – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">We'd love your feedback!</h2>
      <p>Hi ${vars.userName},</p>
      <p>Thanks for visiting <strong>${vars.propertyTitle}</strong>. We'd love to hear about your experience.</p>
      <p>If you're interested in applying, you can do so directly from your dashboard.</p>
    `,
  },
  INSPECTION_NO_SHOW: {
    subject: "Missed Inspection – {{propertyTitle}}",
    body: (vars) => `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Missed Inspection</h2>
      <p>Hi ${vars.userName},</p>
      <p>It looks like you missed your inspection for <strong>${vars.propertyTitle}</strong> scheduled on ${vars.date} at ${vars.time}.</p>
      <p>If this was a mistake, please reschedule at your earliest convenience.</p>
    `,
  },
};

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
      await this.sendEmail(params.userId, params.type, params.emailVars).catch(
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

  private async sendEmail(
    userId: string,
    type: NotificationType,
    vars: Record<string, string>,
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true },
    });

    if (!user) return;

    const template = EMAIL_TEMPLATES[type];
    if (!template) return;

    // Replace template vars in subject
    let subject = template.subject;
    for (const [key, value] of Object.entries(vars)) {
      subject = subject.replace(`{{${key}}}`, value);
    }

    const html = template.body({
      ...vars,
      userName: vars.userName || user.firstName,
    });

    // Record email notification
    const emailNotification = await prisma.notification.create({
      data: {
        userId,
        type,
        channel: "EMAIL",
        status: "PENDING",
        title: subject,
        message: subject,
        sentAt: new Date(),
      },
    });

    try {
      await sendEmail({
        to: user.email,
        subject,
        html: wrapEmailTemplate(subject, html),
      });

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

    for (const [key, tmpl] of Object.entries(EMAIL_TEMPLATES)) {
      templates[key] = {
        subject: tmpl.subject,
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
