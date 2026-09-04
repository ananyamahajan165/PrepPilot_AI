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

interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
