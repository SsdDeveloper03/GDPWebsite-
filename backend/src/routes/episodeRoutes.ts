import { Router } from "express";
import { getEpisodes, getEpisodeById } from "../controllers/episodeController.js";
import { validateQuery } from "../middleware/validate.js";
import { publicApiLimiter } from "../middleware/rateLimiter.js";
import { episodeQuerySchema } from "../validators/episodeValidator.js";

const router = Router();

// GET /api/episodes - List published episodes
router.get("/", publicApiLimiter, validateQuery(episodeQuerySchema), getEpisodes);

// GET /api/episodes/:id - Get single published episode
router.get("/:id", publicApiLimiter, getEpisodeById);

export default router;
