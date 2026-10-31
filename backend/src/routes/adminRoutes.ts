import { Router } from "express";
import {
  getAdminEpisodes,
  createAdminEpisode,
  getAdminEpisodeById,
  updateAdminEpisode,
  deleteOrArchiveAdminEpisode,
  getAdminGuests,
  getAdminGuestById,
  updateAdminGuestStatus,
  updateAdminGuestNotes,
  getAdminMessages,
  getAdminMessageById,
  updateAdminMessageStatus,
  getAdminDashboardStats,
} from "../controllers/adminController.js";
import { requireAdmin, verifyCsrf } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  createEpisodeSchema,
  updateEpisodeSchema,
  updateGuestStatusSchema,
  updateGuestNotesSchema,
  updateContactStatusSchema,
  paginationQuerySchema,
} from "../validators/adminValidator.js";

const router = Router();

// Protect ALL admin routes with requireAdmin middleware
router.use(requireAdmin);

// ============================================================================
// DASHBOARD STATS
// ============================================================================
router.get("/dashboard/stats", getAdminDashboardStats);

// ============================================================================
// EPISODES
// ============================================================================
router.get("/episodes", validateQuery(paginationQuerySchema), getAdminEpisodes);
router.post("/episodes", verifyCsrf, validateBody(createEpisodeSchema), createAdminEpisode);
router.get("/episodes/:id", getAdminEpisodeById);
router.put("/episodes/:id", verifyCsrf, validateBody(updateEpisodeSchema), updateAdminEpisode);
router.delete("/episodes/:id", verifyCsrf, deleteOrArchiveAdminEpisode);

// ============================================================================
// GUEST APPLICATIONS
// ============================================================================
router.get("/guests", validateQuery(paginationQuerySchema), getAdminGuests);
router.get("/guests/:id", getAdminGuestById);
router.patch("/guests/:id/status", verifyCsrf, validateBody(updateGuestStatusSchema), updateAdminGuestStatus);
router.patch("/guests/:id/notes", verifyCsrf, validateBody(updateGuestNotesSchema), updateAdminGuestNotes);

// ============================================================================
// CONTACT INQUIRIES
// ============================================================================
router.get("/messages", validateQuery(paginationQuerySchema), getAdminMessages);
router.get("/messages/:id", getAdminMessageById);
router.patch("/messages/:id/status", verifyCsrf, validateBody(updateContactStatusSchema), updateAdminMessageStatus);

export default router;
