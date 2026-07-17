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
          interviews.reduce(
            (sum, interview) => sum + interview.overallScore,
            0
          ) / totalInterviews
        )
      : 0;

  const confidence =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (sum, interview) =>
              sum + interview.confidenceScore,
            0
          ) / totalInterviews
        )
      : 0;

  const recentInterviews = interviews
    .sort(
      (a, b) => b.createdAt - a.createdAt
    )
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