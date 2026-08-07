import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { SparklesIcon, ArrowRightIcon } from "./icons";

interface Recommendation {
  module: string;
  title: string;
  reason: string;
  ctaPath: string;
}

export default function RecommendationPanel({ recommendation }: { recommendation: Recommendation }) {
  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your AI coach recommends</p>
            <h3 className="mt-1.5 font-display text-lg font-medium text-fg">{recommendation.title}</h3>
            <p className="mt-1.5 text-sm text-fg-secondary leading-relaxed max-w-xl">"{recommendation.reason}"</p>
            <Link
              to={recommendation.ctaPath}
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-5 py-2.5"
            >
              Go now <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
