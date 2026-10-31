import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Global singleton pattern to prevent multiple connections in dev hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prismaClient ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? [
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : [{ emit: "stdout", level: "error" }],
  });

if (env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma;
}

/**
 * Verifies active database connection with a lightweight ping query.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    // Test connection with a lightweight SQL query
    await prisma.$queryRaw`SELECT 1 AS connected`;
    console.log("✅ Microsoft SQL Server connected successfully to GDPWebsiteDB.");
  } catch (error) {
    console.error("❌ Failed to connect to SQL Server database.");
    throw sanitizeDatabaseError(error);
  }
}

/**
 * Closes the Prisma Client connection gracefully.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("🔒 Microsoft SQL Server connection closed gracefully.");
  } catch (error) {
    console.error("⚠️ Error while disconnecting from SQL Server:", error);
  }
}

/**
 * Sanitizes errors to ensure sensitive database credentials, connection strings,
 * or raw internal database details are never exposed to clients or public logs.
 */
export function sanitizeDatabaseError(err: unknown): Error {
  if (err instanceof Error) {
    // Scrub potential connection string secrets or passwords
    const sanitizedMsg = err.message
      .replace(/password=[^;]+/gi, "password=***")
      .replace(/user=[^;]+/gi, "user=***")
      .replace(/sqlserver:\/\/[^@]+@/gi, "sqlserver://***:***@");

    const safeError = new Error(sanitizedMsg);
    safeError.name = err.name;
    return safeError;
  }
  return new Error("An unexpected database error occurred.");
}

// Graceful shutdown listeners
process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDatabase();
  process.exit(0);
});
