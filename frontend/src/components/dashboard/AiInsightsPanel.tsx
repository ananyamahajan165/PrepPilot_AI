import { FadeIn, staggerDelay } from "../ui/motion";
import { SparklesIcon } from "./icons";

export default function AiInsightsPanel({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-4 h-4 text-teal-400" />
        <p className="text-sm font-semibold text-fg">AI Insights</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <FadeIn key={i} delay={staggerDelay(i)}>
            <div className="h-full rounded-xl border border-teal-400/20 bg-teal-400/[0.04] p-4">
              <p className="text-sm text-fg-secondary leading-relaxed">{insight}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
