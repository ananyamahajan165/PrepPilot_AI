import { FadeIn, staggerDelay } from "../ui/motion";
import { formatDuration } from "../../lib/formatTime";

interface TimelinePoint {
  date: string;
  avgScore: number | null;
  activityCount: number;
}

const CHART_WIDTH = 700;
const CHART_HEIGHT = 140;
const PADDING = 16;

function formatDay(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1);
}

function TrendPill({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const isUp = value > 0;
  const isFlat = value === 0;
  const color = isFlat ? "text-fg-secondary" : isUp ? "text-emerald-400" : "text-rose-400";
  const arrow = isFlat ? "→" : isUp ? "↑" : "↓";

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <p className="text-xs text-fg-secondary">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${color}`}>
        {arrow} {Math.abs(value)}
        {suffix}
      </p>
    </div>
  );
}

export default function PerformanceOverview({
  timeline: fullTimeline,
  confidenceTrend,
  vocabularyGrowth,
  grammarImprovement,
  speakingTimeSeconds,
}: {
  timeline: TimelinePoint[];
  confidenceTrend: number;
  vocabularyGrowth: number;
  grammarImprovement: number;
  speakingTimeSeconds: number;
}) {
  // timeline now covers a full year (for the Learning Calendar heatmap
  // elsewhere on the dashboard) — this chart only ever shows the most
  // recent 14 days, regardless of how much history the array holds.
  const timeline = fullTimeline.slice(-14);
  const hasAnyScore = timeline.some((d) => d.avgScore !== null);
  const hasAnyActivity = timeline.some((d) => d.activityCount > 0);
  const stepX = (CHART_WIDTH - PADDING * 2) / Math.max(timeline.length - 1, 1);
  const maxActivity = Math.max(...timeline.map((d) => d.activityCount), 1);

  function scoreToY(score: number) {
    const usable = CHART_HEIGHT - PADDING * 2;
    return PADDING + usable - (score / 100) * usable;
  }

  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];
  timeline.forEach((point, i) => {
    if (point.avgScore === null) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push({ x: PADDING + i * stepX, y: scoreToY(point.avgScore) });
  });
  if (current.length) segments.push(current);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-fg">Performance overview</p>
        <span className="text-xs text-fg-muted">Last 14 days</span>
      </div>

      <div className="grid sm:grid-cols-4 gap-6 mb-8">
        <FadeIn delay={staggerDelay(0)}>
          <TrendPill label="Confidence trend" value={confidenceTrend} />
        </FadeIn>
        <FadeIn delay={staggerDelay(1)}>
          <TrendPill label="Vocabulary growth" value={vocabularyGrowth} />
        </FadeIn>
        <FadeIn delay={staggerDelay(2)}>
          <TrendPill label="Grammar improvement" value={grammarImprovement} />
        </FadeIn>
        <FadeIn delay={staggerDelay(3)}>
          <div className="rounded-xl border border-border bg-background p-6">
            <p className="text-xs text-fg-secondary">Speaking time</p>
            <p className="text-xl font-semibold mt-1 text-fg">{formatDuration(speakingTimeSeconds)}</p>
          </div>
        </FadeIn>
      </div>

      {!hasAnyActivity ? (
        <div className="text-center py-8 border-t border-border">
          <p className="text-sm text-fg-muted">
            No sessions yet — your interview score trend and activity will show up here.
          </p>
        </div>
      ) : (
        <div className="border-t border-border pt-5">
          <p className="text-xs text-fg-secondary mb-2">Interview score trend</p>
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-32" preserveAspectRatio="none">
            <line x1={PADDING} y1={scoreToY(100)} x2={CHART_WIDTH - PADDING} y2={scoreToY(100)} stroke="var(--border)" strokeWidth="1" />
            <line x1={PADDING} y1={scoreToY(50)} x2={CHART_WIDTH - PADDING} y2={scoreToY(50)} stroke="var(--border)" strokeWidth="1" />
            {hasAnyScore &&
              segments.map((seg, i) => (
                <polyline
                  key={i}
                  points={seg.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            {hasAnyScore &&
              segments.flat().map((p) => <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="3" fill="var(--primary)" />)}
          </svg>

          <p className="text-xs text-fg-secondary mt-4 mb-2">Practice heatmap</p>
          <div className="flex items-end gap-1 h-8">
            {timeline.map((point) => (
              <div
                key={point.date}
                className="flex-1 rounded-sm"
                style={{
                  height: point.activityCount > 0 ? `${Math.max((point.activityCount / maxActivity) * 100, 15)}%` : "10%",
                  backgroundColor: point.activityCount > 0 ? "var(--primary)" : "var(--border)",
                  opacity: point.activityCount > 0 ? Math.max(point.activityCount / maxActivity, 0.35) : 1,
                }}
                title={`${point.date}: ${point.activityCount} session${point.activityCount === 1 ? "" : "s"}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {timeline.map((point, i) => (
              <span key={point.date} className="flex-1 text-center text-[10px] text-fg-muted">
                {i % 2 === 0 ? formatDay(point.date) : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
