import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../config/database.js";

// Extend Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        displayName: string;
        role: string;
        status: string;
        profileImageUrl?: string | null;
      };
    }
  }
}

/**
 * Middleware requiring a valid authenticated session.
 * Re-validates account status from database to ensure suspended/deleted accounts are rejected immediately.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Authentication required to access this resource.",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        profileImageUrl: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      // Destroy stale session
      req.session.destroy(() => {});
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Your session has expired or your account is no longer active.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying authenticated user:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred while authenticating your request.",
    });
  }
}

/**
 * Middleware requiring the ADMIN role.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, () => {
    if (!req.user || req.user.role !== "ADMIN") {
      res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Administrator permissions required.",
      });
      return;
    }
    next();
  });
}

/**
 * Generates a cryptographically secure CSRF token.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * CSRF protection middleware for state-mutating requests (POST, PUT, PATCH, DELETE).
 * Verifies the X-CSRF-Token request header against req.session.csrfToken.
 */
export function verifyCsrf(req: Request, res: Response, next: NextFunction): void {
  // Safe methods do not require CSRF token
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const sessionToken = req.session?.csrfToken;
  const requestToken = req.headers["x-csrf-token"] as string | undefined;

  if (!sessionToken || !requestToken || sessionToken !== requestToken) {
    res.status(403).json({
      success: false,
      error: "CSRF Validation Failed",
      message: "Invalid or missing CSRF token. Please refresh your session and try again.",
    });
    return;
  }

  next();
}
