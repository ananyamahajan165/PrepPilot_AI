import client from "./ai.service.js";

import hrPrompt from "../prompts/hr.prompt.js";
import technicalPrompt from "../prompts/technical.prompt.js";
import feedbackPrompt from "../prompts/feedback.prompt.js";

class InterviewService {
  /**
   * Generate Interview Questions
   */
  async generateQuestions({
    company,
    role,
    difficulty,
    type,
  }) {
    const prompt =
      type === "HR"
        ? hrPrompt(role, company, difficulty)
        : technicalPrompt(
            role,
            company,
            difficulty
          );

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content:
              "You are an AI Interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      });

    return response.choices[0].message.content;
  }

  /**
   * Evaluate Candidate Answer
   */

  async evaluateAnswer(
    question,
    answer
  ) {
    const prompt = feedbackPrompt(
      question,
      answer
    );

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content:
              "You are an expert interviewer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.4,
      });

    return response.choices[0].message.content;
  }
}

export default new InterviewService();