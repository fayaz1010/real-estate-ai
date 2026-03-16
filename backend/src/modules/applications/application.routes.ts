// Application Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation";

import applicationController from "./application.controller";
import {
  createApplicationSchema,
  updateApplicationSchema,
  reviewApplicationSchema,
} from "./application.validation";

const router = Router();

// All routes require authentication
router.post(
  "/",
  authenticate,
  validate(createApplicationSchema),
  applicationController.create,
);
router.get(
  "/my-applications",
  authenticate,
  applicationController.getMyApplications,
);
router.get("/:id", authenticate, applicationController.getById);
router.patch(
  "/:id",
  authenticate,
  validate(updateApplicationSchema),
  applicationController.update,
);
router.post("/:id/submit", authenticate, applicationController.submit);
router.post("/:id/approve", authenticate, applicationController.approve);
router.post(
  "/:id/reject",
  authenticate,
  validate(reviewApplicationSchema),
  applicationController.reject,
);

export default router;
