class ATSService {
  calculateScore(text) {
    let score = 0;

    if (text.length > 500) score += 20;

    if (text.includes("Java")) score += 10;

    if (text.includes("Python")) score += 10;

    if (text.includes("React")) score += 10;

    if (text.includes("Node")) score += 10;

    if (text.includes("MongoDB")) score += 10;

    if (text.includes("Git")) score += 10;

    if (text.includes("SQL")) score += 10;

    if (text.includes("Project")) score += 10;

    return Math.min(score, 100);
  }
}

export default new ATSService();