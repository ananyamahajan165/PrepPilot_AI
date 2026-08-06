import { Router } from "express";

import {
  register,
  login,
  logout,
  refresh,
  currentUser,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerValidation),
  register
);

router.post(
  "/login",
  validate(loginValidation),
  login
);

router.post(
  "/logout",
  logout
);

router.post(
  "/refresh",
  refresh
);

router.get(
  "/me",
  authMiddleware,
  currentUser
);

export default router;