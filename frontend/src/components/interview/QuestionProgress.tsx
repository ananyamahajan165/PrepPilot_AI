interface QuestionProgressProps {
  total: number;
  currentIndex: number;
  answeredIndices: Set<number>;
  onNavigate: (index: number) => void;
}

/** Clickable question dots — lets the user jump directly to any question,
 * and shows at a glance which ones still need an answer before finishing. */
export default function QuestionProgress({ total, currentIndex, answeredIndices, onNavigate }: QuestionProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-fg-muted">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="text-xs text-fg-muted">{answeredIndices.size}/{total} answered</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const isCurrent = i === currentIndex;
          const isAnswered = answeredIndices.has(i);
          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              aria-label={`Go to question ${i + 1}`}
              aria-current={isCurrent}
              className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center border-2 transition-colors ${
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : isAnswered
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border bg-card text-fg-muted hover:border-border"
              }`}
            >
              {isAnswered && !isCurrent ? "✓" : i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
