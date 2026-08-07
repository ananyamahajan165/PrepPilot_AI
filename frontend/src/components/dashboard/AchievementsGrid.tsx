import { FadeIn, staggerDelay } from "../ui/motion";
import { achievementIcons, LockIcon } from "./icons";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
}

export default function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-fg mb-3">Achievements</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {achievements.map((a, i) => {
          const Icon = achievementIcons[a.icon] || achievementIcons.sparkles;
          return (
            <FadeIn key={a.id} delay={staggerDelay(i)}>
              <div
                className={`relative h-full rounded-xl border p-6 overflow-hidden transition-all ${
                  a.earned ? "border-primary/40 bg-primary/[0.06]" : "border-border bg-card"
                }`}
              >
                {!a.earned && a.progress > 0 && (
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-border"
                    style={{ width: `${a.progress * 100}%` }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                    a.earned ? "bg-primary/15 text-primary" : "bg-surface-secondary text-fg-muted"
                  }`}
                >
                  {a.earned ? <Icon className="w-5 h-5" /> : <LockIcon />}
                </div>
                <p className={`text-sm font-medium ${a.earned ? "text-fg" : "text-fg-secondary"}`}>{a.title}</p>
                <p className="text-xs text-fg-muted mt-0.5">{a.description}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
