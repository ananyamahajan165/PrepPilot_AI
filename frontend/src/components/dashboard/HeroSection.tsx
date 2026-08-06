import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { ArrowRightIcon, SparklesIcon } from "./icons";

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Section 1 — Hero. Left: identity + level + CTAs. Right: a distinct
 * "Today's AI Insight" card so the AI-coach framing reads immediately,
 * even before scrolling to any score. */
export default function HeroSection({
  firstName,
  avatarUrl,
  levelLabel,
  hasActivity,
  aiInsights,
}: {
  firstName: string;
  avatarUrl: string;
  levelLabel: string;
  hasActivity: boolean;
  aiInsights: string[];
}) {
  const headlineInsight = aiInsights[0];
  const supportingInsights = aiInsights.slice(1, 3);

  return (
    <FadeIn>
      <div className="grid lg:grid-cols-5 gap-5 items-stretch">
        {/* Left — identity */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-background p-8 flex flex-col justify-between">
          <div
            className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}`}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <p className="text-sm text-fg-secondary">{timeGreeting()},</p>
                <h1 className="font-display text-2xl font-medium text-fg -mt-0.5">
                  {firstName} <span aria-hidden="true">👋</span>
                </h1>
              </div>
            </div>

            <span className="inline-block mt-4 text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 rounded-full px-3 py-1">
              {levelLabel}
            </span>

            <p className="text-fg-secondary mt-4 text-sm leading-relaxed">
              {hasActivity
                ? "Continue improving your communication confidence."
                : "Let's get your first session in — your personal AI coach is ready."}
            </p>
          </div>

          <div className="relative mt-7 flex flex-wrap gap-3">
            <Link
              to="/communication-coach"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-5 py-2.5"
            >
              Continue Practice <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-5 py-2.5"
            >
              Mock Interview
            </Link>
          </div>
        </div>

        {/* Right — Today's AI Insight */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card p-8 flex flex-col justify-center">
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
              <p className="font-display text-xl text-fg mt-4 leading-relaxed max-w-xl">"{headlineInsight}"</p>
            ) : (
              <p className="font-display text-xl text-fg mt-4 leading-relaxed max-w-xl">
                "Complete your first session and I'll start giving you personalized insights here every day."
              </p>
            )}

            {supportingInsights.length > 0 && (
              <ul className="mt-4 space-y-2">
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
      </div>
    </FadeIn>
  );
}
