export interface Interview {
  _id: string;
  company: string;
  role: string;
  difficulty: string;
  type: string;
  status: string;
  score?: number;
  feedback?: string;
  createdAt: string;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface InterviewResult {
  score: number;
  confidence: number;
  communication: number;
  technical: number;
  feedback: string;
}