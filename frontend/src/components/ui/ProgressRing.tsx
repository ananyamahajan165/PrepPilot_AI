/** Circular progress ring built with plain SVG stroke-dashoffset — no
 * charting library needed for a single ring. Shared by DailyMission and the
 * Profile page's completion indicator. */
export default function ProgressRing({
  progress,
  size = 64,
  color = "var(--primary)",
  trackColor = "var(--border)",
}: {
  progress: number; // 0-1
  size?: number;
  color?: string;
  trackColor?: string;
}) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(Math.max(progress, 0), 1) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}
