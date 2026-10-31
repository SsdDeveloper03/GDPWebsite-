import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { recordAuditLog } from "../services/auditService.js";

const credentialsSchema = z.object({
  ADMIN_INITIAL_EMAIL: z.string().email("ADMIN_INITIAL_EMAIL must be a valid email address"),
  ADMIN_INITIAL_PASSWORD: z
    .string()
    .min(6, "ADMIN_INITIAL_PASSWORD must be at least 6 characters long"),
  ADMIN_INITIAL_NAME: z.string().min(2).default("GDP Administrator"),
});

export async function provisionAdmin(): Promise<void> {
  console.log("=================================================");
  console.log("🛡️ GDP Administrator Account Provisioning Tool");
  console.log("=================================================");

  const parseResult = credentialsSchema.safeParse(process.env);

  if (!parseResult.success) {
    console.warn("\n⚠️ Cannot safely provision initial administrator:");
    console.warn("Missing or invalid required environment variables in .env:\n");
    for (const issue of parseResult.error.issues) {
      console.warn(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.log("\nTo provision the initial administrator, add the following to your backend/.env file:");
    console.log("---------------------------------------------------------------------------------");
    console.log("ADMIN_INITIAL_EMAIL=admin@gdppodcast.com");
    console.log("ADMIN_INITIAL_PASSWORD=YourStrongPasswordHere123!");
    console.log("ADMIN_INITIAL_NAME=\"GDP Administrator\" # (Optional)");
    console.log("---------------------------------------------------------------------------------");
    console.log("Then rerun: npm run admin:provision\n");
    return;
  }

  const { ADMIN_INITIAL_EMAIL, ADMIN_INITIAL_PASSWORD, ADMIN_INITIAL_NAME } = parseResult.data;
  const normalizedEmail = ADMIN_INITIAL_EMAIL.trim().toLowerCase();

  try {
    // Check if an admin already exists in the database
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    if (existingAdmin) {
      console.log(`\nℹ️ An active administrator account already exists in the database (User ID: ${existingAdmin.id}).`);
      console.log("For security, existing administrator accounts and passwords will not be overwritten.");
      return;
    }

    // Check if a user with this specific email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      console.log(`\nℹ️ User with email ${normalizedEmail} already exists (Role: ${existingUser.role}).`);
      console.log("Elevating existing user to active ADMIN...");
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "ADMIN",
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      await recordAuditLog({
        userId: updatedUser.id,
        action: "ADMIN_ELEVATED",
        entity: "User",
        entityId: updatedUser.id,
        details: { email: normalizedEmail, role: "ADMIN" },
      });

      console.log(`✅ Successfully elevated user ${normalizedEmail} to active ADMIN.`);
      return;
    }

    // Hash the password with 12 salt rounds
    console.log("\n🔒 Hashing password with bcrypt (salt rounds = 12)...");
    const passwordHash = await bcrypt.hash(ADMIN_INITIAL_PASSWORD, 12);

    // Create the admin user
    const newUser = await prisma.user.create({
      data: {
        displayName: ADMIN_INITIAL_NAME,
        email: normalizedEmail,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    await recordAuditLog({
      userId: newUser.id,
      action: "ADMIN_PROVISIONED",
      entity: "User",
      entityId: newUser.id,
      details: { email: normalizedEmail, role: "ADMIN" },
    });

    console.log(`\n🎉 Successfully provisioned administrator account!`);
    console.log(`   User ID:      ${newUser.id}`);
    console.log(`   Display Name: ${newUser.displayName}`);
    console.log(`   Email:        ${newUser.email}`);
    console.log(`   Role:         ${newUser.role}`);
    console.log(`   Status:       ${newUser.status}`);
    console.log("\nCredentials have NOT been logged or saved anywhere other than the secure database.");
  } catch (error) {
    console.error("❌ Failed to provision administrator account:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly from CLI
if (process.argv[1]?.endsWith("provisionAdmin.ts") || process.argv[1]?.endsWith("provisionAdmin.js")) {
  provisionAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
