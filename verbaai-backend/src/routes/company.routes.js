import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getCompanies,
  getCompany,
} from "../controllers/company.controller.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getCompanies
);

router.get(
  "/:name",
  authMiddleware,
  getCompany
);

export default router;