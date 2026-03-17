// Admin Routes - User management, settings, and platform administration
import { Router, Request, Response } from "express";

import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { successResponse } from "../utils/response";

const router = Router();

// GET /api/admin/users - List users with filters
router.get(
  "/users",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { search, role, status, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const users = [
      {
        id: "user-001",
        email: "john@example.com",
        firstName: "John",
        lastName: "Smith",
        role: "LANDLORD",
        status: "ACTIVE",
        createdAt: "2025-01-15T10:00:00Z",
        lastLoginAt: "2026-03-17T14:30:00Z",
        properties: 5,
      },
      {
        id: "user-002",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        role: "TENANT",
        status: "ACTIVE",
        createdAt: "2025-03-20T08:00:00Z",
        lastLoginAt: "2026-03-16T09:15:00Z",
        properties: 0,
      },
      {
        id: "user-003",
        email: "admin@realestate-ai.com",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "2024-12-01T00:00:00Z",
        lastLoginAt: "2026-03-18T08:00:00Z",
        properties: 0,
      },
    ];

    // Apply filters
    let filtered = users;
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q),
      );
    }
    if (role) filtered = filtered.filter((u) => u.role === role);
    if (status) filtered = filtered.filter((u) => u.status === status);

    return successResponse(res, {
      users: filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum),
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
    });
  }),
);

// POST /api/admin/users - Create user
router.post(
  "/users",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, firstName, lastName, role } = req.body;
    return successResponse(
      res,
      {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        role: role || "TENANT",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      "User created",
      201,
    );
  }),
);

// PUT /api/admin/users/:id - Update user
router.put(
  "/users/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body, updatedAt: new Date().toISOString() },
      "User updated",
    );
  }),
);

// DELETE /api/admin/users/:id - Delete user
router.delete(
  "/users/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    return successResponse(res, { id: req.params.id }, "User deleted");
  }),
);

// GET /api/admin/settings - Get platform settings
router.get(
  "/settings",
  authenticate,
  asyncHandler(async (_req: Request, res: Response) => {
    return successResponse(res, {
      general: {
        siteName: "RealEstate AI",
        siteUrl: "https://realestate-ai.com",
        supportEmail: "support@realestate-ai.com",
        timezone: "America/Los_Angeles",
        currency: "USD",
      },
      notifications: {
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        maintenanceAlerts: true,
        paymentReminders: true,
        leaseExpiryDays: 30,
      },
      properties: {
        maxPhotos: 20,
        requireApproval: false,
        autoArchiveDays: 90,
      },
      security: {
        mfaEnabled: false,
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
      },
    });
  }),
);

// PUT /api/admin/settings - Update platform settings
router.put(
  "/settings",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    return successResponse(res, req.body, "Settings updated");
  }),
);

export default router;
