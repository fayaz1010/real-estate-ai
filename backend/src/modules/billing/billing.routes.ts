// Billing Routes - Stripe subscription management
import express, { Router } from "express";

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

// Stripe webhook — no auth, verified by Stripe signature.
// Must use express.raw() so the body is a Buffer for signature verification.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  billingController.stripeWebhook,
);

// All billing routes below require authentication + authorized roles
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

router.post(
  "/create-checkout-session",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.createCheckoutSession,
);

router.get(
  "/subscription-status/:subscriptionId",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.getSubscriptionStatus,
);

router.get(
  "/upcoming-invoice/:subscriptionId",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.getUpcomingInvoice,
);

router.post(
  "/create-payment-intent",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.createPaymentIntent,
);

router.get(
  "/payment-intent/:paymentIntentId",
  authenticate,
  authorize(...BILLING_ROLES),
  billingController.getPaymentIntent,
);

export default router;
