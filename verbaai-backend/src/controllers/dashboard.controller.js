import Interview from "../models/Interview.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
  });

  const totalInterviews = interviews.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce((sum, interview) => sum + (interview.overallScore || 0), 0) / totalInterviews
        )
      : 0;

  const confidence =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce((sum, interview) => sum + (interview.confidenceScore || 0), 0) / totalInterviews
        )
      : 0;

  const recentInterviews = interviews
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched", {
      totalInterviews,
      averageScore,
      confidence,
      recentInterviews,
    })
  );
});

export const getWeeklyProgress = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id });

  const now = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return {
      date: d.toISOString().slice(0, 10),
      count: 0,
    };
  });

  interviews.forEach((iv) => {
    const date = new Date(iv.createdAt).toISOString().slice(0, 10);
    const day = days.find((d) => d.date === date);
    if (day) day.count += 1;
  });

  res.status(200).json(new ApiResponse(200, "Weekly progress fetched", { weekly: days }));
});

export const getStatistics = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id });

  const total = interviews.length;
  const completed = interviews.filter((i) => i.status === "Completed").length;
  const avgScore =
    total > 0
      ? Math.round(interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / total)
      : 0;

  res.status(200).json(new ApiResponse(200, "Statistics fetched", { total, completed, avgScore }));
});

export const getRecentInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json(new ApiResponse(200, "Recent interviews fetched", { recent: interviews }));
});

export const getTodayChallenge = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Today challenge fetched", { challenge: null }));
});