// Standardized API Response Utility
import { Response } from "express";

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | { code: string; message: string; details?: unknown };
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const send = <T>(
  res: Response,
  statusCode: number,
  body: ApiResponseBody<T>,
): Response => {
  return res.status(statusCode).json(body);
};

// 200 OK
export const ok = <T>(res: Response, data: T, message?: string): Response => {
  return send(res, 200, { success: true, data, message });
};

// 201 Created
export const created = <T>(
  res: Response,
  data: T,
  message = "Resource created",
): Response => {
  return send(res, 201, { success: true, data, message });
};

// 400 Bad Request
export const badRequest = (
  res: Response,
  message = "Bad request",
  error?: unknown,
): Response => {
  return send(res, 400, {
    success: false,
    message,
    error:
      typeof error === "string"
        ? error
        : { code: "BAD_REQUEST", message, details: error },
  });
};

// 401 Unauthorized
export const unauthorized = (
  res: Response,
  message = "Unauthorized",
): Response => {
  return send(res, 401, {
    success: false,
    message,
    error: { code: "UNAUTHORIZED", message },
  });
};

// 403 Forbidden
export const forbidden = (res: Response, message = "Forbidden"): Response => {
  return send(res, 403, {
    success: false,
    message,
    error: { code: "FORBIDDEN", message },
  });
};

// 404 Not Found
export const notFound = (
  res: Response,
  message = "Resource not found",
): Response => {
  return send(res, 404, {
    success: false,
    message,
    error: { code: "NOT_FOUND", message },
  });
};

// 500 Internal Server Error
export const serverError = (
  res: Response,
  message = "Internal server error",
  error?: unknown,
): Response => {
  return send(res, 500, {
    success: false,
    message,
    error:
      typeof error === "string"
        ? error
        : { code: "INTERNAL_ERROR", message, details: error },
  });
};

// Generic response helper
export const apiResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  error?: string | object,
): Response => {
  const body: ApiResponseBody<T> = {
    success: statusCode >= 200 && statusCode < 300,
  };
  if (data !== undefined) body.data = data;
  if (message) body.message = message;
  if (error)
    body.error =
      typeof error === "string"
        ? error
        : { code: "ERROR", message: message || "Error", ...error };
  return res.status(statusCode).json(body);
};
