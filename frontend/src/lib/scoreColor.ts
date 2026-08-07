/** Single source of truth for "is this score good/ok/poor" — every score
 * display in the app (interview scores, communication scores, ATS score)
 * uses the same 80/50 thresholds, just rendered differently depending on
 * whether it's a light-theme bar, a dark-theme ring, or an SVG stroke. */
export type ScoreTier = "high" | "mid" | "low";

export function scoreTier(value: number): ScoreTier {
  if (value >= 80) return "high";
  if (value >= 50) return "mid";
  return "low";
}

// Light-theme Tailwind bg classes (progress bars — dashboard, interview results)
const barClasses: Record<ScoreTier, string> = {
  high: "bg-emerald-500",
  mid: "bg-amber-500",
  low: "bg-rose-500",
};
export function scoreBarClass(value: number): string {
  return barClasses[scoreTier(value)];
}

// Hex colors for inline SVG strokes (light-theme rings — resume ATS score)
const hexColors: Record<ScoreTier, string> = {
  high: "#10B981",
  mid: "#2f57cc",
  low: "#F59E0B",
};
export function scoreHex(value: number): string {
  return hexColors[scoreTier(value)];
}

// Dark-theme text + ring color pair (Communication Coach score cards)
const darkColors: Record<ScoreTier, { text: string; ring: string }> = {
  high: { text: "text-emerald-400", ring: "#34D399" },
  mid: { text: "text-amber-400", ring: "#FBBF24" },
  low: { text: "text-rose-400", ring: "#FB7185" },
};
export function scoreDarkColor(value: number): { text: string; ring: string } {
  return darkColors[scoreTier(value)];
}

// Light-theme "pill badge" text+bg pair (score badges — resume history list)
const pillClasses: Record<ScoreTier, string> = {
  high: "text-emerald-700 bg-emerald-50",
  mid: "text-brand-700 bg-brand-50",
  low: "text-amber-700 bg-amber-50",
};
export function scorePillClass(value: number): string {
  return pillClasses[scoreTier(value)];
}
