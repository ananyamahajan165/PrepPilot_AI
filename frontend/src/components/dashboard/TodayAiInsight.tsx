import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { SparklesIcon, ArrowRightIcon } from "./icons";

export default function TodaysAiInsight({
  aiInsights,
  ctaPath = "/communication-coach",
}: {
  aiInsights: string[];
  ctaPath?: string;
}) {
  const headlineInsight = aiInsights[0];

  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card px-8 py-7 hero-insight-card">
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Today's AI Insight</p>
            </div>

            {headlineInsight ? (
              <p className="font-display text-lg text-fg mt-3 leading-relaxed max-w-2xl">"{headlineInsight}"</p>
            ) : (
              <p className="font-display text-lg text-fg mt-3 leading-relaxed max-w-2xl">
                "Complete your first session and I'll start giving you personalized insights here every day."
              </p>
            )}
          </div>

          <Link
            to={ctaPath}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0 whitespace-nowrap hover:gap-2.5 transition-all duration-300"
          >
            Practice Now <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
