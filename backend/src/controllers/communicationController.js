const CommunicationSession = require("../models/CommunicationSession");
const { askGeminiJSON, AllGeminiKeysExhaustedError } = require("../utils/geminiClient");
const { detectFillerWords } = require("../utils/fillerWordDetector");
const { success, error } = require("../utils/apiResponse");
const { TOPIC_BANK, DIFFICULTIES } = require("../utils/topicBank");
const { buildConversationTurnPrompt, buildConversationAnalysisPrompt } = require("../utils/conversationCoach");

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const MAX_CONVERSATION_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 2000;

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((t) => t && (t.role === "assistant" || t.role === "user") && typeof t.content === "string" && t.content.trim())
    .slice(-MAX_CONVERSATION_MESSAGES)
    .map((t) => ({ role: t.role, content: t.content.trim().slice(0, MAX_MESSAGE_LENGTH) }));
}

const DIFFICULTY_RUBRIC = {
  easy: "Since this is an EASY topic, focus your evaluation mainly on grammar, confidence, and clarity. Be encouraging — this is a warm-up level topic, so don't be overly harsh on depth or structure.",
  medium: "Since this is a MEDIUM topic, evaluate communication, vocabulary, structure, confidence, and professionalism. Expect a more organized, interview-ready answer than an Easy topic.",
  hard: "Since this is a HARD topic, evaluate technical correctness (where applicable), logical thinking, communication, depth of knowledge, vocabulary, confidence, professionalism, and completeness. Hold this answer to a genuinely strict, senior-interview standard — shallow or vague answers should score noticeably lower here than they would on an Easy or Medium topic.",
  "": "No specific topic/difficulty was selected — this is free-form practice, so evaluate general communication, confidence, and professionalism as normal.",
};

function buildCoachPrompt({ transcript, inputMethod, durationSeconds, fillerWordsFound, topic, difficulty, category }) {
  const wordCount = countWords(transcript);
  const context =
    inputMethod === "voice"
      ? `This was SPOKEN by the student (voice input, transcribed by the browser), lasting about ${durationSeconds} seconds.`
      : `This was WRITTEN by the student (text input).`;

  const fillerNote =
    fillerWordsFound.length > 0
      ? `Filler words already detected in the transcript: ${fillerWordsFound.join(", ")}. Reference these specifically in your feedback.`
      : `No obvious filler words were detected.`;

  const topicNote = topic
    ? `The student was answering this specific Speaking Practice topic (category: "${category || "General"}", difficulty: "${difficulty || "unspecified"}"):\n"${topic}"\n\n${DIFFICULTY_RUBRIC[difficulty] || DIFFICULTY_RUBRIC[""]}`
    : `The student was practicing freely without a specific assigned topic.\n\n${DIFFICULTY_RUBRIC[""]}`;

  return `You are an experienced AI Communication & Confidence Coach helping a student prepare for job interviews, presentations, and group discussions. You are NOT a grammar-checking tool — you are a mentor focused on how confident, clear, and professional this person sounds, with grammar as just one of several signals.

${context}
Word count: ${wordCount}.
${fillerNote}

${topicNote}

Student's response:
"""
${transcript}
"""

Evaluate their communication and confidence, then return a JSON object with EXACTLY these fields:
{
  "scores": {
    "confidence": number (0-100, how self-assured and decisive they sound),
    "communication": number (0-100, clarity and structure of what they're saying),
    "professionalism": number (0-100, appropriate tone for an interview/professional setting),
    "grammar": number (0-100, grammatical correctness),
    "vocabulary": number (0-100, richness and precision of word choice),
    "fluency": number (0-100, how smoothly the ideas flow, penalizing excessive filler words or fragmented thoughts)
  },
  "positiveFeedback": ["2-3 specific things they did well"],
  "areasOfImprovement": ["2-4 specific, actionable things to improve"],
  "detailedExplanation": "a short coaching paragraph explaining the scores like a mentor would, not a report",
  "suggestedResponse": "a rewritten, more confident and professional version of what they said, keeping their original meaning and intent — this is the 'better answer'",
  "interviewTips": ["2-3 tips specifically for using this kind of answer in a real interview"],
  "practiceExercise": "one specific exercise they can do right now to improve on their weakest area",
  "dailyChallenge": "a small, concrete communication challenge for today (e.g. a specific way to practice speaking today)",
  "motivationalMessage": "a short, genuine, encouraging message — not generic, reference something specific about their response",
  "vocabularySuggestions": ["2-4 specific words or phrases that would upgrade the vocabulary of this answer, ideally as 'instead of X, try Y'"],
  "grammarCorrections": ["specific grammar mistakes found, quoting the problem phrase and the fix — empty array if there were none"],
  "actionPlan": ["3-4 concrete, ordered next steps this student should take to improve before their next practice session"]
}

If the response is very short (under 15 words), note in areasOfImprovement that elaborating more would help, and factor that into the communication and fluency scores. If confidence seems low based on hedging language ("I think maybe", "I'm not sure but", excessive qualifiers), include specific confidence-building advice in areasOfImprovement or detailedExplanation.`;
}

