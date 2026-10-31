import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import { recordAuditLog } from "../services/auditService.js";
import { generateCsrfToken } from "../middleware/auth.js";
import type { LoginInput } from "../validators/authValidator.js";

/**
 * Handles administrator login.
 * Validates credentials, regenerates session ID, sets CSRF token, and audits the event.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      // Generic error message prevents account enumeration
      await recordAuditLog({
        action: "ADMIN_LOGIN_FAILED",
        entity: "User",
        details: { email: normalizedEmail, reason: "Account not found" },
        req,
      });

      res.status(401).json({
        success: false,
        error: "Authentication Failed",
        message: "Invalid email or password.",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      await recordAuditLog({
        userId: user.id,
        action: "ADMIN_LOGIN_FAILED",
        entity: "User",
        entityId: user.id,
        details: { email: normalizedEmail, reason: "Invalid password" },
        req,
      });

      res.status(401).json({
        success: false,
        error: "Authentication Failed",
        message: "Invalid email or password.",
      });
      return;
    }

    if (user.status !== "ACTIVE" || user.role !== "ADMIN") {
      await recordAuditLog({
        userId: user.id,
        action: "ADMIN_LOGIN_REJECTED",
        entity: "User",
        entityId: user.id,
        details: { status: user.status, role: user.role },
        req,
      });

      res.status(401).json({
        success: false,
        error: "Authentication Failed",
        message: "Invalid email or password.",
      });
      return;
    }

    // Regenerate session to prevent session fixation attacks
    req.session.regenerate(async (err) => {
      if (err) {
        console.error("Session regeneration failed:", err);
        res.status(500).json({
          success: false,
          error: "Session Error",
          message: "Unable to establish secure session. Please try again.",
        });
        return;
      }

      const csrfToken = generateCsrfToken();
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.csrfToken = csrfToken;

      await recordAuditLog({
        userId: user.id,
        action: "ADMIN_LOGIN",
        entity: "User",
        entityId: user.id,
        details: { role: user.role },
        req,
      });

      res.json({
        success: true,
        message: "Login successful.",
        csrfToken,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          profileImageUrl: user.profileImageUrl,
        },
      });
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      error: "Authentication Error",
      message: "An unexpected error occurred during login. Please try again.",
    });
  }
}

/**
 * Handles administrator logout.
 * Records audit event and destroys server-side session.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const userId = req.session?.userId;

  if (userId) {
    await recordAuditLog({
      userId,
      action: "ADMIN_LOGOUT",
      entity: "User",
      entityId: userId,
      req,
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.clearCookie("gdp.sid");
    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  });
}

/**
 * Retrieves current authenticated user context and active CSRF token.
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  // requireAuth middleware ensures req.user is populated and valid
  const user = req.user!;

  // Ensure CSRF token is initialized for the session
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  res.json({
    success: true,
    csrfToken: req.session.csrfToken,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      profileImageUrl: user.profileImageUrl,
    },
  });
}
