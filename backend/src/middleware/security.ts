// Security Middleware with Environment Variable Toggles
import crypto from "crypto";

import { Request, Response, NextFunction, Router } from "express";
import helmet from "helmet";

import logger from "../utils/logger";

// Read toggle env vars (default: false)
const isEnabled = (envVar: string): boolean => process.env[envVar] === "true";

// --- CSRF Protection (custom double-submit cookie pattern) ---

const CSRF_COOKIE = "_csrf_token";
const CSRF_HEADER = "x-csrf-token";
const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Set token cookie on every request so clients can read it
  let token = req.cookies?.[CSRF_COOKIE];
  if (!token) {
    token = generateCsrfToken();
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // Client JS needs to read it to send in header
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  // Safe methods don't need validation
  if (CSRF_SAFE_METHODS.has(req.method)) {
    return next();
  }

  // Validate token on state-changing requests (POST, PUT, PATCH, DELETE)
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;
  if (!headerToken || headerToken !== token) {
    res.status(403).json({
      success: false,
      error: { code: "CSRF_VALIDATION_FAILED", message: "Invalid CSRF token" },
    });
    return;
  }

  next();
}

// --- Build security middleware stack ---

export function securityMiddleware(): Router {
  const router = Router();

  const toggles = {
    csp: isEnabled("SECURITY_CSP_ENABLED"),
    hsts: isEnabled("SECURITY_HSTS_ENABLED"),
    xss: isEnabled("SECURITY_XSS_ENABLED"),
    csrf: isEnabled("SECURITY_CSRF_ENABLED"),
  };

  logger.info("Security middleware configuration", { toggles });

  // CSP toggle
  if (toggles.csp) {
    router.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "ws://localhost:*", "wss://*"],
        },
      }),
    );
  }

  // HSTS toggle
  if (toggles.hsts) {
    router.use(
      helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      }),
    );
  }

  // XSS Protection toggle
  if (toggles.xss) {
    router.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });
  }

  // CSRF toggle
  if (toggles.csrf) {
    router.use(csrfProtection);
  }

  // Error handler for security middleware failures
  router.use(
    (err: Error, _req: Request, res: Response, _next: NextFunction) => {
      logger.error("Security middleware error", {
        error: err.message,
        stack: err.stack,
      });
      res.status(500).json({
        success: false,
        error: {
          code: "SECURITY_ERROR",
          message: "A security check could not be completed",
        },
      });
    },
  );

  return router;
}

export default securityMiddleware;
