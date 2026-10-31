import { z } from "zod";

export const episodeQuerySchema = z.object({
  category: z.string().trim().max(100).optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val ? val === "true" : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0 && val <= 100), {
      message: "Limit must be an integer between 1 and 100",
    }),
});

export const episodeParamSchema = z.object({
  id: z.string().trim().min(1, "Episode identifier is required").max(64),
});
