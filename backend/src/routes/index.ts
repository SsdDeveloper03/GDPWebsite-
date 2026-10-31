import { Router } from "express";
import guestRoutes from "./guestRoutes.js";
import contactRoutes from "./contactRoutes.js";
import episodeRoutes from "./episodeRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

const apiRouter = Router();

apiRouter.use("/guests", guestRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/episodes", episodeRoutes);
apiRouter.use("/reviews", reviewRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);

export default apiRouter;
