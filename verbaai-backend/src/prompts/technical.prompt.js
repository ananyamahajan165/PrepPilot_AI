const technicalPrompt = (
  role,
  company,
  difficulty
) => `
You are a Senior Technical Interviewer.

Generate 10 technical interview questions.

Company: ${company}

Role: ${role}

Difficulty: ${difficulty}

Rules:

- Ask coding-related questions.
- Include DSA, OOP, DBMS, OS and CN when relevant.
- Return only JSON.

Example:

[
 {
   "id":1,
   "question":"Explain the difference between TCP and UDP."
 }
]
`;

export default technicalPrompt;