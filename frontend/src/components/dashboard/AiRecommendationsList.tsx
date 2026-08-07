import { Link } from "react-router-dom";
import { FadeIn, staggerDelay } from "../ui/motion";
import { ArrowRightIcon, SparklesIcon } from "./icons";

interface Recommendation {
  module: string;
  title: string;
  reason: string;
  ctaPath: string;
}

interface CategoryPerf {
  category: string;
  avgScore: number;
  count: number;
}

type Priority = "High" | "Medium" | "Low";

interface Card {
  title: string;
  reason: string;
  priority: Priority;
  estimatedMinutes: number;
  ctaPath: string;
  ctaLabel: string;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-rose-400/10 text-rose-400",
  Medium: "bg-amber-400/10 text-amber-500",
  Low: "bg-teal-400/10 text-teal-400",
};

/** Builds the secondary suggestion cards from real completion gaps (never
 * fabricated scores) — e.g. "no resume uploaded yet" or "no HR interview
 * attempted yet" — so every card here is honestly derived from what the
 * user has and hasn't actually done. */
function buildGapCards(totalResumeReports: number, categoryPerformance: CategoryPerf[], primaryModule: string): Card[] {
  const cards: Card[] = [];
  const attemptedCategories = new Set((categoryPerformance || []).map((c) => c.category));

  if (totalResumeReports === 0 && primaryModule !== "resume") {
    cards.push({
      title: "Upload your resume",
      reason: "You haven't gotten an ATS score yet — most recruiters filter on this before a human ever reads it.",
      priority: "High",
      estimatedMinutes: 2,
      ctaPath: "/resume",
      ctaLabel: "Upload Resume",
    });
  }
  if (!attemptedCategories.has("HR") && primaryModule !== "interview-hr") {
    cards.push({
      title: "Complete an HR round",
      reason: "You haven't practiced HR questions yet — these come up in almost every interview process.",
      priority: "Medium",
      estimatedMinutes: 15,
      ctaPath: "/interview",
      ctaLabel: "Start HR Round",
    });
  }
  if (!attemptedCategories.has("Technical") && primaryModule !== "interview-technical") {
    cards.push({
      title: "Attempt a Technical interview",
      reason: "No technical practice sessions yet — a good place to find weak spots before the real thing.",
      priority: "Medium",
      estimatedMinutes: 15,
      ctaPath: "/interview",
      ctaLabel: "Start Technical Round",
    });
  }
  return cards.slice(0, 2); // keep the list tight — primary + at most 2 gap cards
}

function moduleTimeEstimate(module: string) {
  if (module.includes("resume")) return 2;
  if (module.includes("interview")) return 15;
  return 5; // communication coach default
}

export default function AiRecommendationsList({
  recommendation,
  totalResumeReports,
  categoryPerformance,
}: {
  recommendation: Recommendation;
  totalResumeReports: number;
  categoryPerformance: CategoryPerf[];
}) {
  const primaryCard: Card = {
    title: recommendation.title,
    reason: recommendation.reason,
    priority: "High",
    estimatedMinutes: moduleTimeEstimate(recommendation.module),
    ctaPath: recommendation.ctaPath,
    ctaLabel: "Go now",
  };

  const cards = [primaryCard, ...buildGapCards(totalResumeReports, categoryPerformance, recommendation.module)];

  return (
    <div className="card-premium p-6 h-full">
      <p className="text-sm font-semibold text-fg mb-1">AI Recommendations</p>
      <p className="text-xs text-fg-secondary mb-4">What to do next, ranked by what will help most</p>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <FadeIn key={card.title} delay={staggerDelay(i)}>
            <div className="rounded-xl border border-border bg-surface-secondary p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${PRIORITY_STYLES[card.priority]}`}>
                  {card.priority}
                </span>
                <span className="text-[11px] text-fg-muted">~{card.estimatedMinutes} min</span>
              </div>
              <p className="text-sm font-medium text-fg flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                {card.title}
              </p>
              <p className="text-xs text-fg-secondary mt-1.5 leading-relaxed">{card.reason}</p>
              <Link
                to={card.ctaPath}
                className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                {card.ctaLabel} <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
