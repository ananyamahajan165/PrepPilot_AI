export interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  confidence: number;
  completedChallenges: number;
}

export interface WeeklyProgress {
  day: string;
  score: number;
}

export interface RecentInterview {
  id: string;
  company: string;
  role: string;
  score: number;
  date: string;
  status: string;
}

export interface Challenge {
  title: string;
  description: string;
  reward: string;
}