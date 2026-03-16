// Rate Limiting Middleware
import { Request, Response, NextFunction } from "express";

import { config } from "../config/env";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now >= entry.resetTime) {
      store.delete(key);
    }
  }
}, 60000);

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { windowMs, maxRequests } = config.rateLimit;
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || now >= entry.resetTime) {
    entry = { count: 1, resetTime: now + windowMs };
    store.set(key, entry);
  } else {
    entry.count++;
  }

  res.setHeader("X-RateLimit-Limit", maxRequests);
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, maxRequests - entry.count),
  );
  res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetTime / 1000));

  if (entry.count > maxRequests) {
    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      },
    });
    return;
  }

  next();
};
