// Lease Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";

import leaseController from "./lease.controller";

const router = Router();

router.post("/", authenticate, leaseController.create);
router.get("/my-leases", authenticate, leaseController.getMyLeases);
router.get("/:id", authenticate, leaseController.getById);
router.patch("/:id/status", authenticate, leaseController.updateStatus);
router.post("/:id/sign", authenticate, leaseController.sign);
router.post("/:id/terminate", authenticate, leaseController.terminate);

export default router;
