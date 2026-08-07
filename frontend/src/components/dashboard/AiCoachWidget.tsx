import { FadeIn } from "../ui/motion";
import { SparklesIcon, TrophyIcon } from "./icons";

interface CategoryPerf {
  category: string;
  avgScore: number;
  count: number;
}

/** Section 9 — a persistent, compact "AI coach" summary card. Distinct from
 * the Hero's daily insight and Section 5's action list: this one is a
 * standing snapshot of where the student is right now — weakness, strength,
 * next milestone, estimated readiness — all derived from real aggregated
 * data, not re-generated copy. */
export default function AiCoachWidget({
  todaysSuggestion,
  categoryPerformance,
  nextMilestone,
  overallReadiness,
}: {
  todaysSuggestion: string;
  categoryPerformance: CategoryPerf[];
  nextMilestone: string;
  overallReadiness: number;
}) {
  const safeCategoryPerformance = categoryPerformance || [];
  const sorted = [...safeCategoryPerformance].sort((a, b) => b.avgScore - a.avgScore);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const hasEnoughData = safeCategoryPerformance.length >= 2;

  return (
    <FadeIn>
      <div className="card-premium p-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <SparklesIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-fg">Your AI Coach</p>
            <p className="text-xs text-fg-muted">Standing snapshot, updated after every session</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">Today's suggestion</p>
            <p className="text-sm text-fg mt-1.5 leading-relaxed">{todaysSuggestion}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">Strength</p>
            <p className="text-sm text-fg mt-1.5">
              {hasEnoughData ? `${strongest.category} (${strongest.avgScore}%)` : "Complete 2+ interview categories to unlock"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">Weakness</p>
            <p className="text-sm text-fg mt-1.5">
              {hasEnoughData ? `${weakest.category} (${weakest.avgScore}%)` : "Complete 2+ interview categories to unlock"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">Next milestone</p>
            <p className="text-sm text-fg mt-1.5">{nextMilestone}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <TrophyIcon className="w-4.5 h-4.5" />
          </div>
          <p className="text-sm text-fg">
            Estimated placement readiness: <span className="font-semibold text-primary">{overallReadiness}%</span>
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
