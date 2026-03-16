// Authentication Middleware
import { Request, Response, NextFunction } from "express";

import prisma from "../config/database";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { errorResponse } from "../utils/response";

// Extend Express Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & { id: string };
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "No token provided", 401, "UNAUTHORIZED");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      return errorResponse(res, "User not found", 404, "USER_NOT_FOUND");
    }

    if (user.status !== "ACTIVE") {
      return errorResponse(
        res,
        "Account is not active",
        403,
        "ACCOUNT_INACTIVE",
      );
    }

    // Attach user to request
    req.user = {
      ...decoded,
      id: user.id,
    };

    next();
  } catch (error: unknown) {
    return errorResponse(
      res,
      (error instanceof Error ? error.message : null) || "Invalid token",
      401,
      "INVALID_TOKEN",
    );
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401, "UNAUTHORIZED");
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Insufficient permissions", 403, "FORBIDDEN");
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, status: true },
      });

      if (user && user.status === "ACTIVE") {
        req.user = { ...decoded, id: user.id };
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
};
