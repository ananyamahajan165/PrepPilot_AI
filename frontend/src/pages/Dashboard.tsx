import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardSkeleton from "../components/dashboard/Skeleton";
import EmptyStateBanner from "../components/dashboard/EmptyStateBanner";
import HeroSection from "../components/dashboard/HeroSection";
import TodaysAiInsight from "../components/dashboard/TodayAiInsight";
import ScoreOverviewGrid from "../components/dashboard/ScoreOverviewGrid";
import GoalNextAction from "../components/dashboard/GoalNextAction";
import LearningCalendar from "../components/dashboard/LearningCalendar";
import QuickActionTiles from "../components/dashboard/QuickActionTiles";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

interface DashboardData {
  hasActivity: boolean;
  totalInterviews: number;
  totalCommunicationSessions: number;
  totalResumeReports: number;
  averageScore: number;
  averageAtsScore: number;
  averageTechnicalScore: number;
  totalWordsSpoken: number;
  weeklyImprovement: number;
  interviewWeeklyImprovement: number;
  atsWeeklyImprovement: number;
  streak: { current: number; longest: number };
  dailyGoal: { target: number; completed: number };
  weeklyGoal: { target: number; completed: number };
  recommendedPractice: { module: string; title: string; reason: string; ctaPath: string };
  learningStage: { index: number; label: string; stages: string[] };
  timeline: { date: string; avgScore: number | null; activityCount: number }[];
  recentActivity: {
    id: string;
    type: "interview" | "communication" | "resume";
    title: string;
    subtitle: string;
    score: number | null;
    createdAt: string;
  }[];
  aiInsights: string[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    progress: number;
  }[];
  categoryPerformance: { category: string; avgScore: number; count: number }[];
  communicationStats: {
    grammarImprovement: number;
    vocabularyGrowth: number;
    confidenceTrend: number;
    speakingTimeSeconds: number;
    averageScores: {
      confidence: number;
      communication: number;
      professionalism: number;
      grammar: number;
      vocabulary: number;
      fluency: number;
      overall: number;
    };
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout wide>
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout wide>
        <p className="text-fg-secondary">Couldn't load your dashboard right now. Try refreshing.</p>
      </Layout>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";
  const { communicationStats: comm } = data;
  const communicationScore = comm.averageScores.overall;
  const interviewScore = data.averageScore;
  const overallReadiness = Math.round((communicationScore + interviewScore + data.averageAtsScore) / 3);

  return (
    <Layout wide>
      <div className="max-w-4xl mx-auto space-y-14">
        <HeroSection
          firstName={firstName}
          avatarUrl={user?.avatarUrl || ""}
          levelLabel={data.learningStage.label}
          hasActivity={data.hasActivity}
        />

        {!data.hasActivity && <EmptyStateBanner name={firstName} />}

        <ScoreOverviewGrid
          communicationScore={communicationScore}
          interviewScore={interviewScore}
          atsScore={data.averageAtsScore}
          overallReadiness={overallReadiness}
          communicationTrend={data.weeklyImprovement}
          interviewTrend={data.interviewWeeklyImprovement}
          atsTrend={data.atsWeeklyImprovement}
        />

        <TodaysAiInsight aiInsights={data.aiInsights} ctaPath={data.recommendedPractice.ctaPath} />

        <GoalNextAction
          dailyGoal={data.dailyGoal}
          streak={data.streak}
          recommendedTitle={data.recommendedPractice.title}
          ctaPath={data.recommendedPractice.ctaPath}
        />

        <LearningCalendar timeline={data.timeline} />

        <QuickActionTiles />

        <DashboardFooter />
      </div>
    </Layout>
  );
}
