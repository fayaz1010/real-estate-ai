// Maintenance Request Routes - CRUD for maintenance requests
import { Router, Request, Response } from "express";

import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse } from "../utils/response";

const router = Router();

// GET /api/maintenance - List maintenance requests
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { status, priority, propertyId } = req.query;

    // Build filter conditions
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (propertyId) where.propertyId = propertyId;

    // Return structured data (stub with realistic shape)
    const requests = [
      {
        id: "maint-001",
        propertyId: "prop-001",
        tenantId: req.user?.id || "tenant-001",
        category: "Plumbing",
        title: "Leaking faucet in kitchen",
        description: "Kitchen sink faucet has been dripping constantly.",
        priority: "MEDIUM",
        status: "OPEN",
        cost: null,
        assignedTo: null,
        images: [],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        property: { title: "42 Elm Street", address: "42 Elm Street, Unit 3A" },
      },
      {
        id: "maint-002",
        propertyId: "prop-002",
        tenantId: req.user?.id || "tenant-002",
        category: "Electrical",
        title: "Broken light switch in bedroom",
        description: "Light switch in master bedroom stopped working.",
        priority: "LOW",
        status: "IN_PROGRESS",
        cost: 150,
        assignedTo: "vendor-001",
        images: [],
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        property: { title: "Harbour View Apartments", address: "15 Marine Parade, Unit 5B" },
      },
      {
        id: "maint-003",
        propertyId: "prop-001",
        tenantId: req.user?.id || "tenant-003",
        category: "HVAC",
        title: "AC not cooling properly",
        description: "Air conditioning unit is running but not producing cold air.",
        priority: "HIGH",
        status: "OPEN",
        cost: null,
        assignedTo: null,
        images: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        property: { title: "42 Elm Street", address: "42 Elm Street, Unit 7C" },
      },
    ];

    // Apply filters
    const filtered = requests.filter((r) => {
      if (status && r.status !== status) return false;
      if (priority && r.priority !== priority) return false;
      if (propertyId && r.propertyId !== propertyId) return false;
      return true;
    });

    return successResponse(res, filtered, "Maintenance requests retrieved");
  }),
);

// GET /api/maintenance/:id - Get single maintenance request
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    return successResponse(
      res,
      {
        id,
        propertyId: "prop-001",
        tenantId: req.user?.id || "tenant-001",
        category: "Plumbing",
        title: "Leaking faucet in kitchen",
        description: "Kitchen sink faucet has been dripping constantly.",
        priority: "MEDIUM",
        status: "OPEN",
        cost: null,
        assignedTo: null,
        images: [],
        notes: [],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        property: { title: "42 Elm Street", address: "42 Elm Street, Unit 3A" },
      },
      "Maintenance request retrieved",
    );
  }),
);

// POST /api/maintenance - Create maintenance request
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId, category, title, description, priority } = req.body;
    const newRequest = {
      id: `maint-${Date.now()}`,
      propertyId: propertyId || "prop-001",
      tenantId: req.user?.id || "tenant-001",
      category: category || "General",
      title: title || "New Request",
      description: description || "",
      priority: priority || "MEDIUM",
      status: "OPEN",
      cost: null,
      assignedTo: null,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return successResponse(res, newRequest, "Maintenance request created", 201);
  }),
);

// PUT /api/maintenance/:id - Update maintenance request
router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body, updatedAt: new Date().toISOString() },
      "Maintenance request updated",
    );
  }),
);

// PUT /api/maintenance/:id/assign - Assign vendor
router.put(
  "/:id/assign",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { vendorId } = req.body;
    return successResponse(
      res,
      { id, assignedTo: vendorId, status: "IN_PROGRESS", updatedAt: new Date().toISOString() },
      "Vendor assigned",
    );
  }),
);

// DELETE /api/maintenance/:id - Delete maintenance request
router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    return successResponse(res, { id: req.params.id }, "Maintenance request deleted");
  }),
);

export default router;
