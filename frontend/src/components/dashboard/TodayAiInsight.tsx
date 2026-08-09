import { FadeIn } from "../ui/motion";
import { SparklesIcon } from "./icons";

/** Today's AI Insight — standalone section, deliberately separate from
 * HeroSection (see that file's comment). This needs its own clear visual
 * identity as AI-generated content, distinct from the user's own welcome
 * area above it. Wide and elegant rather than tall — a horizontal strip,
 * not another big square card. */
export default function TodaysAiInsight({ aiInsights }: { aiInsights: string[] }) {
  const headlineInsight = aiInsights[0];
  const supportingInsights = aiInsights.slice(1, 3);

  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card px-10 py-8 hero-insight-card">
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Today's AI Insight</p>
          </div>

          {headlineInsight ? (
            <p className="font-display text-xl text-fg mt-4 leading-relaxed max-w-2xl">"{headlineInsight}"</p>
          ) : (
            <p className="font-display text-xl text-fg mt-4 leading-relaxed max-w-2xl">
              "Complete your first session and I'll start giving you personalized insights here every day."
            </p>
          )}

          {supportingInsights.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {supportingInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-fg-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
