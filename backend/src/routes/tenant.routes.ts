// Tenant Routes - List and manage tenants
import { Router, Request, Response } from "express";

import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse } from "../utils/response";

const router = Router();

// GET /api/tenants - List tenants for the current landlord
router.get(
  "/",
  authenticate,
  asyncHandler(async (_req: Request, res: Response) => {
    const tenants = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "555-0101",
        property: "42 Elm Street, Unit 3A",
        leaseEnd: "2026-08-31",
        status: "active",
        paymentStatus: "paid",
        moveInDate: "2025-09-01",
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@example.com",
        phone: "555-0102",
        property: "Harbour View Apartments, Unit 5B",
        leaseEnd: "2026-04-15",
        status: "expiring",
        paymentStatus: "paid",
        moveInDate: "2025-04-15",
      },
      {
        id: 3,
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "555-0103",
        property: "15 Parkside Terrace",
        leaseEnd: "2026-02-28",
        status: "expired",
        paymentStatus: "late",
        moveInDate: "2025-03-01",
      },
      {
        id: 4,
        name: "James Wilson",
        email: "j.wilson@example.com",
        phone: "555-0104",
        property: "120 Collins St, Unit 2D",
        leaseEnd: "2026-12-31",
        status: "active",
        paymentStatus: "pending",
        moveInDate: "2026-01-01",
      },
      {
        id: 5,
        name: "Lisa Park",
        email: "lisa.p@example.com",
        phone: "555-0105",
        property: "88 Queen Street, Unit 4E",
        leaseEnd: "2026-10-31",
        status: "active",
        paymentStatus: "paid",
        moveInDate: "2025-11-01",
      },
    ];

    return successResponse(res, tenants, "Tenants retrieved");
  }),
);

// GET /api/tenants/:id - Get single tenant
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    return successResponse(
      res,
      {
        id: parseInt(id, 10),
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "555-0101",
        property: "42 Elm Street, Unit 3A",
        leaseEnd: "2026-08-31",
        status: "active",
        paymentStatus: "paid",
        moveInDate: "2025-09-01",
      },
      "Tenant retrieved",
    );
  }),
);

export default router;
