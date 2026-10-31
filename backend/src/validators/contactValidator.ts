import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(150, "Name must not exceed 150 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(255, "Email address is too long"),
  phone: z
    .string()
    .trim()
    .max(50, "Phone number must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(250, "Subject must not exceed 250 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(1, "Please enter your message")
    .max(3000, "Message must not exceed 3000 characters"),
  _hp: z.string().optional(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
