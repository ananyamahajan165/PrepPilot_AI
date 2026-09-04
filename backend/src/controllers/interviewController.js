const InterviewSession = require("../models/InterviewSession");
const { askGeminiJSON } = require("../utils/geminiClient");
const { CATEGORIES } = require("../utils/interviewCategories");
const { success, error } = require("../utils/apiResponse");

async function listCategories(req, res) {
  return success(res, 200, { categories: CATEGORIES });
}

function buildQuestionPrompt(category, difficulty, count) {
  return `You are an expert technical/HR interviewer generating fresh practice questions for a student preparing for placements.

Generate exactly ${count} interview questions for the category "${category}" at "${difficulty}" difficulty.

Rules:
- Every question must be unique — no repeats or close paraphrases of each other.
- Questions should be realistic, the kind an actual interviewer would ask.
- Match the difficulty level precisely: Easy = foundational/definitional, Medium = applied/comparative, Hard = design/trade-off/scenario-based.
- Do not number the questions or add any extra text.

Return a JSON object with exactly this field:
{
  "questions": ["question 1", "question 2", ...]
}`;
}

async function getInterviewQuestions(req, res) {
  const { category, difficulty } = req.body;
  const count = Math.min(Math.max(parseInt(req.body.count, 10) || 5, 1), 10);

  const result = await askGeminiJSON(buildQuestionPrompt(category, difficulty, count));
  let questions = Array.isArray(result.questions) ? result.questions.filter((q) => typeof q === "string" && q.trim()) : [];

  if (questions.length === 0) {
    return error(res, 502, "Couldn't generate questions right now. Please try again.");
  }

  questions = questions.slice(0, count);

  return success(res, 200, { category, difficulty, questions });
}

function buildEvaluationPrompt(category, difficulty, question, answer) {
  return `You are an interview coach scoring a candidate's answer to a practice interview question.

Category: ${category} (${difficulty} difficulty)
Question: "${question}"
Candidate's answer: "${answer}"

Score the answer and return a JSON object with exactly these fields:
{
  "grammarScore": number (0-100),
  "communicationScore": number (0-100, clarity and structure),
  "technicalScore": number (0-100, correctness/depth of the actual content — for HR/Behavioral categories, score how well-reasoned and relevant the answer is),
  "confidenceScore": number (0-100, how assertive and decisive the answer sounds),
  "professionalismScore": number (0-100, appropriate tone and framing for a real interview),
  "overallScore": number (0-100, weighted overall quality),
  "suggestions": ["2-4 specific, actionable suggestions to improve this answer"]
}`;
}

async function evaluateOne({ userId, category, difficulty, question, answer }) {
  const result = await askGeminiJSON(buildEvaluationPrompt(category, difficulty, question, answer));

  return InterviewSession.create({
    user: userId,
    category,
    difficulty,
    question,
    answer,
    grammarScore: result.grammarScore ?? 0,
    communicationScore: result.communicationScore ?? 0,
    technicalScore: result.technicalScore ?? 0,
    confidenceScore: result.confidenceScore ?? 0,
    professionalismScore: result.professionalismScore ?? 0,
    overallScore: result.overallScore ?? 0,
    suggestions: result.suggestions || [],
  });
}

async function submitAnswers(req, res) {
  const { category, difficulty, answers } = req.body;

  const sessions = await Promise.all(
    answers.map((a) =>
      evaluateOne({ userId: req.user._id, category, difficulty, question: a.question, answer: a.answer })
    )
  );

  const avg = (key) => Math.round(sessions.reduce((sum, s) => sum + s[key], 0) / sessions.length);
  const summary = {
    questionCount: sessions.length,
    averageOverallScore: avg("overallScore"),
    averageGrammarScore: avg("grammarScore"),
    averageCommunicationScore: avg("communicationScore"),
    averageTechnicalScore: avg("technicalScore"),
    averageConfidenceScore: avg("confidenceScore"),
    averageProfessionalismScore: avg("professionalismScore"),
  };

  return success(res, 201, { sessions, summary });
}

async function getHistory(req, res) {
  const sessions = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  return success(res, 200, { sessions });
}

module.exports = { listCategories, getInterviewQuestions, submitAnswers, getHistory };
