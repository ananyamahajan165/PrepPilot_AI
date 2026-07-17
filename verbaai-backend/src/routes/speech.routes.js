import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import { analyzeSpeech } from "../controllers/speech.controller.js";

const router = Router();

router.post(
  "/analyze",
  authMiddleware,
  analyzeSpeech
);

export default router;