// Request Validation Middleware
import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

import { errorResponse } from "../utils/response";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const errors = (error as any).errors?.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })) || [{ field: "unknown", message: error.message }];

        errorResponse(
          res,
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          errors,
        );
        return;
      }
      next(error);
    }
  };
};

// Validate body only
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const errors = (error as any).errors?.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })) || [{ field: "unknown", message: error.message }];

        errorResponse(
          res,
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          errors,
        );
        return;
      }
      next(error);
    }
  };
};
