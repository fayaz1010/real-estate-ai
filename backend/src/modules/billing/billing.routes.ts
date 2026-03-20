// Billing Routes - Stripe subscription management
import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth";

import billingController from "./billing.controller";

const router = Router();

const BILLING_ROLES = [
  "LANDLORD",
  "PROPERTY_MANAGER",
  "BUSINESS",
  "ADMIN",
  "SUPER_ADMIN",
];

// All billing routes require authentication + authorized roles
router.post(
  "/create-customer",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.createCustomer,
);

router.post(
  "/create-subscription",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.createSubscription,
);

router.post(
  "/cancel-subscription",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.cancelSubscription,
);

router.get(
  "/invoices",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.getInvoices,
);

export default router;
