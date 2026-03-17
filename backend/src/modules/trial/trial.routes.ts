// Trial Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";

import trialController from "./trial.controller";

const router = Router();

// Public - start a free trial (creates account + trial subscription)
router.post("/start", trialController.startTrial);

// Protected - get current trial status
router.get("/status", authenticate, trialController.getTrialStatus);

export default router;
