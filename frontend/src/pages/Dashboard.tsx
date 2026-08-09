import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardSkeleton from "../components/dashboard/Skeleton";
import EmptyStateBanner from "../components/dashboard/EmptyStateBanner";
import HeroSection from "../components/dashboard/HeroSection";
import TodaysAiInsight from "../components/dashboard/TodayAiInsight";
import DailyMission from "../components/dashboard/DailyMission";
import LearningJourney from "../components/dashboard/LearningJourney";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";
import QuickActionTiles from "../components/dashboard/QuickActionTiles";
import AchievementsGrid from "../components/dashboard/AchievementsGrid";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import ScoreOverviewGrid from "../components/dashboard/ScoreOverviewGrid";
import SkillRadarChart from "../components/dashboard/SkillRadarChart";
import LearningCalendar from "../components/dashboard/LearningCalendar";
import MotivationalQuote from "../components/dashboard/MotivationalQuote";
import AiRecommendationsList from "../components/dashboard/AiRecommendationsList";
import AiCoachWidget from "../components/dashboard/AiCoachWidget";
import FooterStats from "../components/dashboard/FooterStats";
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
  const nextMilestone =
    data.learningStage.stages[data.learningStage.index + 1] || "You've reached the top — Placement Ready!";
  const todaysSuggestion = data.aiInsights[0] || data.recommendedPractice.title;

  return (
    <Layout wide>
      <div className="space-y-16">
        {/* Section 1 — Welcome Hero (standalone) */}
        <HeroSection
          firstName={firstName}
          avatarUrl={user?.avatarUrl || ""}
          levelLabel={data.learningStage.label}
          hasActivity={data.hasActivity}
        />

        {/* Section 2 — Today's AI Insight (deliberately its own section, not
            sharing a row with the Hero — see both components' comments) */}
        <TodaysAiInsight aiInsights={data.aiInsights} />

        {!data.hasActivity && <EmptyStateBanner name={firstName} />}

        {/* Section 3 — AI Overview */}
        <ScoreOverviewGrid
          communicationScore={communicationScore}
          interviewScore={interviewScore}
          atsScore={data.averageAtsScore}
          overallReadiness={overallReadiness}
          communicationTrend={data.weeklyImprovement}
          interviewTrend={data.interviewWeeklyImprovement}
          atsTrend={data.atsWeeklyImprovement}
          timeline={data.timeline}
        />

        {/* Section 3 — Performance Overview (full width) */}
        <PerformanceOverview
          timeline={data.timeline}
          confidenceTrend={comm.confidenceTrend}
          vocabularyGrowth={comm.vocabularyGrowth}
          grammarImprovement={comm.grammarImprovement}
          speakingTimeSeconds={comm.speakingTimeSeconds}
        />

        {/* Section 3b — Learning Calendar, also full width: a full year
            (53 weeks) genuinely needs the horizontal room — squeezing it
            into a ~30% side column made the cells illegibly tiny. */}
        <LearningCalendar timeline={data.timeline} />

        {/* Section 4 — Today's Goal / Weekly Goal / Learning Streak */}
        <DailyMission dailyGoal={data.dailyGoal} weeklyGoal={data.weeklyGoal} streak={data.streak} />

        <LearningJourney stages={data.learningStage.stages} currentIndex={data.learningStage.index} />

        {/* Section 5 — Skill Radar (left) + AI Recommendations (right) */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div>
            <SkillRadarChart scores={comm.averageScores} technicalScore={data.averageTechnicalScore} />
          </div>
          <div>
            <AiRecommendationsList
              recommendation={data.recommendedPractice}
              totalResumeReports={data.totalResumeReports}
              categoryPerformance={data.categoryPerformance}
            />
          </div>
        </div>

        {/* Section 6 — Recent Activity */}
        <ActivityTimeline items={data.recentActivity} />

        {/* Section 7 — Achievements */}
        <AchievementsGrid achievements={data.achievements} />

        {/* Section 8 — Quick Actions */}
        <QuickActionTiles />

        {/* Section 9 — Persistent AI Coach widget */}
        <AiCoachWidget
          todaysSuggestion={todaysSuggestion}
          categoryPerformance={data.categoryPerformance}
          nextMilestone={nextMilestone}
          overallReadiness={overallReadiness}
        />

        <MotivationalQuote />

        {/* Section 10 — Footer stats */}
        <FooterStats
          totalInterviews={data.totalInterviews}
          totalCommunicationSessions={data.totalCommunicationSessions}
          totalResumeReports={data.totalResumeReports}
          speakingTimeSeconds={comm.speakingTimeSeconds}
          totalWordsSpoken={data.totalWordsSpoken}
          averageAtsScore={data.averageAtsScore}
        />

        <DashboardFooter />
      </div>
    </Layout>
  );
}
