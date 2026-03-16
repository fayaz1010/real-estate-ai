// Caching Middleware
import { Request, Response, NextFunction } from "express";

import { config } from "../config/env";

interface CacheEntry {
  body: unknown;
  statusCode: number;
  headers: Record<string, string>;
  expiry: number;
}

const cacheStore = new Map<string, CacheEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore) {
    if (now >= entry.expiry) {
      cacheStore.delete(key);
    }
  }
}, 60000);

export const cache = (ttlOverride?: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!config.cacheEnabled) {
      next();
      return;
    }

    // Only cache GET requests
    if (req.method !== "GET") {
      next();
      return;
    }

    const key = `${req.originalUrl || req.url}`;
    const cached = cacheStore.get(key);

    if (cached && Date.now() < cached.expiry) {
      res.setHeader("X-Cache", "HIT");
      for (const [header, value] of Object.entries(cached.headers)) {
        res.setHeader(header, value);
      }
      res.status(cached.statusCode).json(cached.body);
      return;
    }

    res.setHeader("X-Cache", "MISS");

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      const ttl = ttlOverride ?? config.cacheTtl;
      cacheStore.set(key, {
        body,
        statusCode: res.statusCode,
        headers: { "Content-Type": "application/json" },
        expiry: Date.now() + ttl * 1000,
      });
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of cacheStore.keys()) {
      if (key.includes(pattern)) {
        cacheStore.delete(key);
      }
    }
  } else {
    cacheStore.clear();
  }
};
