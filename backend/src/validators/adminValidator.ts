import { z } from "zod";

export const episodeStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const guestStatusEnum = z.enum(["NEW", "CONTACTED", "APPROVED", "REJECTED"]);
export const contactStatusEnum = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export const createEpisodeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(300, "Title must not exceed 300 characters"),
  description: z.string().trim().optional().or(z.literal("")),
  youtubeVideoId: z
    .string()
    .trim()
    .min(5, "Valid YouTube Video ID is required")
    .max(50, "YouTube Video ID too long"),
  thumbnailUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  guestName: z.string().trim().max(150).optional().or(z.literal("")),
  guestRole: z.string().trim().max(150).optional().or(z.literal("")),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  spotifyUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  applePodcastsUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  isFeatured: z.boolean().optional().default(false),
  status: episodeStatusEnum.default("DRAFT"),
  displayOrder: z.number().int().optional().default(0),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateEpisodeSchema = createEpisodeSchema.partial();

export const updateGuestStatusSchema = z.object({
  status: guestStatusEnum,
});

export const updateGuestNotesSchema = z.object({
  adminNotes: z.string().trim().max(5000, "Notes must not exceed 5000 characters"),
});

export const updateContactStatusSchema = z.object({
  status: contactStatusEnum,
});

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val > 0 && val <= 100, { message: "Limit must be between 1 and 100" }),
  status: z.string().trim().optional(),
  search: z.string().trim().optional(),
});
