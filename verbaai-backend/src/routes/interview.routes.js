import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  startInterview,
  getInterview,
  getInterviewHistory,
  deleteInterview,
  generateQuestions,
  submitAnswer,
  finishInterview,
} from "../controllers/interview.controller.js";

const router = Router();

router.post(
  "/start",
  authMiddleware,
  startInterview
);

router.post(
  "/:id/answer",
  authMiddleware,
  submitAnswer
);

router.post(
  "/:id/finish",
  authMiddleware,
  finishInterview
);

router.get(
  "/history",
  authMiddleware,
  getInterviewHistory
);

router.get(
  "/:id",
  authMiddleware,
  getInterview
);

router.delete(
  "/:id",
  authMiddleware,
  deleteInterview
);

export default router;