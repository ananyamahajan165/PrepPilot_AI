import { Router } from "express";
import multer from "multer";

import { analyzeResume } from "../controllers/resume.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const upload = multer({
  dest: "uploads/",
});

const router = Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

export default router;