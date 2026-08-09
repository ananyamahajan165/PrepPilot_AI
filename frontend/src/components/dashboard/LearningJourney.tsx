import { FadeIn } from "../ui/motion";

export default function LearningJourney({
  stages,
  currentIndex,
}: {
  stages: string[];
  currentIndex: number;
}) {
  return (
    <FadeIn>
      <div className="card-premium">
        <p className="text-sm font-semibold text-fg mb-1">Your learning journey</p>
        <p className="text-xs text-fg-secondary mb-8">{stages[currentIndex]} — keep going</p>

        <div className="flex items-center">
          {stages.map((stage, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={stage} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-500 ${
                      isDone
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-fg-muted bg-background"
                    }`}
                    style={isCurrent ? { boxShadow: "0 0 0 6px rgba(var(--primary-rgb), 0.15), 0 0 20px rgba(var(--primary-rgb), 0.35)" } : undefined}
                  >
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" aria-hidden="true" />
                    )}
                    <span className="relative">{isDone ? "✓" : i + 1}</span>
                  </div>
                  <span
                    className={`text-xs text-center whitespace-nowrap ${
                      isCurrent ? "text-primary font-semibold" : "text-fg-muted"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div className="h-0.5 flex-1 mx-2 -mt-5 bg-border overflow-hidden rounded-full">
                    <div
                      className="h-full bg-primary transition-all duration-700 ease-out"
                      style={{ width: isDone ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
