class PromptService {
  cleanResponse(response) {
    if (!response) return "";

    return response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  }

  parseJSON(response) {
    try {
      return JSON.parse(
        this.cleanResponse(response)
      );
    } catch (error) {
      return null;
    }
  }
}

export default new PromptService();