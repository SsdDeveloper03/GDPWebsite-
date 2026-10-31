import { Router } from "express";
import { submitContact } from "../controllers/contactController.js";
import { validateBody } from "../middleware/validate.js";
import { checkHoneypot } from "../middleware/honeypot.js";
import { formSubmissionLimiter } from "../middleware/rateLimiter.js";
import { contactInquirySchema } from "../validators/contactValidator.js";

const router = Router();

// POST /api/contact - Submit contact inquiry
router.post(
  "/",
  formSubmissionLimiter,
  checkHoneypot("_hp"),
  validateBody(contactInquirySchema),
  submitContact
);

export default router;
