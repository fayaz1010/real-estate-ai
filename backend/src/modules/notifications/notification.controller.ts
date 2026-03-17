// Notification Controller
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import notificationService from "./notification.service";
import pushService from "./push.service";

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
  // ─── Push notifications ──────────────────────────────────────────

  subscribePush = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { subscription, userAgent } = req.body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_SUBSCRIPTION", message: "Invalid push subscription object" },
      });
    }

    const result = await pushService.subscribe(userId, subscription, userAgent);
    return successResponse(res, { id: result.id }, "Push subscription saved", 201);
  });

  unsubscribePush = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_ENDPOINT", message: "Endpoint is required" },
      });
    }

    const result = await pushService.unsubscribe(userId, endpoint);
    return successResponse(res, result, "Push subscription removed");
  });

  getVapidPublicKey = asyncHandler(async (_req: Request, res: Response) => {
    const publicKey = pushService.getPublicKey();
    return successResponse(res, { publicKey });
  });

  sendPushNotification = asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_FIELDS", message: "userId, title, and body are required" },
      });
    }

    const result = await pushService.sendToUser(userId, { title, body, data });
    return successResponse(res, result, "Push notification sent");
  });
}

export default new NotificationController();
