
export type ScoreTier = "high" | "mid" | "low";

export function scoreTier(value: number): ScoreTier {
  if (value >= 80) return "high";
  if (value >= 50) return "mid";
  return "low";
}

const barClasses: Record<ScoreTier, string> = {
  high: "bg-emerald-500",
  mid: "bg-amber-500",
  low: "bg-rose-500",
};
export function scoreBarClass(value: number): string {
  return barClasses[scoreTier(value)];
}

const hexColors: Record<ScoreTier, string> = {
  high: "#10B981",
  mid: "#2f57cc",
  low: "#F59E0B",
};
export function scoreHex(value: number): string {
  return hexColors[scoreTier(value)];
}

const darkColors: Record<ScoreTier, { text: string; ring: string }> = {
  high: { text: "text-emerald-400", ring: "#34D399" },
  mid: { text: "text-amber-400", ring: "#FBBF24" },
  low: { text: "text-rose-400", ring: "#FB7185" },
};
export function scoreDarkColor(value: number): { text: string; ring: string } {
  return darkColors[scoreTier(value)];
}

const pillClasses: Record<ScoreTier, string> = {
  high: "text-emerald-700 bg-emerald-50",
  mid: "text-brand-700 bg-brand-50",
  low: "text-amber-700 bg-amber-50",
};
export function scorePillClass(value: number): string {
  return pillClasses[scoreTier(value)];
}
