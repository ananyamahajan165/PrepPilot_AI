import client from "./ai.service.js";

class ResumeService {
  async analyzeResume(text) {
    const prompt = `
Analyze the following resume.

Return JSON.

{
 "strengths":[],
 "weaknesses":[],
 "suggestions":[]
}

Resume:

${text}
`;

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return response.choices[0].message.content;
  }
}

export default new ResumeService();