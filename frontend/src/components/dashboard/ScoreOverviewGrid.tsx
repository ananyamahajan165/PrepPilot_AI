import { FadeIn, staggerDelay, StatCounter } from "../ui/motion";
import ProgressRing from "../ui/ProgressRing";
import { MicIcon, TargetIcon, LayersIcon, TrophyIcon } from "./icons";

interface TimelinePoint {
  date: string;
  avgScore: number | null;
  activityCount: number;
}

interface ScoreCard {
  label: string;
  value: number;
  trend: number; // week-over-week delta, real data — 0 if not enough history yet
  icon: (props: { className?: string }) => JSX.Element;
  ringColor: string;
  glowColor: string;
  sparkline?: number[]; // only set where we actually have daily history
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return null;
  const w = 64;
  const h = 20;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-5">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Section 2 — "AI Overview": the four headline numbers a recruiter should
 * see in the first three seconds. Each card pairs a progress ring (glanceable
 * shape) with an animated count-up, a real week-over-week trend arrow, and
 * — only where daily history actually exists (Interview Score) — a genuine
 * sparkline. The other three cards show trend without a fabricated curve,
 * rather than faking a shape we don't have real daily data for. */
export default function ScoreOverviewGrid({
  communicationScore,
  interviewScore,
  atsScore,
  overallReadiness,
  communicationTrend,
  interviewTrend,
  atsTrend,
  timeline,
}: {
  communicationScore: number;
  interviewScore: number;
  atsScore: number;
  overallReadiness: number;
  communicationTrend: number;
  interviewTrend: number;
  atsTrend: number;
  timeline: TimelinePoint[];
}) {
  const overallTrend = Math.round((communicationTrend + interviewTrend + atsTrend) / 3);
  const interviewSparkline = timeline.filter((d) => d.avgScore !== null).map((d) => d.avgScore as number);

  const cards: ScoreCard[] = [
    {
      label: "Communication Score",
      value: communicationScore,
      trend: communicationTrend,
      icon: MicIcon,
      ringColor: "#5EEAD4",
      glowColor: "rgba(94,234,212,0.15)",
    },
    {
      label: "Interview Score",
      value: interviewScore,
      trend: interviewTrend,
      icon: TargetIcon,
      ringColor: "var(--primary)",
      glowColor: "rgba(246,183,60,0.15)",
      sparkline: interviewSparkline.length >= 2 ? interviewSparkline : undefined,
    },
    {
      label: "Resume ATS Score",
      value: atsScore,
      trend: atsTrend,
      icon: LayersIcon,
      ringColor: "#60A5FA",
      glowColor: "rgba(96,165,250,0.15)",
    },
    {
      label: "Overall Readiness",
      value: overallReadiness,
      trend: overallTrend,
      icon: TrophyIcon,
      ringColor: "#F472B6",
      glowColor: "rgba(244,114,182,0.15)",
    },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-fg mb-3">AI Overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const previousScore = Math.max(card.value - card.trend, 0);
          return (
            <FadeIn key={card.label} delay={staggerDelay(i)}>
              <div className="card-premium p-6 h-full">
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                  style={{ backgroundColor: card.glowColor }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface-secondary text-fg-secondary">
                    <card.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="relative w-14 h-14 shrink-0">
                    <ProgressRing progress={card.value / 100} size={56} color={card.ringColor} trackColor="var(--border)" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-fg">
                      {card.value}
                    </div>
                  </div>
                </div>

                <p className="relative text-2xl font-semibold text-fg mt-4">
                  <StatCounter value={card.value} suffix="%" immediate />
                </p>
                <p className="relative text-xs text-fg-secondary mt-1">{card.label}</p>

                <div className="relative flex items-center justify-between mt-3">
                  {card.trend !== 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        card.trend > 0 ? "text-teal-400" : "text-rose-400"
                      }`}
                    >
                      {card.trend > 0 ? "▲" : "▼"} {Math.abs(card.trend)} pts
                      <span className="text-fg-muted font-normal">vs last wk ({previousScore})</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-fg-muted">Not enough history yet</span>
                  )}
                  {card.sparkline && <Sparkline points={card.sparkline} color={card.ringColor} />}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
