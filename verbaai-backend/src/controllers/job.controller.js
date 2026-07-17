import fs from "fs";

import JobService from "../services/job.service.js";

import ApiResponse from "../utils/ApiResponse.js";

import ApiError from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

export const getJobs = asyncHandler(async (req, res) => {
  res.json(
    new ApiResponse(
      200,
      "Jobs fetched successfully",
      JobService.getJobs()
    )
  );
});

export const matchResume = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  const job = JobService.getJob(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const resumeText = fs.readFileSync(
    req.file.path,
    "utf8"
  );

  const result = JobService.calculateMatch(
    job,
    resumeText
  );

  res.json(
    new ApiResponse(
      200,
      "Resume matched successfully",
      result
    )
  );
});