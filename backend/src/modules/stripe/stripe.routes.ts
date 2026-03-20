// Stripe Routes - Consolidated Stripe API endpoints
import express, { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth";

import stripeController from "./stripe.controller";

const router = Router();

const STRIPE_ROLES = [
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
  stripeController.webhook,
);

// Authenticated routes
router.post(
  "/create-payment-intent",
  authenticate,
  authorize(...STRIPE_ROLES),
  stripeController.createPaymentIntent,
);

router.post(
  "/create-subscription",
  authenticate,
  authorize(...STRIPE_ROLES),
  stripeController.createSubscription,
);

router.post(
  "/cancel-subscription",
  authenticate,
  authorize(...STRIPE_ROLES),
  stripeController.cancelSubscription,
);

export default router;
