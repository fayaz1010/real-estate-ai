// Main Router - Aggregates all module routes
import { Router } from "express";

import applicationRoutes from "../modules/applications/application.routes";
import authRoutes from "../modules/auth/auth.routes";
import inspectionRoutes from "../modules/inspections/inspection.routes";
import leaseRoutes from "../modules/leases/lease.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import propertyRoutes from "../modules/properties/property.routes";
import uploadRoutes from "../modules/properties/upload.routes";

const router = Router();

// Module routes
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/properties", uploadRoutes);
router.use("/inspections", inspectionRoutes);
router.use("/applications", applicationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/leases", leaseRoutes);
router.use("/payments", paymentRoutes);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    name: "Real Estate Platform API",
    version: "1.0.0",
    status: "active",
    modules: {
      auth: "/api/auth",
      properties: "/api/properties",
      inspections: "/api/inspections",
      applications: "/api/applications",
      notifications: "/api/notifications",
      leases: "/api/leases",
      payments: "/api/payments",
    },
  });
});

export default router;
