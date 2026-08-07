/** Formats a duration in seconds as "mm:ss" — used by every recording/
 * session timer in the app (Communication Coach's mic recorder, Interview
 * Practice's session timer). */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
