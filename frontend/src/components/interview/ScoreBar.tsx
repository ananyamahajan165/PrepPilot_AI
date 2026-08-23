import { scoreBarClass } from "../../lib/scoreColor";

export default function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-fg-secondary">{label}</span>
        <span className="font-medium text-fg">{value}/100</span>
      </div>
      <div className="w-full bg-surface-secondary rounded-full h-2">
        <div
          className={`h-2 rounded-full ${scoreBarClass(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
