const express = require("express");
const { body, query, param } = require("express-validator");
const router = express.Router();
const {
  getTopic,
  analyzeSession,
  getHistory,
  getSession,
  deleteSession,
} = require("../controllers/communicationController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);

// GET /api/communication/topic — Speaking Practice topic generator.
// ?difficulty=easy|medium|hard&exclude=Topic%20One,Topic%20Two
router.get(
  "/topic",
  [
    query("difficulty")
      .isIn(["easy", "medium", "hard"])
      .withMessage("difficulty must be 'easy', 'medium', or 'hard'"),
    query("exclude").optional().trim(),
  ],
  validate,
  getTopic
);

router.post(
  "/analyze",
  [
    body("transcript").trim().notEmpty().withMessage("transcript is required"),
    body("inputMethod").isIn(["text", "voice"]).withMessage("inputMethod must be 'text' or 'voice'"),
    body("durationSeconds")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("durationSeconds must be a non-negative number"),
    // Speaking Practice topic metadata — all optional, sent only when the
    // student answered a generated topic rather than practicing free-form.
    body("topic").optional().trim().isLength({ max: 300 }).withMessage("topic is too long"),
    body("difficulty").optional().isIn(["easy", "medium", "hard"]).withMessage("difficulty must be 'easy', 'medium', or 'hard'"),
    body("category").optional().trim().isLength({ max: 100 }).withMessage("category is too long"),
    body("recommendedMinutes").optional().isInt({ min: 0, max: 30 }).withMessage("recommendedMinutes must be a small non-negative integer"),
  ],
  validate,
  analyzeSession
);

router.get(
  "/history",
  [
    query("search").optional().trim(),
    query("type").optional().isIn(["text", "voice"]).withMessage("type must be 'text' or 'voice'"),
    query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50"),
  ],
  validate,
  getHistory
);

router.get("/history/:id", [param("id").isMongoId().withMessage("Invalid session id")], validate, getSession);

router.delete(
  "/history/:id",
  [param("id").isMongoId().withMessage("Invalid session id")],
  validate,
  deleteSession
);

module.exports = router;
