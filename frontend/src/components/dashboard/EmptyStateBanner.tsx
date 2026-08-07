import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";

/** A small illustration echoing "practice → progress," restyled for the
 * dark surface. Custom SVG rather than a stock illustration, so it stays
 * visually consistent with the rest of the app instead of looking bolted-on. */
function StartingOutIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-40 h-32" aria-hidden="true">
      <rect x="20" y="14" width="90" height="94" rx="8" fill="var(--card-hover)" stroke="var(--border)" strokeWidth="2" />
      <line x1="34" y1="34" x2="86" y2="34" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="48" x2="96" y2="48" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="62" x2="76" y2="62" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />
      <polyline
        points="30,92 50,80 66,88 86,68 102,74"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="118" cy="30" r="22" fill="var(--card-hover)" stroke="var(--primary)" strokeOpacity="0.4" strokeWidth="2" />
      <path
        d="M108 30l7 7 13-14"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EmptyStateBanner({ name }: { name: string }) {
  return (
    <FadeIn>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <StartingOutIllustration />
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold text-fg">Welcome, {name} — let's get started</h2>
          <p className="mt-1.5 text-sm text-fg-secondary max-w-md">
            You haven't practiced yet. Try the Communication Coach, a mock interview question, or
            upload your resume — your first session unlocks your progress dashboard below.
          </p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
            <Link
              to="/communication-coach"
              className="text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-4 py-2"
            >
              Start Communication Practice
            </Link>
            <Link
              to="/interview"
              className="text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-4 py-2"
            >
              Practice an Interview
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
