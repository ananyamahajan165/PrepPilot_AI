import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import interviewRoutes from "./interview.routes.js";
import resumeRoutes from "./resume.routes.js";
import speechRoutes from "./speech.routes.js";
import companyRoutes from "./company.routes.js";
import codingRoutes from "./coding.routes.js";
import jobRoutes from "./job.routes.js";
import notificationRoutes from "./notification.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/interviews", interviewRoutes);

router.use("/resume", resumeRoutes);    

router.use("/speech", speechRoutes);

router.use("/companies", companyRoutes);    

router.use("/coding", codingRoutes);

router.use("/jobs", jobRoutes);

router.use("/notifications", notificationRoutes);

router.use("/admin", adminRoutes);

export default router;