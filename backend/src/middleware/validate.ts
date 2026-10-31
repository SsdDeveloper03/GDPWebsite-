import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = result.error as ZodError;
      const issues = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        error: "Validation Error",
        message: issues[0]?.message || "Invalid input provided.",
        details: issues,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const error = result.error as ZodError;
      const issues = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        error: "Query Validation Error",
        message: issues[0]?.message || "Invalid query parameters.",
        details: issues,
      });
      return;
    }

    (req as any).validatedQuery = result.data;
    next();
  };
}
