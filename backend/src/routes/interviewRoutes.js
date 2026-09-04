const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  listCategories,
  getInterviewQuestions,
  submitAnswers,
  getHistory,
} = require("../controllers/interviewController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);

const difficultyRule = body("difficulty")
  .isIn(["Easy", "Medium", "Hard"])
  .withMessage("difficulty must be Easy, Medium, or Hard");

router.get("/categories", listCategories);

router.post(
  "/questions",
  [
    body("category").trim().notEmpty().withMessage("category is required"),
    difficultyRule,
    body("count").optional().isInt({ min: 1, max: 10 }).withMessage("count must be between 1 and 10"),
  ],
  validate,
  getInterviewQuestions
);

router.post(
  "/submit",
  [
    body("category").trim().notEmpty().withMessage("category is required"),
    difficultyRule,
    body("answers").isArray({ min: 1, max: 10 }).withMessage("answers must be an array of 1-10 items"),
    body("answers.*.question").trim().notEmpty().withMessage("each answer needs a question"),
    body("answers.*.answer").trim().notEmpty().withMessage("each answer needs a non-empty response"),
  ],
  validate,
  submitAnswers
);

router.get("/history", getHistory);

module.exports = router;
