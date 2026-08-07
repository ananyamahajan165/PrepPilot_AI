const mongoose = require("mongoose");

const resumeReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    professionalSummary: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    grammarIssues: [{ type: String }],
    formattingSuggestions: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

resumeReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ResumeReport", resumeReportSchema);
