import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { FadeIn } from "../ui/motion";
import api from "../../lib/api";

export type Difficulty = "easy" | "medium" | "hard";

export interface GeneratedTopic {
  topic: string;
  difficulty: Difficulty;
  category: string;
  recommendedMinutes: number;
  tips: string[];
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const DIFFICULTY_BADGE_CLASSES: Record<Difficulty, { dark: string; light: string }> = {
  easy: { dark: "bg-teal-400/10 text-teal-400", light: "bg-teal-100 text-teal-700" },
  medium: { dark: "bg-amber-400/10 text-amber-400", light: "bg-amber-100 text-amber-700" },
  hard: { dark: "bg-rose-400/10 text-rose-400", light: "bg-rose-100 text-rose-700" },
};

interface Props {
  activeTopic: GeneratedTopic | null;
  onTopicGenerated: (topic: GeneratedTopic) => void;
  onClearTopic: () => void;
  disabled?: boolean;
}

/** Difficulty selector + "Generate Another Topic" + the resulting topic
 * card with difficulty/category badges, recommended time, and quick tips.
 * Lives inline at the top of the Communication Coach page — no separate
 * page, matching the existing card-based design language. */
export default function TopicGenerator({ activeTopic, onTopicGenerated, onClearTopic, disabled }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { showToast } = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [seenTopics, setSeenTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateTopic(nextDifficulty: Difficulty) {
    setLoading(true);
    try {
      // Reset the "seen" exclusion list whenever the difficulty changes —
      // repeats only need to be avoided within the same difficulty pool.
      const excludeFor = nextDifficulty === difficulty ? seenTopics : [];
      const res = await api.get("/communication/topic", {
        params: {
          difficulty: nextDifficulty,
          exclude: excludeFor.join(","),
        },
      });
      const generated: GeneratedTopic = res.data;
      setDifficulty(nextDifficulty);
      setSeenTopics((prev) => (nextDifficulty === difficulty ? [...prev, generated.topic] : [generated.topic]));
      onTopicGenerated(generated);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Couldn't generate a topic. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div className={`rounded-2xl border p-5 space-y-4 ${isDark ? "bg-card border-border" : "bg-surface-secondary border-border"}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">AI Speaking Practice</p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-fg-secondary" : "text-fg-muted"}`}>
              Pick a difficulty, get a topic, and answer like it's the real thing.
            </p>
          </div>

          <div className={`inline-flex rounded-full p-1 border ${isDark ? "bg-surface-secondary border-border" : "bg-card border-border"}`}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                disabled={disabled || loading}
                onClick={() => generateTopic(d.value)}
                className={`text-xs font-medium rounded-full px-4 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  difficulty === d.value && activeTopic
                    ? "bg-primary text-primary-foreground"
                    : "text-fg-secondary hover:text-fg"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {activeTopic ? (
          <FadeIn>
            <div className={`rounded-xl border p-4 space-y-3 ${isDark ? "bg-surface-secondary border-border" : "bg-card border-border"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${
                  isDark ? DIFFICULTY_BADGE_CLASSES[activeTopic.difficulty].dark : DIFFICULTY_BADGE_CLASSES[activeTopic.difficulty].light
                }`}>
                  {activeTopic.difficulty}
                </span>
                <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 ${
                  isDark ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary-hover"
                }`}>
                  {activeTopic.category}
                </span>
                <span className={`text-[11px] font-medium ${isDark ? "text-fg-secondary" : "text-fg-muted"}`}>
                  ~{activeTopic.recommendedMinutes} min
                </span>
              </div>

              <p className="text-base font-medium text-fg">"{activeTopic.topic}"</p>

              {activeTopic.tips.length > 0 && (
                <ul className="space-y-1.5">
                  {activeTopic.tips.map((tip, i) => (
                    <li key={i} className={`text-xs flex gap-2 ${isDark ? "text-fg-secondary" : "text-fg-muted"}`}>
                      <span className={isDark ? "text-primary" : "text-amber-600"}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={disabled || loading}
                  onClick={() => generateTopic(difficulty)}
                  className={`text-xs font-semibold rounded-full px-4 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : "bg-primary text-primary-foreground hover:bg-primary-hover"
                  }`}
                >
                  {loading ? "Generating…" : "Generate Another Topic"}
                </button>
                <button
                  type="button"
                  disabled={disabled || loading}
                  onClick={onClearTopic}
                  className={`text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? "text-fg-secondary hover:text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  Clear topic, practice freely instead
                </button>
              </div>
            </div>
          </FadeIn>
        ) : (
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => generateTopic(difficulty)}
            className="w-full sm:w-auto text-sm font-semibold rounded-full px-6 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            {loading ? "Generating…" : "Generate a Topic"}
          </button>
        )}
      </div>
    </FadeIn>
  );
}
