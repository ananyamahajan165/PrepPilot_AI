import { FadeIn, StatCounter, staggerDelay } from "../ui/motion";
import { scoreTier } from "../../lib/scoreColor";

// One tier -> token mapping, used for both themes. --success/--warning/--danger
// already swap automatically between light and dark (see index.css), so
// there's no isDark branching needed here at all — the old version kept
// two entirely separate light/dark color maps in this component, which is
// exactly the "second theme implementation" pattern to avoid.
const TIER_TOKEN = {
  high: { ring: "var(--success)", text: "text-success", bg: "bg-success/10", border: "border-success/30" },
  mid: { ring: "var(--warning)", text: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  low: { ring: "var(--danger)", text: "text-danger", bg: "bg-danger/10", border: "border-danger/30" },
} as const;

export default function ScoreCard({ label, value, index = 0 }: { label: string; value: number; index?: number }) {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  const tier = scoreTier(value);
  const { ring, text, bg, border } = TIER_TOKEN[tier];

  return (
    <FadeIn delay={staggerDelay(index)}>
      <div className={`rounded-2xl p-4 flex flex-col items-center text-center border ${bg} ${border}`}>
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={ring}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold ${text}`}>
            <StatCounter value={value} immediate />
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-fg-secondary">{label}</p>
      </div>
    </FadeIn>
  );
}
