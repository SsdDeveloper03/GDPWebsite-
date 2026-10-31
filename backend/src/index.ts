import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

import session from "express-session";
import { PrismaSessionStore } from "./config/sessionStore.js";
import apiRouter from "./routes/index.js";

const app = express();

// Trust reverse proxy in production (e.g., IIS, Nginx) for secure cookies over HTTPS
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(helmet());
// Request size limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Dynamic CORS allowing configured CLIENT_URL (supports comma-separated list)
const configuredOrigins = env.CLIENT_URL.split(",").map((url) => url.trim()).filter(Boolean);
const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];
const allowedOrigins =
  env.NODE_ENV === "production" ? configuredOrigins : [...configuredOrigins, ...devOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, or same-origin server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
  })
);

// Configure express-session with persistent Microsoft SQL Server store
const sessionStore = new PrismaSessionStore();

app.use(
  session({
    name: "gdp.sid",
    secret: env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Health check endpoint
app.get("/api/health", async (_req, res) => {
  res.json({
    status: "ok",
    service: "Growth Ka Digital Partner API",
    database: "Microsoft SQL Server (GDPWebsiteDB)",
    timestamp: new Date().toISOString(),
  });
});

// Mount Public & Core APIs
app.use("/api", apiRouter);

// Centralized error handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
);

// Start server
async function startServer() {
  try {
    // Attempt database connection on startup
    await connectDatabase().catch((err) => {
      console.warn("⚠️ Database ping warning at startup:", err.message);
      console.warn("ℹ️ Ensure SQL Server service has TCP/IP enabled and is running.");
    });

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 GDP Backend running on http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      sessionStore.close();
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (process.env["NODE_ENV"] !== "test") {
  startServer();
}

export default app;
