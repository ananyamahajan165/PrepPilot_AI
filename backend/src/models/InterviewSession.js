const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    grammarScore: { type: Number, min: 0, max: 100, required: true },
    communicationScore: { type: Number, min: 0, max: 100, required: true },
    technicalScore: { type: Number, min: 0, max: 100, required: true },
    confidenceScore: { type: Number, min: 0, max: 100, required: true },
    professionalismScore: { type: Number, min: 0, max: 100, required: true },
    overallScore: { type: Number, min: 0, max: 100, required: true },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

// Every real query against this collection filters by user and sorts by
// createdAt (history, dashboard's recent/timeline aggregations, streak
// calculation) — a compound index serves both at once, rather than using
// a single-field index and sorting in memory. Matches the same pattern
// already used on CommunicationSession and ResumeReport.
interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
