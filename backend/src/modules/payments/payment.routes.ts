// Payment Routes
import express, { Router } from "express";

import { authenticate } from "../../middleware/auth";

import paymentController from "./payment.controller";

const router = Router();

// Stripe webhook — no auth, verified by Stripe signature.
// Must use express.raw() so the body is a Buffer for signature verification.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook,
);

// Protected routes
router.post("/", authenticate, paymentController.create);
router.post(
  "/create-payment-intent",
  authenticate,
  paymentController.createDirectPaymentIntent,
);
router.get("/my-payments", authenticate, paymentController.getMyPayments);
router.get("/lease/:leaseId", authenticate, paymentController.getLeasePayments);
router.post("/:id/pay", authenticate, paymentController.createPaymentIntent);
router.post(
  "/lease/:leaseId/generate-rent",
  authenticate,
  paymentController.generateRentPayments,
);

export default router;
