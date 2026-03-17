// Workflow Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";

import workflowController from "./workflow.controller";

const router = Router();

router.post("/", authenticate, workflowController.create);
router.get("/", authenticate, workflowController.getAll);
router.get("/:id", authenticate, workflowController.getById);
router.patch("/:id", authenticate, workflowController.update);
router.delete("/:id", authenticate, workflowController.delete);
router.post("/:id/toggle", authenticate, workflowController.toggle);
router.post("/:id/execute", authenticate, workflowController.execute);
router.get("/:id/executions", authenticate, workflowController.getExecutions);

export default router;
