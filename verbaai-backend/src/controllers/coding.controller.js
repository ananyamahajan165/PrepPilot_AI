import CodingService from "../services/coding.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getQuestions = asyncHandler(async (req, res) => {
  const questions = CodingService.getAllQuestions();

  res.json(
    new ApiResponse(
      200,
      "Coding questions fetched successfully",
      questions
    )
  );
});

export const getQuestion = asyncHandler(async (req, res) => {
  const question = CodingService.getQuestionById(req.params.id);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  res.json(
    new ApiResponse(
      200,
      "Question fetched successfully",
      question
    )
  );
});

export const submitCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const result = CodingService.evaluateSubmission(code);

  res.json(
    new ApiResponse(
      200,
      "Code evaluated successfully",
      result
    )
  );
});