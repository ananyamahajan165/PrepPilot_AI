const InterviewSession = require("../models/InterviewSession");
const CommunicationSession = require("../models/CommunicationSession");
const ResumeReport = require("../models/ResumeReport");
const { success } = require("../utils/apiResponse");

// Product-level targets (constants, not per-user data) — how many practice
// actions count as "on track" for the day/week. Progress *toward* these is
// always computed live from real documents below; only the target itself
// is a fixed rule, the same way a fitness app might define "10k steps/day."
const DAILY_GOAL_TARGET = 3;
const WEEKLY_GOAL_TARGET = 10;
const TIMELINE_DAYS = 371; // 53 weeks — enough for a full GitHub-style contribution grid

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n) {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
}

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
}

// Returns the set of distinct calendar days (UTC) on which a given
// collection has at least one document for this user, grouped server-side
// so we never pull raw documents just to compute a streak.
async function distinctActiveDays(Model, userId) {
  const rows = await Model.aggregate([
    { $match: { user: userId } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
  ]);
  return rows.map((r) => r._id);
}

function computeStreak(activeDaySet) {
  // Current streak: walk backward from today (or yesterday, so a user who
  // hasn't practiced *yet* today doesn't see their streak reset to 0
  // prematurely) counting consecutive active days.
  let current = 0;
  const today = startOfDay(new Date());
  const hasToday = activeDaySet.has(toDateKey(today));
  let cursor = hasToday ? today : new Date(today.getTime() - 86400000);

  while (activeDaySet.has(toDateKey(cursor))) {
    current += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }

  // Longest streak ever: sort all active days and find the longest run of
  // consecutive calendar dates.
  const sortedDays = [...activeDaySet].sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const key of sortedDays) {
    const d = new Date(key);
    if (prev && (d - prev) / 86400000 === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest: Math.max(longest, current) };
}

// Given an ascending-by-date array of numeric scores, compares the average
// of the most recent half against the earlier half. Used for grammar
// improvement, vocabulary growth, and confidence trend — all the same shape
// of "am I getting better" signal, just over different score fields.
function computeTrend(scoresAsc) {
  if (scoresAsc.length < 2) return 0;
  const mid = Math.floor(scoresAsc.length / 2);
  const earlier = scoresAsc.slice(0, mid);
  const later = scoresAsc.slice(mid);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.round(avg(later) - avg(earlier));
}

// Rule-based recommendation derived from the user's real aggregate stats —
// not a hardcoded message, a deterministic decision over live numbers.
function recommendNextPractice({
  totalResumeReports,
  totalInterviews,
  totalCommunicationSessions,
  communicationAvgGrammar,
  communicationAvgConfidence,
}) {
  if (totalResumeReports === 0) {
    return {
      module: "resume",
      title: "Analyze your resume",
      reason: "You haven't uploaded a resume yet — get an ATS score and a rewritten summary in seconds.",
      ctaPath: "/resume",
    };
  }
  if (totalCommunicationSessions === 0) {
    return {
      module: "communication",
      title: "Try the Communication Coach",
      reason: "Speak or type a response and get scored on confidence, clarity, and professionalism.",
      ctaPath: "/communication-coach",
    };
  }
  if (totalInterviews === 0) {
    return {
      module: "interview",
      title: "Practice your first interview",
      reason: "Pick a category and difficulty to get scored on clarity and confidence.",
      ctaPath: "/interview",
    };
  }
  if (communicationAvgConfidence < communicationAvgGrammar - 10) {
    return {
      module: "communication",
      title: "Work on your confidence",
      reason: `Your confidence score (${communicationAvgConfidence}) is trailing your grammar score (${communicationAvgGrammar}) — try the Communication Coach's practice exercises.`,
      ctaPath: "/communication-coach",
    };
  }
  if (totalInterviews < 5) {
    return {
      module: "interview",
      title: "Keep building interview reps",
      reason: `You've completed ${totalInterviews} interview session${totalInterviews === 1 ? "" : "s"} — more reps means more consistent scores.`,
      ctaPath: "/interview",
    };
  }
  return {
    module: "interview",
    title: "Try a harder difficulty",
    reason: "You're consistently practicing — challenge yourself with a Hard-difficulty round.",
    ctaPath: "/interview",
  };
}

// Maps the PRD's product ladder (Beginner -> Intermediate -> Interview Ready
// -> Placement Ready) onto real aggregate stats. Thresholds are a product
// rule (like a fitness app's belt system); the *placement on the ladder* is
// always computed from this user's real documents.
const LEARNING_STAGES = ["Beginner", "Intermediate", "Interview Ready", "Placement Ready"];

function computeLearningStage({ totalInterviews, totalCommunicationSessions, totalResumeReports, averageScore }) {
  const hasAnyActivity = totalInterviews > 0 || totalCommunicationSessions > 0 || totalResumeReports > 0;
  if (!hasAnyActivity) return 0; // Beginner

  const isInterviewReady = totalInterviews >= 5 && averageScore >= 60;
  const isPlacementReady = isInterviewReady && averageScore >= 80 && totalResumeReports >= 1;

  if (isPlacementReady) return 3;
  if (isInterviewReady) return 2;
  return 1; // Intermediate
}

// Turns real deltas/aggregates into short, first-person coaching
// observations — the "AI Insights" section. Deliberately rule-based (not
// an extra Gemini call on every dashboard load, which would add latency
// and cost to a page that gets hit constantly) — but every sentence is
// generated FROM real numbers already computed above, never hardcoded copy
// unless there's genuinely nothing to observe yet.
function buildAiInsights({
  confidenceTrend,
  vocabularyGrowth,
  grammarImprovement,
  weeklyImprovement,
  categoryPerformance,
  fillerWordAvg,
  totalCommunicationSessions,
  totalInterviews,
}) {
  const insights = [];

  if (confidenceTrend > 3) {
    insights.push(`Confidence is up ${confidenceTrend} points compared to your earlier sessions — keep it up.`);
  } else if (confidenceTrend < -3) {
    insights.push(`Confidence has dipped ${Math.abs(confidenceTrend)} points recently — a short practice session today could help.`);
  }

  if (vocabularyGrowth > 3) {
    insights.push(`Your vocabulary has improved by ${vocabularyGrowth} points since you started.`);
  }

  if (grammarImprovement > 3) {
    insights.push(`Grammar is trending upward — up ${grammarImprovement} points from your earlier sessions.`);
  }

  if (weeklyImprovement > 3) {
    insights.push(`This week's average score is ${weeklyImprovement} points higher than last week.`);
  } else if (weeklyImprovement < -3) {
    insights.push(`This week has been a bit tougher — ${Math.abs(weeklyImprovement)} points below last week's average.`);
  }

  if (categoryPerformance.length >= 2) {
    const sorted = [...categoryPerformance].sort((a, b) => b.avgScore - a.avgScore);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (best.avgScore - worst.avgScore >= 8) {
      insights.push(`Your ${best.category} answers (avg ${best.avgScore}) are noticeably stronger than ${worst.category} (avg ${worst.avgScore}).`);
    }
  }

  if (fillerWordAvg > 3) {
    insights.push(`You're averaging ${fillerWordAvg} filler words per session — try pausing silently instead of saying "um" or "like."`);
  } else if (totalCommunicationSessions >= 3 && fillerWordAvg <= 1) {
    insights.push(`Your speech is coming across clean — very few filler words across your recent sessions.`);
  }

  if (insights.length === 0 && (totalCommunicationSessions > 0 || totalInterviews > 0)) {
    insights.push("Keep practicing — trends and comparisons will show up here as you complete more sessions.");
  }

  return insights.slice(0, 4);
}

// Real, computed achievements — each one is either earned or not based on
// actual documents, never toggled manually. `progress` (0-1) lets the
// frontend show a partial-progress state for unearned ones.
function buildAchievements({
  streak,
  totalInterviews,
  bestInterviewScore,
  longestSpeakingSeconds,
  weeklyCompleted,
  weeklyTarget,
  totalCommunicationSessions,
}) {
  return [
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Practice 7 days in a row",
      icon: "flame",
      earned: streak.longest >= 7,
      progress: Math.min(streak.longest / 7, 1),
    },
    {
      id: "best-interview-80",
      title: "Interview Sharp",
      description: "Score 80+ on a mock interview",
      icon: "target",
      earned: bestInterviewScore >= 80,
      progress: Math.min(bestInterviewScore / 80, 1),
    },
    {
      id: "interview-reps-10",
      title: "Reps Add Up",
      description: "Complete 10 interview questions",
      icon: "layers",
      earned: totalInterviews >= 10,
      progress: Math.min(totalInterviews / 10, 1),
    },
    {
      id: "longest-session-5min",
      title: "Long Speaker",
      description: "Speak for 5+ minutes in one session",
      icon: "mic",
      earned: longestSpeakingSeconds >= 300,
      progress: Math.min(longestSpeakingSeconds / 300, 1),
    },
    {
      id: "weekly-champion",
      title: "Weekly Champion",
      description: "Hit your weekly goal",
      icon: "trophy",
      earned: weeklyCompleted >= weeklyTarget,
      progress: Math.min(weeklyCompleted / weeklyTarget, 1),
    },
    {
      id: "communication-10",
      title: "Confident Communicator",
      description: "Complete 10 Communication Coach sessions",
      icon: "sparkles",
      earned: totalCommunicationSessions >= 10,
      progress: Math.min(totalCommunicationSessions / 10, 1),
    },
  ];
}

