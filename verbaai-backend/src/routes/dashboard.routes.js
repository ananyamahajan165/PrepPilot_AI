import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getDashboard,
  getWeeklyProgress,
  getStatistics,
  getRecentInterviews,
  getTodayChallenge,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/", authMiddleware, getDashboard);
router.get("/weekly-progress", authMiddleware, getWeeklyProgress);
router.get("/statistics", authMiddleware, getStatistics);
router.get("/recent-interviews", authMiddleware, getRecentInterviews);
router.get("/today-challenge", authMiddleware, getTodayChallenge);

export default router;