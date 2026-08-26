import { formatDuration } from "../../lib/formatTime";

export default function SessionTimer({ elapsedSeconds }: { elapsedSeconds: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-fg-muted tabular-nums">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {formatDuration(elapsedSeconds)}
    </div>
  );
}
