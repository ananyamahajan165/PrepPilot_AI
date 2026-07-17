import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getQuestions,
  getQuestion,
  submitCode,
} from "../controllers/coding.controller.js";

const router = Router();

router.get(
  "/questions",
  authMiddleware,
  getQuestions
);

router.get(
  "/questions/:id",
  authMiddleware,
  getQuestion
);

router.post(
  "/submit",
  authMiddleware,
  submitCode
);

export default router;