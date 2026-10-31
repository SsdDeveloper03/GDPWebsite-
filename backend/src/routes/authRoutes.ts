import { Router } from "express";
import { login, logout, getCurrentUser } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../validators/authValidator.js";

const router = Router();

// POST /api/auth/login - Admin login with rate limiting & body validation
router.post("/login", authLimiter, validateBody(loginSchema), login);

// POST /api/auth/logout - Terminate session & clear cookies
router.post("/logout", logout);

// GET /api/auth/me - Retrieve authenticated session details & CSRF token
router.get("/me", requireAuth, getCurrentUser);

export default router;
