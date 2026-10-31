import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import { recordAuditLog } from "../services/auditService.js";
async function upsertAdminUser(): Promise<void> {
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase();
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD?.trim();
  const displayName = process.env.ADMIN_INITIAL_NAME?.trim() || "GDP Administrator";

  if (!email || !rawPassword) {
    console.error("❌ ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD must be configured in environment variables.");
    process.exit(1);
  }

  console.log(`[Admin Upsert] Target admin email: ${email}`);
  console.log("[Admin Upsert] Hashing password with bcrypt (12 rounds)...");
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`[Admin Upsert] Updating existing user (ID: ${existingUser.id})...`);
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
        displayName,
      },
    });

    // Invalidate stale sessions for security
    await prisma.session.deleteMany({
      where: { userId: existingUser.id },
    });

    await recordAuditLog({
      userId: updated.id,
      action: "ADMIN_PASSWORD_ROTATED",
      entity: "User",
      entityId: updated.id,
      details: { email, role: "ADMIN", note: "Admin credentials updated via upsert script" },
    });

    console.log(`✅ [Admin Upsert] Successfully updated admin account for ${email} (ID: ${updated.id})`);
  } else {
    console.log(`[Admin Upsert] Creating new administrator account for ${email}...`);
    const created = await prisma.user.create({
      data: {
        email,
        displayName,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    await recordAuditLog({
      userId: created.id,
      action: "ADMIN_PROVISIONED",
      entity: "User",
      entityId: created.id,
      details: { email, role: "ADMIN", note: "Admin account provisioned via upsert script" },
    });

    console.log(`✅ [Admin Upsert] Successfully created administrator account for ${email} (ID: ${created.id})`);
  }
}

upsertAdminUser()
  .catch((err) => {
    console.error("❌ [Admin Upsert Error]:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
