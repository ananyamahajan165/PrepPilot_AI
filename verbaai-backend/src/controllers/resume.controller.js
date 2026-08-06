import ResumeService from "../services/resume.service.js";
import ATSService from "../services/ats.service.js";
import { extractTextFromPDF } from "../services/pdf.service.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const analyzeResume = asyncHandler(
  async (req, res) => {
    const text = await extractTextFromPDF(
      req.file.path
    );

    const atsScore =
      ATSService.calculateScore(text);

    const analysis =
      await ResumeService.analyzeResume(text);

    res.json(
      new ApiResponse(
        200,
        "Resume analyzed successfully",
        {
          atsScore,
          analysis,
        }
      )
    );
  }
);