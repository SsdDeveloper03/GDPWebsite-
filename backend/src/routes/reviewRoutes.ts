import { Router } from "express";
import { getApprovedReviews } from "../controllers/reviewController.js";
import { publicApiLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// GET /api/reviews - List approved reviews & testimonials
router.get("/", publicApiLimiter, getApprovedReviews);

export default router;
