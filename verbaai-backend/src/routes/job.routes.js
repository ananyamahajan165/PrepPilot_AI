import { Router } from "express";
import multer from "multer";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getJobs,
  matchResume,
} from "../controllers/job.controller.js";

const upload = multer({
  dest: "uploads/",
});

const router = Router();

router.get(
  "/",
  authMiddleware,
  getJobs
);

router.post(
  "/match",
  authMiddleware,
  upload.single("resume"),
  matchResume
);

export default router;