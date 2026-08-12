const mongoose = require("mongoose");

const scoreField = { type: Number, min: 0, max: 100, required: true };

const communicationSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    inputMethod: { type: String, enum: ["text", "voice"], required: true },
    transcript: { type: String, required: true },
    wordCount: { type: Number, required: true, default: 0 },
    durationSeconds: { type: Number, default: 0 },

    // "single" = the existing one-shot text/voice practice flow.
    // "conversation" = the new AI conversational coach flow. Optional/defaulted
    // so every existing session and every existing query keeps working as-is.
    mode: { type: String, enum: ["single", "conversation"], default: "single" },
    conversationHistory: [
      {
        role: { type: String, enum: ["assistant", "user"], required: true },
        content: { type: String, required: true },
        at: { type: Date, default: Date.now },
      },
    ],
    messageCount: { type: Number, default: 0 },

    topic: { type: String, default: "" },
    difficulty: { type: String, enum: ["easy", "medium", "hard", ""], default: "" },
    category: { type: String, default: "" },
    recommendedMinutes: { type: Number, default: 0 },

    fillerWordCount: { type: Number, default: 0 },
    fillerWordsFound: [{ type: String }],

    scores: {
      confidence: scoreField,
      communication: scoreField,
      professionalism: scoreField,
      grammar: scoreField,
      vocabulary: scoreField,
      fluency: scoreField,
    },
    overallScore: { type: Number, min: 0, max: 100, required: true },

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