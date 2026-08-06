const mongoose = require("mongoose");

const scoreField = { type: Number, min: 0, max: 100, required: true };

const communicationSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // --- Input ---
    inputMethod: { type: String, enum: ["text", "voice"], required: true },
    transcript: { type: String, required: true },
    wordCount: { type: Number, required: true, default: 0 },
    durationSeconds: { type: Number, default: 0 }, // speaking time; 0 for typed input

    // --- Topic Generator (Speaking Practice) ---
    // All optional: free-form Communication Coach sessions (no topic picked)
    // leave these unset, so this is fully backward-compatible.
    topic: { type: String, default: "" },
    difficulty: { type: String, enum: ["easy", "medium", "hard", ""], default: "" },
    category: { type: String, default: "" },
    recommendedMinutes: { type: Number, default: 0 },

    // --- Filler words (detected deterministically, not left to the LLM) ---
    fillerWordCount: { type: Number, default: 0 },
    fillerWordsFound: [{ type: String }],

    // --- Scores (0-100 each) ---
    scores: {
      confidence: scoreField,
      communication: scoreField,
      professionalism: scoreField,
      grammar: scoreField,
      vocabulary: scoreField,
      fluency: scoreField,
    },
    overallScore: { type: Number, min: 0, max: 100, required: true },

    // --- Coaching feedback ---
    positiveFeedback: [{ type: String }],
    areasOfImprovement: [{ type: String }],
    detailedExplanation: { type: String, default: "" },
    suggestedResponse: { type: String, default: "" },
    interviewTips: [{ type: String }],
    practiceExercise: { type: String, default: "" },
    dailyChallenge: { type: String, default: "" },
    motivationalMessage: { type: String, default: "" },
    vocabularySuggestions: [{ type: String }],
    grammarCorrections: [{ type: String }],
    actionPlan: [{ type: String }],
  },
  { timestamps: true }
);

communicationSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CommunicationSession", communicationSessionSchema);