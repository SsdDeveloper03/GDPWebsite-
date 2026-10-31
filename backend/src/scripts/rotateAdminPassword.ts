import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { recordAuditLog } from "../services/auditService.js";

const rotationSchema = z.object({
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email address"),
  ADMIN_NEW_PASSWORD: z
    .string()
    .min(10, "ADMIN_NEW_PASSWORD must be at least 10 characters long for security"),
});

/**
 * Securely rotates an existing administrator password.
 * Invalidates all active sessions for the user and logs an audit trail.
 */
export async function rotateAdminPassword(): Promise<void> {
  console.log("=================================================");
  console.log("🔑 GDP Administrator Password Rotation Tool");
  console.log("=================================================");

  const emailInput = process.env.ADMIN_EMAIL || process.argv[2];
  const passwordInput = process.env.ADMIN_NEW_PASSWORD || process.argv[3];

  const parseResult = rotationSchema.safeParse({
    ADMIN_EMAIL: emailInput,
    ADMIN_NEW_PASSWORD: passwordInput,
  });

  if (!parseResult.success) {
    console.warn("\n⚠️ Cannot execute password rotation:");
    console.warn("Missing or invalid input parameters:\n");
    for (const issue of parseResult.error.issues) {
      console.warn(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.log("\nUsage Options:");
    console.log("1. Environment variables:");
    console.log("   ADMIN_EMAIL=admin@example.com ADMIN_NEW_PASSWORD=NewStrongPassword123! npm run admin:rotate-password");
    console.log("2. Command line arguments:");
    console.log("   npm run admin:rotate-password -- admin@example.com NewStrongPassword123!\n");
    return;
  }

  const { ADMIN_EMAIL, ADMIN_NEW_PASSWORD } = parseResult.data;
  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      console.error(`❌ User with email '${normalizedEmail}' not found in the database.`);
      return;
    }

    if (existingUser.role !== "ADMIN") {
      console.error(`❌ User '${normalizedEmail}' does not have the ADMIN role.`);
      return;
    }

    console.log(`\n🔒 Hashing new password with bcrypt (salt rounds = 12)...`);
    const passwordHash = await bcrypt.hash(ADMIN_NEW_PASSWORD, 12);

    // Update password hash and ensure account is active
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        status: "ACTIVE",
      },
    });

    // Invalidate all active sessions for this administrator to terminate existing logins
    const terminatedSessions = await prisma.session.deleteMany({
      where: { userId: existingUser.id },
    });

    await recordAuditLog({
      userId: existingUser.id,
      action: "ADMIN_PASSWORD_ROTATED",
      entity: "User",
      entityId: existingUser.id,
      details: {
        email: normalizedEmail,
        terminatedSessionsCount: terminatedSessions.count,
      },
    });

    console.log(`\n✅ Administrator password rotated successfully!`);
    console.log(`   User ID:              ${existingUser.id}`);
    console.log(`   Email:                ${existingUser.email}`);
    console.log(`   Terminated Sessions:  ${terminatedSessions.count}`);
    console.log(`   Audit Log:            Recorded`);
    console.log("\nNew credentials have NOT been printed or logged.");
  } catch (error) {
    console.error("❌ Failed to rotate administrator password:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith("rotateAdminPassword.ts") || process.argv[1]?.endsWith("rotateAdminPassword.js")) {
  rotateAdminPassword()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
