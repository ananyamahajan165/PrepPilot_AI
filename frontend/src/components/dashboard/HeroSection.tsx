import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { ArrowRightIcon } from "./icons";

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Welcome Hero — standalone section. This is the user's own space
 * (identity, level, CTAs) and is deliberately NOT paired in a row with
 * Today's AI Insight (see TodaysAiInsight.tsx, rendered as its own
 * separate section below this one in Dashboard.tsx) — the two need to
 * read as clearly distinct: "this is me" vs. "this is AI-generated". */
export default function HeroSection({
  firstName,
  avatarUrl,
  levelLabel,
  hasActivity,
}: {
  firstName: string;
  avatarUrl: string;
  levelLabel: string;
  hasActivity: boolean;
}) {
  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-background p-10 transition-shadow duration-300 hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.12)]">
        <div
          className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}`}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <p className="text-sm text-fg-secondary">{timeGreeting()},</p>
                <h1 className="font-display text-3xl font-medium text-fg -mt-0.5">
                  {firstName} <span aria-hidden="true">👋</span>
                </h1>
              </div>
            </div>

            <span className="inline-block mt-5 text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 rounded-full px-3 py-1">
              {levelLabel}
            </span>

            <p className="text-fg-secondary mt-4 text-sm leading-relaxed max-w-md">
              {hasActivity
                ? "Continue improving your communication confidence."
                : "Let's get your first session in — your personal AI coach is ready."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/communication-coach"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg rounded-full px-6 py-3"
            >
              Continue Practice <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg border border-border hover:border-primary/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md rounded-full px-6 py-3"
            >
              Mock Interview
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
