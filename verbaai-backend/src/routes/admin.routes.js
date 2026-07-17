import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  dashboard,
  users,
  deleteUser,
  interviews,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/dashboard",
  dashboard
);

router.get(
  "/users",
  users
);

router.delete(
  "/users/:id",
  deleteUser
);

router.get(
  "/interviews",
  interviews
);

export default router;