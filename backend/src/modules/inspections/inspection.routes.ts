// Inspection Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation";

import inspectionController from "./inspection.controller";
import {
  createInspectionSchema,
  updateInspectionSchema,
} from "./inspection.validation";

const router = Router();

// All routes require authentication
router.post(
  "/",
  authenticate,
  validate(createInspectionSchema),
  inspectionController.create,
);
router.get("/", authenticate, inspectionController.getAll);
router.get(
  "/my-inspections",
  authenticate,
  inspectionController.getMyInspections,
);
router.get("/:id", authenticate, inspectionController.getById);
router.patch(
  "/:id",
  authenticate,
  validate(updateInspectionSchema),
  inspectionController.update,
);
router.post("/:id/cancel", authenticate, inspectionController.cancel);

export default router;
