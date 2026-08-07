import { useTheme } from "../../context/ThemeContext";
import { FadeIn } from "../ui/motion";

interface Point {
  overallScore: number;
  createdAt: string;
}

/** Small inline sparkline of the user's last few overall scores, oldest to
 * newest. Hand-drawn SVG (same approach as ScoreCard's ring) rather than a
 * new charting dependency — keeps this consistent with how the rest of the
 * project builds visuals and avoids installing anything new for one graph. */
export default function ImprovementGraph({ points }: { points: Point[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (points.length < 2) {
    return (
      <FadeIn>
        <div className="rounded-2xl p-5 border bg-card border-border">
          <p className="text-sm font-semibold mb-2 text-fg">Improvement graph</p>
          <p className={`text-sm ${isDark ? "text-fg-secondary" : "text-fg-muted"}`}>
            Complete a couple more sessions to start seeing your trend here.
          </p>
        </div>
      </FadeIn>
    );
  }

  const width = 560;
  const height = 140;
  const padding = 16;
  const scores = points.map((p) => p.overallScore);
  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 100);
  const range = Math.max(max - min, 1);

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p.overallScore - min) / range) * (height - padding * 2);
    return { x, y, score: p.overallScore };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padding} L ${coords[0].x.toFixed(1)} ${height - padding} Z`;

  const first = scores[0];
  const last = scores[scores.length - 1];
  const delta = last - first;

  return (
    <FadeIn>
      <div className="rounded-2xl p-5 border bg-card border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-fg">Improvement graph</p>
          <p className={`text-xs font-medium ${delta >= 0 ? (isDark ? "text-teal-400" : "text-teal-700") : (isDark ? "text-rose-400" : "text-rose-700")}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} pts since your first session shown
          </p>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          <defs>
            <linearGradient id="improvementFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#improvementFill)" />
          <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={3.5} fill="var(--primary)" />
          ))}
        </svg>
        <div className={`flex justify-between text-[11px] mt-1 ${isDark ? "text-fg-secondary" : "text-fg-muted"}`}>
          <span>{points.length} most recent sessions</span>
          <span>Latest: {last}</span>
        </div>
      </div>
    </FadeIn>
  );
}
