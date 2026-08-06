const feedbackPrompt = (
  question,
  answer
) => `
You are an AI Interview Evaluator.

Interview Question:

${question}

Candidate Answer:

${answer}

Evaluate the answer.

Return ONLY JSON.

{
    "score":85,
    "confidence":82,
    "communication":88,
    "technical":84,
    "feedback":"Constructive feedback here."
}
`;

export default feedbackPrompt;