// GET /api/dashboard
async function getDashboard(req, res) {
  const userId = req.user._id;
  const rangeStart = daysAgo(TIMELINE_DAYS - 1);
  const todayStart = startOfDay(new Date());
  const weekStart = daysAgo(6);
  const prevWeekStart = daysAgo(13);

  const [
    totalInterviews,
    totalCommunicationSessions,
    totalResumeReports,
    interviewAgg,
    communicationAgg,
    recentInterviews,
    recentCommunication,
    recentResumes,
    interviewsToday,
    communicationToday,
    resumesToday,
    interviewsThisWeek,
    communicationThisWeek,
    resumesThisWeek,
    interviewActiveDays,
    communicationActiveDays,
    resumeActiveDays,
    timelineInterviewRows,
    timelineCommunicationRows,
    timelineResumeRows,
    communicationScoresAsc,
    speakingTimeAgg,
    weeklyOverallAgg,
    prevWeeklyOverallAgg,
    interviewWeeklyAgg,
    interviewPrevWeeklyAgg,
    resumeWeeklyAgg,
    resumePrevWeeklyAgg,
    categoryPerformanceAgg,
    bestInterviewAgg,
    longestSpeakingAgg,
    fillerWordAgg,
    resumeAtsAgg,
  ] = await Promise.all([
    InterviewSession.countDocuments({ user: userId }),
    CommunicationSession.countDocuments({ user: userId }),
    ResumeReport.countDocuments({ user: userId }),
    InterviewSession.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          avgOverall: { $avg: "$overallScore" },
          avgGrammar: { $avg: "$grammarScore" },
          avgCommunication: { $avg: "$communicationScore" },
          avgConfidence: { $avg: "$confidenceScore" },
          avgProfessionalism: { $avg: "$professionalismScore" },
          avgTechnical: { $avg: "$technicalScore" },
        },
      },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$scores.confidence" },
          avgCommunication: { $avg: "$scores.communication" },
          avgProfessionalism: { $avg: "$scores.professionalism" },
          avgGrammar: { $avg: "$scores.grammar" },
          avgVocabulary: { $avg: "$scores.vocabulary" },
          avgFluency: { $avg: "$scores.fluency" },
          avgOverall: { $avg: "$overallScore" },
        },
      },
    ]),
    InterviewSession.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    CommunicationSession.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    ResumeReport.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    InterviewSession.countDocuments({ user: userId, createdAt: { $gte: todayStart } }),
    CommunicationSession.countDocuments({ user: userId, createdAt: { $gte: todayStart } }),
    ResumeReport.countDocuments({ user: userId, createdAt: { $gte: todayStart } }),
    InterviewSession.countDocuments({ user: userId, createdAt: { $gte: weekStart } }),
    CommunicationSession.countDocuments({ user: userId, createdAt: { $gte: weekStart } }),
    ResumeReport.countDocuments({ user: userId, createdAt: { $gte: weekStart } }),
    distinctActiveDays(InterviewSession, userId),
    distinctActiveDays(CommunicationSession, userId),
    distinctActiveDays(ResumeReport, userId),
    InterviewSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: rangeStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgScore: { $avg: "$overallScore" },
          count: { $sum: 1 },
        },
      },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: rangeStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    ResumeReport.aggregate([
      { $match: { user: userId, createdAt: { $gte: rangeStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    CommunicationSession.find({ user: userId })
      .sort({ createdAt: 1 })
      .select("scores.grammar scores.vocabulary scores.confidence"),
    CommunicationSession.aggregate([
      { $match: { user: userId, inputMethod: "voice" } },
      { $group: { _id: null, totalSeconds: { $sum: "$durationSeconds" } } },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: null, avgOverall: { $avg: "$overallScore" } } },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: prevWeekStart, $lt: weekStart } } },
      { $group: { _id: null, avgOverall: { $avg: "$overallScore" } } },
    ]),
    InterviewSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: null, avgOverall: { $avg: "$overallScore" } } },
    ]),
    InterviewSession.aggregate([
      { $match: { user: userId, createdAt: { $gte: prevWeekStart, $lt: weekStart } } },
      { $group: { _id: null, avgOverall: { $avg: "$overallScore" } } },
    ]),
    ResumeReport.aggregate([
      { $match: { user: userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: null, avgAts: { $avg: "$atsScore" } } },
    ]),
    ResumeReport.aggregate([
      { $match: { user: userId, createdAt: { $gte: prevWeekStart, $lt: weekStart } } },
      { $group: { _id: null, avgAts: { $avg: "$atsScore" } } },
    ]),
    // Per-category interview performance — powers the "your X answers are
    // stronger than Y" insight. Only categories with 2+ attempts count, so
    // a single lucky/unlucky question doesn't skew the comparison.
    InterviewSession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", avgScore: { $avg: "$overallScore" }, count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } },
    ]),
    InterviewSession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, best: { $max: "$overallScore" } } },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId, inputMethod: "voice" } },
      { $group: { _id: null, longest: { $max: "$durationSeconds" } } },
    ]),
    CommunicationSession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, avgFillers: { $avg: "$fillerWordCount" }, totalWords: { $sum: "$wordCount" } } },
    ]),
    ResumeReport.aggregate([{ $match: { user: userId } }, { $group: { _id: null, avgAts: { $avg: "$atsScore" } } }]),
  ]);

  const stats = interviewAgg[0] || { avgOverall: 0, avgGrammar: 0, avgCommunication: 0, avgConfidence: 0, avgProfessionalism: 0 };
  const averageScore = Math.round(stats.avgOverall || 0);
  const averageGrammarScore = Math.round(stats.avgGrammar || 0);
  const averageCommunicationScore = Math.round(stats.avgCommunication || 0);
  const averageConfidenceScore = Math.round(stats.avgConfidence || 0);
  const averageProfessionalismScore = Math.round(stats.avgProfessionalism || 0);
  const averageAtsScore = Math.round(resumeAtsAgg[0]?.avgAts || 0);
  const averageTechnicalScore = Math.round(stats.avgTechnical || 0);

  const commStats = communicationAgg[0] || {
    avgConfidence: 0,
    avgCommunication: 0,
    avgProfessionalism: 0,
    avgGrammar: 0,
    avgVocabulary: 0,
    avgFluency: 0,
    avgOverall: 0,
  };
  const communicationAvgGrammar = Math.round(commStats.avgGrammar || 0);
  const communicationAvgConfidence = Math.round(commStats.avgConfidence || 0);

  const grammarImprovement = computeTrend(communicationScoresAsc.map((s) => s.scores.grammar));
  const vocabularyGrowth = computeTrend(communicationScoresAsc.map((s) => s.scores.vocabulary));
  const confidenceTrend = computeTrend(communicationScoresAsc.map((s) => s.scores.confidence));

  const speakingTimeSeconds = speakingTimeAgg[0]?.totalSeconds || 0;
  const weeklyAvg = weeklyOverallAgg[0]?.avgOverall;
  const prevWeeklyAvg = prevWeeklyOverallAgg[0]?.avgOverall;
  const weeklyImprovement =
    weeklyAvg != null && prevWeeklyAvg != null ? Math.round(weeklyAvg - prevWeeklyAvg) : 0;

  const interviewWeeklyAvg = interviewWeeklyAgg[0]?.avgOverall;
  const interviewPrevWeeklyAvg = interviewPrevWeeklyAgg[0]?.avgOverall;
  const interviewWeeklyImprovement =
    interviewWeeklyAvg != null && interviewPrevWeeklyAvg != null
      ? Math.round(interviewWeeklyAvg - interviewPrevWeeklyAvg)
      : 0;

  const atsWeeklyAvg = resumeWeeklyAgg[0]?.avgAts;
  const atsPrevWeeklyAvg = resumePrevWeeklyAgg[0]?.avgAts;
  const atsWeeklyImprovement =
    atsWeeklyAvg != null && atsPrevWeeklyAvg != null ? Math.round(atsWeeklyAvg - atsPrevWeeklyAvg) : 0;

  const activeDaySet = new Set([...interviewActiveDays, ...communicationActiveDays, ...resumeActiveDays]);
  const streak = computeStreak(activeDaySet);

  const dailyCompleted = interviewsToday + communicationToday + resumesToday;
  const weeklyCompleted = interviewsThisWeek + communicationThisWeek + resumesThisWeek;

  const categoryPerformance = categoryPerformanceAgg.map((c) => ({
    category: c._id,
    avgScore: Math.round(c.avgScore),
    count: c.count,
  }));
  const bestInterviewScore = Math.round(bestInterviewAgg[0]?.best || 0);
  const longestSpeakingSeconds = Math.round(longestSpeakingAgg[0]?.longest || 0);
  const fillerWordAvg = Math.round((fillerWordAgg[0]?.avgFillers || 0) * 10) / 10;
  const totalWordsSpoken = fillerWordAgg[0]?.totalWords || 0;

  // Build a dense 14-day array (oldest -> newest) so the frontend never has
  // to fill gaps itself — days with no interview sessions simply show
  // avgScore: null.
  const scoreByDay = new Map(timelineInterviewRows.map((r) => [r._id, { avgScore: Math.round(r.avgScore), count: r.count }]));
  const communicationCountByDay = new Map(timelineCommunicationRows.map((r) => [r._id, r.count]));
  const resumeCountByDay = new Map(timelineResumeRows.map((r) => [r._id, r.count]));

  const timeline = [];
  for (let i = TIMELINE_DAYS - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const key = toDateKey(date);
    const interviewEntry = scoreByDay.get(key);
    const activityCount =
      (interviewEntry?.count || 0) + (communicationCountByDay.get(key) || 0) + (resumeCountByDay.get(key) || 0);
    timeline.push({
      date: key,
      avgScore: interviewEntry ? interviewEntry.avgScore : null,
      activityCount,
    });
  }

  const recommendedPractice = recommendNextPractice({
    totalResumeReports,
    totalInterviews,
    totalCommunicationSessions,
    communicationAvgGrammar,
    communicationAvgConfidence,
  });

  // Merge the three recent-activity feeds into one, sorted by recency.
  const recentActivity = [
    ...recentInterviews.map((s) => ({
      id: s._id,
      type: "interview",
      title: `${s.category} · ${s.difficulty}`,
      subtitle: s.question,
      score: s.overallScore,
      createdAt: s.createdAt,
    })),
    ...recentCommunication.map((s) => ({
      id: s._id,
      type: "communication",
      title: s.inputMethod === "voice" ? "Communication Coach (voice)" : "Communication Coach",
      subtitle: s.transcript,
      score: s.overallScore,
      createdAt: s.createdAt,
    })),
    ...recentResumes.map((r) => ({
      id: r._id,
      type: "resume",
      title: r.fileName,
      subtitle: `ATS score ${r.atsScore}/100`,
      score: r.atsScore,
      createdAt: r.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const learningStageIndex = computeLearningStage({
    totalInterviews,
    totalCommunicationSessions,
    totalResumeReports,
    averageScore,
  });

  const aiInsights = buildAiInsights({
    confidenceTrend,
    vocabularyGrowth,
    grammarImprovement,
    weeklyImprovement,
    categoryPerformance,
    fillerWordAvg,
    totalCommunicationSessions,
    totalInterviews,
  });

  const achievements = buildAchievements({
    streak,
    totalInterviews,
    bestInterviewScore,
    longestSpeakingSeconds,
    weeklyCompleted,
    weeklyTarget: WEEKLY_GOAL_TARGET,
    totalCommunicationSessions,
  });

  return success(res, 200, {
    hasActivity: totalInterviews > 0 || totalCommunicationSessions > 0 || totalResumeReports > 0,
    totalInterviews,
    totalCommunicationSessions,
    totalResumeReports,
    averageScore,
    averageGrammarScore,
    averageCommunicationScore,
    averageConfidenceScore,
    averageProfessionalismScore,
    averageAtsScore,
    averageTechnicalScore,
    totalWordsSpoken,
    weeklyImprovement,
    interviewWeeklyImprovement,
    atsWeeklyImprovement,
    dailyGoal: { target: DAILY_GOAL_TARGET, completed: Math.min(dailyCompleted, DAILY_GOAL_TARGET) },
    weeklyGoal: { target: WEEKLY_GOAL_TARGET, completed: Math.min(weeklyCompleted, WEEKLY_GOAL_TARGET) },
    recommendedPractice,
    learningStage: { index: learningStageIndex, label: LEARNING_STAGES[learningStageIndex], stages: LEARNING_STAGES },
    timeline,
    recentActivity,
    aiInsights,
    achievements,
    categoryPerformance,
    bestInterviewScore,
    // Everything the Communication Coach flagship feature contributes to
    // the dashboard, kept in its own object so it's easy to find and so it
    // doesn't collide with the interview-derived averages above.
    communicationStats: {
      totalSessions: totalCommunicationSessions,
      averageScores: {
        confidence: Math.round(commStats.avgConfidence || 0),
        communication: Math.round(commStats.avgCommunication || 0),
        professionalism: Math.round(commStats.avgProfessionalism || 0),
        grammar: communicationAvgGrammar,
        vocabulary: Math.round(commStats.avgVocabulary || 0),
        fluency: Math.round(commStats.avgFluency || 0),
        overall: Math.round(commStats.avgOverall || 0),
      },
      grammarImprovement,
      vocabularyGrowth,
      confidenceTrend,
      weeklyImprovement,
      speakingTimeSeconds,
      fillerWordAvg,
      longestSpeakingSeconds,
    },
  });
}

module.exports = { getDashboard };