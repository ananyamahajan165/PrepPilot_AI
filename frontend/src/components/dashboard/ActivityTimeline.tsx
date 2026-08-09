import { Link } from "react-router-dom";
import { FadeIn, staggerDelay } from "../ui/motion";
import { MicIcon, TargetIcon, LayersIcon } from "./icons";

interface ActivityItem {
  id: string;
  type: "interview" | "communication" | "resume";
  title: string;
  subtitle: string;
  score: number | null;
  createdAt: string;
}

const typeMeta = {
  interview: { label: "Interview", icon: TargetIcon, color: "text-primary bg-primary/10" },
  communication: { label: "Communication Practice", icon: MicIcon, color: "text-teal-400 bg-teal-400/10" },
  resume: { label: "Resume", icon: LayersIcon, color: "text-primary bg-primary/10" },
};

function relativeDay(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(today) - startOfDay(date)) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <div className="card-premium">
      <p className="text-sm font-semibold text-fg mb-6">Recent activity</p>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-fg-muted">Nothing here yet — your sessions will show up as a timeline.</p>
          <Link to="/communication-coach" className="text-sm text-primary hover:text-primary-hover mt-1.5 inline-block">
            Start your first session →
          </Link>
        </div>
      ) : (
        <ol className="relative">
          {items.map((item, i) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;
            const isLast = i === items.length - 1;
            return (
              <FadeIn key={item.id} delay={staggerDelay(i, 0.05)}>
                <li className="relative pl-11 pb-7 last:pb-0 group">
                  {!isLast && <span className="absolute left-4 top-9 bottom-0 w-px bg-border" aria-hidden="true" />}
                  <span
                    className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${meta.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex items-start justify-between gap-3 rounded-xl -mx-3 px-3 py-1.5 transition-colors duration-200 group-hover:bg-surface-secondary">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-fg-muted">
                        {relativeDay(item.createdAt)} &middot; {meta.label}
                      </p>
                      <p className="text-sm text-fg-secondary mt-1 truncate">{item.title}</p>
                    </div>
                    {item.score !== null && (
                      <span className="shrink-0 text-base font-semibold text-fg">{item.score}</span>
                    )}
                  </div>
                </li>
              </FadeIn>
            );
          })}
        </ol>
      )}
    </div>
  );
}
