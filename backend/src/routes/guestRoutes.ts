import { Router } from "express";
import { applyAsGuest } from "../controllers/guestController.js";
import { validateBody } from "../middleware/validate.js";
import { checkHoneypot } from "../middleware/honeypot.js";
import { formSubmissionLimiter } from "../middleware/rateLimiter.js";
import { guestApplicationSchema } from "../validators/guestValidator.js";

const router = Router();

// POST /api/guests/apply - Submit guest proposal
router.post(
  "/apply",
  formSubmissionLimiter,
  checkHoneypot("_hp"),
  validateBody(guestApplicationSchema),
  applyAsGuest
);

export default router;
