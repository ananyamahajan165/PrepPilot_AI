import Interview from "../models/Interview.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import InterviewService from "../services/interview.service.js";
import PromptService from "../services/prompt.service.js";

/**
 * Start Interview
 */
export const startInterview = asyncHandler(async (req, res) => {
  const { company, role, difficulty, type } = req.body;

  const interview = await Interview.create({
    user: req.user._id,
    company,
    role,
    difficulty,
    type,
    status: "In Progress",
    startedAt: new Date(),
    questions: [],
  });

  res.status(201).json(
    new ApiResponse(
      201,
      "Interview started successfully",
      interview
    )
  );
});

/**
 * Get Interview By ID
 */
export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      "Interview fetched successfully",
      interview
    )
  );
});

/**
 * Interview History
 */
export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      "Interview history fetched",
      interviews
    )
  );
});

/**
 * Delete Interview
 */
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      "Interview deleted successfully"
    )
  );
});

export const generateQuestions = asyncHandler(
  async (req, res) => {
    const {
      company,
      role,
      difficulty,
      type,
    } = req.body;

    const aiResponse =
      await InterviewService.generateQuestions({
        company,
        role,
        difficulty,
        type,
      });

    const questions =
      PromptService.parseJSON(aiResponse);

    res.status(200).json(
      new ApiResponse(
        200,
        "Questions generated successfully",
        questions
      )
    );
  }
);

/**
 * Evaluate Candidate Answer
 */

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  const question =
    interview.questions[questionIndex];

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const aiResponse =
    await InterviewService.evaluateAnswer(
      question.question,
      answer
    );

  const result =
    PromptService.parseJSON(aiResponse);

  question.answer = answer;
  question.feedback = result.feedback;
  question.score = result.score;

  interview.confidenceScore =
    result.confidence;

  interview.communicationScore =
    result.communication;

  interview.technicalScore =
    result.technical;

  await interview.save();

  res.status(200).json(
    new ApiResponse(
      200,
      "Answer evaluated successfully",
      result
    )
  );
});


/**
 * Finish Interview
 */

export const finishInterview =
  asyncHandler(async (req, res) => {
    const interview =
      await Interview.findById(req.params.id);

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    const total =
      interview.questions.reduce(
        (sum, q) => sum + q.score,
        0
      );

    interview.overallScore =
      Math.round(
        total /
          interview.questions.length
      );

    interview.status =
      "Completed";

    interview.completedAt =
      new Date();

    interview.duration =
      Math.round(
        (interview.completedAt -
          interview.startedAt) /
          60000
      );

    await interview.save();

    res.json(
      new ApiResponse(
        200,
        "Interview completed",
        interview
      )
    );
  });