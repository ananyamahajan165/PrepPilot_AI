import { FadeIn, StatCounter, staggerDelay } from "../ui/motion";
import { scoreDarkColor, scoreTier } from "../../lib/scoreColor";
import { useTheme } from "../../context/ThemeContext";

export default function ScoreCard({ label, value, index = 0 }: { label: string; value: number; index?: number }) {
  const { theme } = useTheme();
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  const isDark = theme === "dark";
  const colorInfo = isDark ? scoreDarkColor(value) : null;
  const tier = scoreTier(value);

  // Light mode background colors
  const lightBgColors: Record<typeof tier, string> = {
    high: "bg-emerald-50",
    mid: "bg-amber-50",
    low: "bg-rose-50",
  };

  // Light mode ring colors
  const lightRingColors: Record<typeof tier, string> = {
    high: "#10B981",
    mid: "#F59E0B",
    low: "#EF4444",
  };

  const ringColor = isDark ? colorInfo!.ring : lightRingColors[tier];
  const textColor = isDark ? colorInfo!.text : "text-fg";

  return (
    <FadeIn delay={staggerDelay(index)}>
      <div className={`rounded-2xl p-4 flex flex-col items-center text-center border ${
        isDark
          ? "bg-card border-border"
          : `${lightBgColors[tier]} border-${tier === "high" ? "emerald" : tier === "mid" ? "amber" : "rose"}-200`
      }`}>
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold ${textColor}`}>
            <StatCounter value={value} immediate />
          </div>
        </div>
        <p className={`mt-2 text-xs font-medium ${
          isDark ? "text-fg-secondary" : "text-fg-secondary"
        }`}>{label}</p>
      </div>
    </FadeIn>
  );
}
