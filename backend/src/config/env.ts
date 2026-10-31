import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z
    .string()
    .default("5000")
    .transform((val) => parseInt(val, 10)),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters long"),
  DATABASE_URL: z.string().refine((url) => url.startsWith("sqlserver://"), {
    message: "DATABASE_URL must start with sqlserver:// protocol",
  }),
  GETGABS_API_URL: z.string().default("https://app.getgabs.com/whatsappbusiness/send-templated-message"),
  GETGABS_API_KEY: z.string().default(""),
  GETGABS_SENDER: z.string().default("918799441838"),
  GETGABS_CAMPAIGN_ID: z.string().default("26103"),
  GETGABS_TEAM_PHONE: z.string().default("919727001838"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables configuration:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = typeof env;
