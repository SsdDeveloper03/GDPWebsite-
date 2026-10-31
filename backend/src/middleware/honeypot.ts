import type { Request, Response, NextFunction } from "express";

/**
 * Honeypot middleware to silently trap automated bot submissions.
 * If the hidden honeypot field is populated, the request is absorbed with a fake success
 * response without persisting to the database.
 */
export function checkHoneypot(honeypotField: string = "_hp") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const honeypotVal = req.body?.[honeypotField];
    if (honeypotVal && typeof honeypotVal === "string" && honeypotVal.trim().length > 0) {
      // Bot detected - return plausible success without performing any database write
      res.status(200).json({
        success: true,
        message: "Your submission has been received successfully.",
      });
      return;
    }

    // Clean honeypot field from body before controller gets it
    if (req.body && honeypotField in req.body) {
      delete req.body[honeypotField];
    }

    next();
  };
}
