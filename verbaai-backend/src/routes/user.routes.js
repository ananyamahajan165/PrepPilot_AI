import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { updateProfileValidation } from "../validations/user.validation.js";

import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileValidation),
  updateProfile
);

router.delete(
  "/profile",
  authMiddleware,
  deleteProfile
);

export default router;