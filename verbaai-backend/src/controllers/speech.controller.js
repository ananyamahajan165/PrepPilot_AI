import SpeechService from "../services/speech.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const analyzeSpeech = asyncHandler(
  async (req, res) => {
    const { transcript } = req.body;

    const analysis =
      SpeechService.analyzeSpeech(transcript);

    res.json(
      new ApiResponse(
        200,
        "Speech analyzed successfully",
        analysis
      )
    );
  }
);