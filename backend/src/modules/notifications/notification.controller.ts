// Notification Controller
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import notificationService from "./notification.service";

export class NotificationController {
  // ─── Inspection notification triggers ─────────────────────────────

  sendInspectionConfirmation = asyncHandler(
    async (req: Request, res: Response) => {
      const notification = await notificationService.sendInspectionConfirmation(
        req.params.id,
      );
      return successResponse(
        res,
        { success: true, notificationId: notification.id },
        "Confirmation sent",
      );
    },
  );

  sendReminder = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.body;
    const notification = await notificationService.sendReminder(
      req.params.id,
      type,
    );
    return successResponse(
      res,
      { success: true, notificationId: notification.id },
      "Reminder sent",
    );
  });

  sendCancellationNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const { reason } = req.body;
      const notification =
        await notificationService.sendCancellationNotification(
          req.params.id,
          reason || "",
        );
      return successResponse(
        res,
        { success: true, notificationId: notification.id },
        "Cancellation notification sent",
      );
    },
  );

  sendRescheduleNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const { newDate, newTime } = req.body;
      const notification = await notificationService.sendRescheduleNotification(
        req.params.id,
        newDate,
        newTime,
      );
      return successResponse(
        res,
        { success: true, notificationId: notification.id },
        "Reschedule notification sent",
      );
    },
  );

  sendCheckInNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const notification = await notificationService.sendCheckInNotification(
        req.params.id,
      );
      return successResponse(
        res,
        { success: true, notificationId: notification.id },
        "Check-in notification sent",
      );
    },
  );

  sendCheckOutNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const notification = await notificationService.sendCheckOutNotification(
        req.params.id,
      );
      return successResponse(
        res,
        { success: true, notificationId: notification.id },
        "Check-out notification sent",
      );
    },
  );

  sendFollowUp = asyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationService.sendFollowUp(req.params.id);
    return successResponse(
      res,
      { success: true, notificationId: notification.id },
      "Follow-up sent",
    );
  });

  sendNoShowNotification = asyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationService.sendNoShowNotification(
      req.params.id,
    );
    return successResponse(
      res,
      { success: true, notificationId: notification.id },
      "No-show notification sent",
    );
  });

  scheduleReminders = asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.scheduleReminders(req.params.id);
    return successResponse(res, result, "Reminders scheduled");
  });

  cancelReminders = asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.cancelReminders(req.params.id);
    return successResponse(res, result, "Reminders cancelled");
  });

  // ─── User notification inbox ──────────────────────────────────────

  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit, unreadOnly } = req.query;
    const result = await notificationService.getUserNotifications(
      userId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20,
      unreadOnly === "true",
    );
    return successResponse(res, result);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const notification = await notificationService.markAsRead(
      req.params.id,
      userId,
    );
    return successResponse(res, notification, "Notification marked as read");
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await notificationService.markAllAsRead(userId);
    return successResponse(res, result, "All notifications marked as read");
  });

  // ─── Preferences ─────────────────────────────────────────────────

  getPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId || req.user!.userId;
    const preferences =
      await notificationService.getOrCreatePreferences(userId);
    return successResponse(res, preferences);
  });

  updatePreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId || req.user!.userId;
    const preferences = await notificationService.updatePreferences(
      userId,
      req.body,
    );
    return successResponse(res, preferences, "Preferences updated");
  });

  // ─── Admin / utility ─────────────────────────────────────────────

  testNotification = asyncHandler(async (req: Request, res: Response) => {
    const { userId, type, template } = req.body;
    const result = await notificationService.testNotification(
      userId,
      type,
      template,
    );
    return successResponse(res, result, "Test notification sent");
  });

  getTemplates = asyncHandler(async (_req: Request, res: Response) => {
    const templates = notificationService.getTemplates();
    return successResponse(res, templates);
  });

  batchSendNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { inspectionIds, type } = req.body;
    const result = await notificationService.batchSendNotifications(
      inspectionIds,
      type,
    );
    return successResponse(res, result, "Batch notifications processed");
  });
}

export default new NotificationController();
