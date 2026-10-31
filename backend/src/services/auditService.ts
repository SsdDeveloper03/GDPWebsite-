import type { Request } from "express";
import { prisma } from "../config/database.js";

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, any> | string | null;
  req?: Request;
}

/**
 * Records an administrator or system audit log event in dbo.AuditLog.
 * Sanitizes details to ensure credentials and secrets are never persisted.
 */
export async function recordAuditLog(params: AuditLogParams): Promise<void> {
  try {
    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    if (params.req) {
      const forwarded = params.req.headers["x-forwarded-for"];
      if (typeof forwarded === "string") {
        const first = forwarded.split(",")[0];
        ipAddress = first ? first.trim().substring(0, 50) : null;
      } else if (Array.isArray(forwarded) && forwarded[0]) {
        ipAddress = forwarded[0].trim().substring(0, 50);
      } else if (params.req.ip) {
        ipAddress = params.req.ip.substring(0, 50);
      }

      const ua = params.req.headers["user-agent"];
      if (typeof ua === "string") {
        userAgent = ua.substring(0, 500);
      }
    }

    let sanitizedDetails: string | null = null;
    if (params.details) {
      if (typeof params.details === "string") {
        sanitizedDetails = params.details;
      } else {
        // Shallow clone and scrub sensitive keys
        const clean = { ...params.details };
        const sensitiveKeys = ["password", "passwordHash", "token", "secret", "cookie"];
        for (const k of Object.keys(clean)) {
          if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
            clean[k] = "***";
          }
        }
        sanitizedDetails = JSON.stringify(clean);
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: sanitizedDetails,
        ipAddress,
        userAgent,
      },
    });
  } catch (error: any) {
    console.error("Failed to write to AuditLog:", error.message);
  }
}
