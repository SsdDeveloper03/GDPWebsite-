import session from "express-session";
import type { SessionData } from "express-session";
import { prisma } from "./database.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
    csrfToken?: string;
  }
}

/**
 * Custom session store backed by Microsoft SQL Server via Prisma.
 * Compatible with express-session and the dbo.Session model.
 */
export class PrismaSessionStore extends session.Store {
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    // Periodically prune expired sessions from SQL Server (every 1 hour)
    this.cleanupInterval = setInterval(() => {
      this.pruneExpiredSessions().catch((err) => {
        console.error("Failed to prune expired sessions:", err.message);
      });
    }, 60 * 60 * 1000);

    // Prevent interval from hanging node processes during shutdown or tests
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Retrieves a session by sid.
   */
  get(sid: string, callback: (err?: any, session?: SessionData | null) => void): void {
    prisma.session
      .findUnique({
        where: { sid },
      })
      .then((record) => {
        if (!record) {
          return callback(null, null);
        }

        // Check if expired
        if (record.expiresAt < new Date()) {
          // Delete expired session asynchronously
          this.destroy(sid, () => {});
          return callback(null, null);
        }

        try {
          const sessionData = JSON.parse(record.data) as SessionData;
          return callback(null, sessionData);
        } catch (parseErr) {
          console.error("Error parsing session data for sid:", sid, parseErr);
          return callback(null, null);
        }
      })
      .catch((err) => {
        callback(err);
      });
  }

  /**
   * Saves or updates a session.
   */
  set(sid: string, sessionData: SessionData, callback?: (err?: any) => void): void {
    const expiresAt = sessionData.cookie?.expires
      ? new Date(sessionData.cookie.expires)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days fallback

    const userId = sessionData.userId || null;
    const dataString = JSON.stringify(sessionData);

    prisma.session
      .upsert({
        where: { sid },
        create: {
          sid,
          userId,
          data: dataString,
          expiresAt,
        },
        update: {
          userId,
          data: dataString,
          expiresAt,
        },
      })
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  }

  /**
   * Destroys a session.
   */
  destroy(sid: string, callback?: (err?: any) => void): void {
    prisma.session
      .deleteMany({
        where: { sid },
      })
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  }

  /**
   * Touches a session to update its expiration.
   */
  touch(sid: string, sessionData: SessionData, callback?: () => void): void {
    const expiresAt = sessionData.cookie?.expires
      ? new Date(sessionData.cookie.expires)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    prisma.session
      .updateMany({
        where: { sid },
        data: { expiresAt },
      })
      .then(() => {
        if (callback) callback();
      })
      .catch(() => {
        if (callback) callback();
      });
  }

  /**
   * Deletes all expired sessions from the database.
   */
  async pruneExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }

  /**
   * Cleans up intervals on server shutdown.
   */
  close(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
