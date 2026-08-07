export interface ResumeReport {
  _id: string;
  fileName: string;
  atsScore: number;
  professionalSummary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  grammarIssues: string[];
  formattingSuggestions: string[];
  suggestions: string[];
  createdAt: string;
}
