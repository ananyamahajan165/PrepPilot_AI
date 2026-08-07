import { FadeIn, staggerDelay } from "../ui/motion";
import ProgressRing from "../ui/ProgressRing";
import { FlameIcon } from "./icons";

interface Goal {
  target: number;
  completed: number;
}

/** Section 4 — three equal cards: Today's Goal, Weekly Goal, Learning
 * Streak. Split from a single merged card into three so each can carry its
 * own reward badge, matching the requested layout. */
export default function DailyMission({
  dailyGoal,
  weeklyGoal,
  streak,
}: {
  dailyGoal: Goal;
  weeklyGoal: Goal;
  streak: { current: number; longest: number };
}) {
  const safeStreak = streak || { current: 0, longest: 0 };
  const dailyProgress = dailyGoal.target > 0 ? dailyGoal.completed / dailyGoal.target : 0;
  const weeklyProgress = weeklyGoal.target > 0 ? weeklyGoal.completed / weeklyGoal.target : 0;
  const dailyDone = dailyGoal.completed >= dailyGoal.target;
  const weeklyDone = weeklyGoal.completed >= weeklyGoal.target;

  const cards = [
    {
      key: "daily",
      title: "Today's Goal",
      ring: <ProgressRing progress={dailyProgress} size={64} color="var(--primary)" trackColor="var(--border)" />,
      center: `${dailyGoal.completed}/${dailyGoal.target}`,
      remaining: dailyDone
        ? "Complete — nice work"
        : `${dailyGoal.target - dailyGoal.completed} session${dailyGoal.target - dailyGoal.completed === 1 ? "" : "s"} to go`,
      badge: dailyDone ? "🎯 +10 XP earned" : null,
    },
    {
      key: "weekly",
      title: "Weekly Goal",
      ring: <ProgressRing progress={weeklyProgress} size={64} color="#5EEAD4" trackColor="var(--border)" />,
      center: `${weeklyGoal.completed}/${weeklyGoal.target}`,
      remaining: weeklyDone
        ? "Complete — nice work"
        : `${weeklyGoal.target - weeklyGoal.completed} session${weeklyGoal.target - weeklyGoal.completed === 1 ? "" : "s"} to go`,
      badge: weeklyDone ? "⭐ +50 XP earned" : null,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <FadeIn key={card.key} delay={staggerDelay(i)}>
          <div className="card-premium h-full flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-secondary">{card.title}</p>
            <div className="relative mt-3">
              {card.ring}
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-fg">
                {card.center}
              </div>
            </div>
            <p className="text-xs text-fg-secondary mt-3">{card.remaining}</p>
            {card.badge && (
              <span className="mt-2 text-[11px] font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                {card.badge}
              </span>
            )}
          </div>
        </FadeIn>
      ))}

      <FadeIn delay={staggerDelay(2)}>
        <div className="card-premium h-full flex flex-col items-center text-center justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-secondary">Learning Streak</p>
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mt-3">
            <FlameIcon className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-sm font-medium text-fg mt-3">
            {safeStreak.current} day{safeStreak.current === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-fg-secondary mt-1">
            {safeStreak.longest > safeStreak.current ? `Best: ${safeStreak.longest} days` : "Keep it going"}
          </p>
          {safeStreak.current >= 3 && (
            <span className="mt-2 text-[11px] font-semibold text-amber-400 bg-amber-400/10 rounded-full px-3 py-1">
              🔥 On fire
            </span>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
