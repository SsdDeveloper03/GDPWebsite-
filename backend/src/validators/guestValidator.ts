import { z } from "zod";

export const guestApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name")
    .max(150, "Full name must not exceed 150 characters"),
  companyRole: z
    .string()
    .trim()
    .min(1, "Please enter your company & role")
    .max(150, "Company & role must not exceed 150 characters"),
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
  expertiseArea: z
    .string()
    .trim()
    .min(1, "Please enter your expertise area")
    .max(200, "Expertise area must not exceed 200 characters"),
  topicSummary: z
    .string()
    .trim()
    .min(1, "Please enter your proposed topic summary")
    .max(3000, "Topic summary must not exceed 3000 characters"),
  linkedinOrWebsite: z
    .string()
    .trim()
    .max(1000, "URL must not exceed 1000 characters")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          // Allow URLs with or without http(s)
          const urlToTest = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
          new URL(urlToTest);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please provide a valid LinkedIn or website URL" }
    ),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must consent to be contacted regarding your application",
    })
    .optional()
    .default(true),
  _hp: z.string().optional(),
});

export type GuestApplicationInput = z.infer<typeof guestApplicationSchema>;
