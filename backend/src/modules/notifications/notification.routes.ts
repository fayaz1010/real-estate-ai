// Notification Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";

import notificationController from "./notification.controller";

const router = Router();

// ─── User notification inbox ────────────────────────────────────────
router.get("/", authenticate, notificationController.getMyNotifications);
router.post("/read-all", authenticate, notificationController.markAllAsRead);
router.patch("/:id/read", authenticate, notificationController.markAsRead);

// ─── Preferences ────────────────────────────────────────────────────
router.get(
  "/preferences/:userId",
  authenticate,
  notificationController.getPreferences,
);
router.patch(
  "/preferences/:userId",
  authenticate,
  notificationController.updatePreferences,
);

// ─── Inspection notification triggers ───────────────────────────────
router.post(
  "/inspection/:id/confirmation",
  authenticate,
  notificationController.sendInspectionConfirmation,
);
router.post(
  "/inspection/:id/reminder",
  authenticate,
  notificationController.sendReminder,
);
router.post(
  "/inspection/:id/cancellation",
  authenticate,
  notificationController.sendCancellationNotification,
);
router.post(
  "/inspection/:id/reschedule",
  authenticate,
  notificationController.sendRescheduleNotification,
);
router.post(
  "/inspection/:id/check-in",
  authenticate,
  notificationController.sendCheckInNotification,
);
router.post(
  "/inspection/:id/check-out",
  authenticate,
  notificationController.sendCheckOutNotification,
);
router.post(
  "/inspection/:id/follow-up",
  authenticate,
  notificationController.sendFollowUp,
);
router.post(
  "/inspection/:id/no-show",
  authenticate,
  notificationController.sendNoShowNotification,
);
router.post(
  "/inspection/:id/schedule-reminders",
  authenticate,
  notificationController.scheduleReminders,
);
router.delete(
  "/inspection/:id/reminders",
  authenticate,
  notificationController.cancelReminders,
);

// ─── Admin / utility ────────────────────────────────────────────────
router.post("/test", authenticate, notificationController.testNotification);
router.get("/templates", authenticate, notificationController.getTemplates);
router.post(
  "/batch",
  authenticate,
  notificationController.batchSendNotifications,
);

export default router;
