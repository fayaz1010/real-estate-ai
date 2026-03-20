// Main Router - Aggregates all module routes
import { Router } from "express";

import accountingRoutes from "../modules/accounting/accounting.routes";
import aiRoutes from "../modules/ai/ai.routes";
import applicationRoutes from "../modules/applications/application.routes";
import authRoutes from "../modules/auth/auth.routes";
import billingRoutes from "../modules/billing/billing.routes";
import contactRoutes from "../modules/contact/contact.routes";
import inspectionRoutes from "../modules/inspections/inspection.routes";
import leaseRoutes from "../modules/leases/lease.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import propertyRoutes from "../modules/properties/property.routes";
import uploadRoutes from "../modules/properties/upload.routes";
import bookingRoutes from "../modules/scheduling/booking.routes";
import stripeRoutes from "../modules/stripe/stripe.routes";
import trialRoutes from "../modules/trial/trial.routes";
import workflowRoutes from "../modules/workflows/workflow.routes";

import adminRoutes from "./admin.routes";
import maintenanceRoutes from "./maintenance.routes";
import tenantRoutes from "./tenant.routes";

const router = Router();

// Module routes
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/properties", propertyRoutes);
router.use("/properties", uploadRoutes);
router.use("/inspections", inspectionRoutes);
router.use("/applications", applicationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/leases", leaseRoutes);
router.use("/payments", paymentRoutes);
router.use("/billing", billingRoutes);
router.use("/stripe", stripeRoutes);
router.use("/accounting", accountingRoutes);
router.use("/bookings", bookingRoutes);
router.use("/trial", trialRoutes);
router.use("/workflows", workflowRoutes);
router.use("/contact", contactRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/admin", adminRoutes);
router.use("/tenants", tenantRoutes);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    name: "Real Estate Platform API",
    version: "1.0.0",
    status: "active",
    modules: {
      auth: "/api/auth",
      ai: "/api/ai",
      properties: "/api/properties",
      inspections: "/api/inspections",
      applications: "/api/applications",
      notifications: "/api/notifications",
      leases: "/api/leases",
      payments: "/api/payments",
      accounting: "/api/accounting",
      bookings: "/api/bookings",
      trial: "/api/trial",
      workflows: "/api/workflows",
      maintenance: "/api/maintenance",
      admin: "/api/admin",
      tenants: "/api/tenants",
      billing: "/api/billing",
      stripe: "/api/stripe",
    },
  });
});

export default router;