function getTopic(req, res) {
  const difficulty = String(req.query.difficulty || "").toLowerCase();
  if (!DIFFICULTIES.includes(difficulty)) {
    return error(res, 400, "difficulty must be one of: easy, medium, hard");
  }

  const excludeList = String(req.query.exclude || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const pool = TOPIC_BANK[difficulty];
  let candidates = pool.filter((t) => !excludeList.includes(t.topic));

  if (candidates.length === 0) {
    candidates = pool;
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  return success(res, 200, {
    topic: picked.topic,
    difficulty,
    category: picked.category,
    recommendedMinutes: picked.recommendedMinutes,
    tips: picked.tips,
  });
}

async function analyzeSession(req, res) {
  const { transcript, inputMethod, durationSeconds, topic, difficulty, category, recommendedMinutes } = req.body;

  const wordCount = countWords(transcript);
  const { fillerWordCount, fillerWordsFound } = detectFillerWords(transcript);

  const prompt = buildCoachPrompt({
    transcript,
    inputMethod,
    durationSeconds: durationSeconds || 0,
    fillerWordsFound,
    topic: topic || "",
    difficulty: difficulty || "",
    category: category || "",
  });

  let result;
  try {
    result = await askGeminiJSON(prompt);
  } catch (err) {
    if (err instanceof AllGeminiKeysExhaustedError) {
      return error(res, 503, err.message);
    }
    console.error("Communication Coach: Gemini request failed:", err.message);
    return error(
      res,
      502,
      "Your AI coach couldn't process that response just now. Please try again in a moment."
    );
  }

  const scores = result.scores || {};
  const scoreValues = [
    scores.confidence,
    scores.communication,
    scores.professionalism,
    scores.grammar,
    scores.vocabulary,
    scores.fluency,
  ].map((v) => (typeof v === "number" ? v : 0));
  const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  let session;
  try {
    session = await CommunicationSession.create({
      user: req.user._id,
      inputMethod,
      transcript,
      wordCount,
      durationSeconds: durationSeconds || 0,
      topic: topic || "",
      difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : "",
      category: category || "",
      recommendedMinutes: recommendedMinutes || 0,
      fillerWordCount,
      fillerWordsFound,
      scores: {
        confidence: scores.confidence ?? 0,
        communication: scores.communication ?? 0,
        professionalism: scores.professionalism ?? 0,
        grammar: scores.grammar ?? 0,
        vocabulary: scores.vocabulary ?? 0,
        fluency: scores.fluency ?? 0,
      },
      overallScore,
      positiveFeedback: result.positiveFeedback || [],
      areasOfImprovement: result.areasOfImprovement || [],
      detailedExplanation: result.detailedExplanation || "",
      suggestedResponse: result.suggestedResponse || "",
      interviewTips: result.interviewTips || [],
      practiceExercise: result.practiceExercise || "",
      dailyChallenge: result.dailyChallenge || "",
      motivationalMessage: result.motivationalMessage || "",
      vocabularySuggestions: result.vocabularySuggestions || [],
      grammarCorrections: result.grammarCorrections || [],
      actionPlan: result.actionPlan || [],
    });
  } catch (err) {
    console.error("Communication Coach: failed to save session:", err.message);
    return error(
      res,
      500,
      "Got your feedback but couldn't save this session. Please try again."
    );
  }

  return success(res, 201, { session });
}

async function getHistory(req, res) {
  const { search, type } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const filter = { user: req.user._id };
  if (type) filter.inputMethod = type;
  if (search) filter.transcript = { $regex: search, $options: "i" };

  const [sessions, total] = await Promise.all([
    CommunicationSession.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    CommunicationSession.countDocuments(filter),
  ]);

  return success(res, 200, {
    sessions,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  });
}

async function getSession(req, res) {
  const session = await CommunicationSession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) {
    return error(res, 404, "Session not found");
  }
  return success(res, 200, { session });
}

async function deleteSession(req, res) {
  const session = await CommunicationSession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!session) {
    return error(res, 404, "Session not found");
  }
  return success(res, 200, {}, "Session deleted");
}

