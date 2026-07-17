import codingQuestions from "../data/codingQuestions.json" with { type: "json" };

class CodingService {
  getAllQuestions() {
    return codingQuestions;
  }

  getQuestionById(id) {
    return codingQuestions.find(
      (question) => question.id === Number(id)
    );
  }

  evaluateSubmission(code) {
    return {
      status: "Accepted",
      passedTestCases: 10,
      totalTestCases: 10,
      executionTime: "82 ms",
      memory: "42 MB",
      aiFeedback:
        "Good solution. Try improving variable naming and reduce nested loops if possible."
    };
  }
}

export default new CodingService();
