import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { FlameIcon, ArrowRightIcon } from "./icons";

interface Goal {
  target: number;
  completed: number;
}

export default function GoalNextAction({
  dailyGoal,
  streak,
  recommendedTitle,
  ctaPath,
}: {
  dailyGoal: Goal;
  streak: { current: number; longest: number };
  recommendedTitle: string;
  ctaPath: string;
}) {
  const safeStreak = streak || { current: 0, longest: 0 };
  const target = Math.max(dailyGoal.target, 1);
  const completed = Math.min(dailyGoal.completed, target);
  const progressPct = Math.round((completed / target) * 100);
  const remaining = target - completed;
  const isDone = remaining <= 0;

  const headline = isDone
    ? "Today's goal complete — nice work"
    : `Complete ${remaining} more communication session${remaining === 1 ? "" : "s"} today`;

  return (
    <FadeIn>
      <div className="card-premium">
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-secondary">Your Next Goal</p>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-3">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-fg">{headline}</p>
            {!isDone && <p className="text-xs text-fg-secondary mt-1">{recommendedTitle}</p>}

            <div className="mt-4 max-w-sm">
              <div className="flex items-center justify-between text-xs text-fg-secondary mb-1.5">
                <span>Progress</span>
                <span>
                  {completed} / {target} sessions
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            {safeStreak.current > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 rounded-full px-3 py-1.5 whitespace-nowrap">
                <FlameIcon className="w-3.5 h-3.5" />
                {safeStreak.current} day streak
              </span>
            )}
            <Link
              to={ctaPath}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg rounded-full px-5 py-2.5 whitespace-nowrap"
            >
              Continue Practice <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