async function conversationMessage(req, res) {
  const history = sanitizeHistory(req.body.history);

  const prompt = buildConversationTurnPrompt(history);

  let result;
  try {
    result = await askGeminiJSON(prompt);
  } catch (err) {
    if (err instanceof AllGeminiKeysExhaustedError) {
      return error(res, 503, err.message);
    }
    console.error("Conversation Coach: Gemini request failed:", err.message);
    return error(res, 502, "I couldn't process that response. Please try again.");
  }

  const message =
    typeof result.message === "string" && result.message.trim()
      ? result.message.trim()
      : "Sorry, could you say that again?";
  const correction = typeof result.correction === "string" && result.correction.trim() ? result.correction.trim() : null;

  return success(res, 200, { message, correction });
}

async function endConversation(req, res) {
  const history = sanitizeHistory(req.body.history);
  const durationSeconds = req.body.durationSeconds || 0;

  const userTurns = history.filter((t) => t.role === "user");
  if (userTurns.length === 0) {
    return error(res, 400, "There's no conversation to analyze yet — say something first!");
  }

  const transcript = userTurns.map((t) => t.content).join("\n\n");
  const wordCount = countWords(transcript);
  const { fillerWordCount, fillerWordsFound } = detectFillerWords(transcript);

  const prompt = buildConversationAnalysisPrompt(history);

  let result;
  try {
    result = await askGeminiJSON(prompt);
  } catch (err) {
    if (err instanceof AllGeminiKeysExhaustedError) {
      return error(res, 503, err.message);
    }
    console.error("Conversation Coach: Gemini analysis failed:", err.message);
    return error(res, 502, "Your AI coach couldn't finish the analysis just now. Please try again in a moment.");
  }

  const scores = result.scores || {};
  const scoreValues = [
    scores.confidence,
    scores.communication,
    scores.professionalism,
    scores.grammar,
    scores.vocabulary,
    scores.fluency,
  ].map((v) => (typeof v === "number" ? v : 0));
  const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  let session;
  try {
    session = await CommunicationSession.create({
      user: req.user._id,
      inputMethod: "voice",
      transcript,
      wordCount,
      durationSeconds,
      mode: "conversation",
      conversationHistory: history,
      messageCount: history.length,
      topic: "AI Conversation Practice",
      difficulty: "",
      category: "Conversation",
      recommendedMinutes: 0,
      fillerWordCount,
      fillerWordsFound,
      scores: {
        confidence: scores.confidence ?? 0,
        communication: scores.communication ?? 0,
        professionalism: scores.professionalism ?? 0,
        grammar: scores.grammar ?? 0,
        vocabulary: scores.vocabulary ?? 0,
        fluency: scores.fluency ?? 0,
      },
      overallScore,
      positiveFeedback: result.positiveFeedback || [],
      areasOfImprovement: result.areasOfImprovement || [],
      detailedExplanation: result.detailedExplanation || "",
      suggestedResponse: result.suggestedResponse || "",
      interviewTips: result.interviewTips || [],
      practiceExercise: result.practiceExercise || "",
      dailyChallenge: result.dailyChallenge || "",
      motivationalMessage: result.motivationalMessage || "",
      vocabularySuggestions: result.vocabularySuggestions || [],
      grammarCorrections: result.grammarCorrections || [],
      actionPlan: result.actionPlan || [],
    });
  } catch (err) {
    console.error("Conversation Coach: failed to save session:", err.message);
    return error(res, 500, "Got your feedback but couldn't save this session. Please try again.");
  }

  return success(res, 201, {
    session,
    conversationSummary: result.conversationSummary || null,
  });
}

module.exports = {
  getTopic,
  analyzeSession,
  getHistory,
  getSession,
  deleteSession,
  conversationMessage,
  endConversation,
};