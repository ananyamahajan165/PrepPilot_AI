import { FadeIn } from "../ui/motion";
import ProgressRing from "../ui/ProgressRing";

function ringColor(percent: number) {
  if (percent >= 100) return "var(--success)";
  if (percent >= 50) return "var(--primary)";
  return "var(--warning)";
}

export default function ProfileCompletionCard({
  percent,
  missingFields,
}: {
  percent: number;
  missingFields: string[];
}) {
  return (
    <FadeIn>
      <div className="bg-card rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing progress={percent / 100} color={ringColor(percent)} />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-fg-secondary">
              {percent}%
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-fg">Profile completion</p>
            <p className="text-xs text-fg-muted mt-0.5">
              {percent >= 100 ? "Your profile is complete!" : `${missingFields.length} thing${missingFields.length === 1 ? "" : "s"} left`}
            </p>
          </div>
        </div>

        {missingFields.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {missingFields.map((field) => (
              <span key={field} className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-400/10 rounded-full px-2.5 py-1">
                {field}
              </span>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
}
