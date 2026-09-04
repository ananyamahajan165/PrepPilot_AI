const pdfParse = require("pdf-parse");
const ResumeReport = require("../models/ResumeReport");
const { askGeminiJSON } = require("../utils/geminiClient");
const { success, error } = require("../utils/apiResponse");

function buildAnalysisPrompt(resumeText) {
  return `You are an ATS (Applicant Tracking System) and professional resume expert reviewing a candidate's resume for job/internship placements.

Resume text:
"""
${resumeText.slice(0, 6000)}
"""

Analyze it and return a JSON object with exactly these fields:
{
  "atsScore": number (0-100, how well this resume would pass an automated ATS scan),
  "professionalSummary": "a rewritten 2-3 sentence professional summary for this candidate, ready to paste at the top of their resume",
  "strengths": ["what the resume does well, be specific"],
  "weaknesses": ["what's holding the resume back, be specific"],
  "missingKeywords": ["keywords/skills commonly expected for this candidate's likely field that are missing"],
  "grammarIssues": ["specific grammar, tense, or wording issues found, quoting the problem phrase where possible"],
  "formattingSuggestions": ["specific formatting/layout improvements — spacing, section order, bullet structure, length"],
  "suggestions": ["broader actionable advice beyond grammar/formatting — e.g. quantifying achievements with numbers, tailoring to a target role, adding a missing section, cutting weak content"]
}

Grammar issues, formatting suggestions, and general suggestions are three DIFFERENT categories — don't repeat the same point across them.`;
}

async function analyzeResume(req, res) {
  if (!req.file) {
    return error(res, 400, "A PDF resume file is required");
  }

  const parsed = await pdfParse(req.file.buffer);
  const resumeText = parsed.text.trim();

  if (!resumeText) {
    return error(res, 422, "Could not extract any text from this PDF. Make sure it isn't a scanned image.");
  }

  const result = await askGeminiJSON(buildAnalysisPrompt(resumeText));

  const report = await ResumeReport.create({
    user: req.user._id,
    fileName: req.file.originalname,
    atsScore: result.atsScore ?? 0,
    professionalSummary: result.professionalSummary || "",
    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    missingKeywords: result.missingKeywords || [],
    grammarIssues: result.grammarIssues || [],
    formattingSuggestions: result.formattingSuggestions || [],
    suggestions: result.suggestions || [],
  });

  return success(res, 201, { report });
}

async function getHistory(req, res) {
  const reports = await ResumeReport.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("fileName atsScore createdAt")
    .limit(50);
  return success(res, 200, { reports });
}

async function getReport(req, res) {
  const report = await ResumeReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) {
    return error(res, 404, "Report not found");
  }
  return success(res, 200, { report });
}

module.exports = { analyzeResume, getHistory, getReport };
