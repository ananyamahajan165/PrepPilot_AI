const express = require("express");
const { body, query, param } = require("express-validator");
const router = express.Router();
const {
  getTopic,
  analyzeSession,
  getHistory,
  getSession,
  deleteSession,
  conversationMessage,
  endConversation,
} = require("../controllers/communicationController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);

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

const historyItemValidators = [
  body("history").optional().isArray({ max: 60 }).withMessage("history must be an array of at most 60 messages"),
  body("history.*.role").optional().isIn(["assistant", "user"]).withMessage("each history item needs a valid role"),
  body("history.*.content").optional().isString().trim().isLength({ max: 2000 }).withMessage("each history item's content is too long"),
];

router.post("/conversation/message", historyItemValidators, validate, conversationMessage);

router.post(
  "/conversation/end",
  [
    ...historyItemValidators,
    body("durationSeconds").optional().isFloat({ min: 0 }).withMessage("durationSeconds must be a non-negative number"),
  ],
  validate,
  endConversation
);

module.exports = router;