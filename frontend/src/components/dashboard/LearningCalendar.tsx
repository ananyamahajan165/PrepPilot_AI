import { useMemo, useState } from "react";
import { FadeIn } from "../ui/motion";

interface TimelinePoint {
  date: string;
  avgScore: number | null;
  activityCount: number;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Section 10 — GitHub-style contribution heatmap. Groups the year-long
 * `timeline` (see dashboardController's TIMELINE_DAYS) into weeks/columns,
 * Sunday-first, matching the familiar contribution-graph layout. */
export default function LearningCalendar({ timeline }: { timeline: TimelinePoint[] }) {
  const [hovered, setHovered] = useState<TimelinePoint | null>(null);

  const { weeks, monthMarkers, maxActivity, totalActive } = useMemo(() => {
    if (timeline.length === 0) return { weeks: [], monthMarkers: [], maxActivity: 1, totalActive: 0 };

    // Pad the front so the grid starts on a Sunday, matching GitHub's layout.
    const first = new Date(timeline[0].date + "T00:00:00");
    const leadingBlanks = first.getDay(); // 0 = Sunday
    const padded: (TimelinePoint | null)[] = [...Array(leadingBlanks).fill(null), ...timeline];

    const weeks: (TimelinePoint | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    // Track which week index each new month starts in, for the labels row.
    const monthMarkers: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstRealDay = week.find((d) => d !== null);
      if (!firstRealDay) return;
      const month = new Date(firstRealDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        monthMarkers.push({ weekIndex: wi, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });

    const maxActivity = Math.max(...timeline.map((d) => d.activityCount), 1);
    const totalActive = timeline.filter((d) => d.activityCount > 0).length;

    return { weeks, monthMarkers, maxActivity, totalActive };
  }, [timeline]);

  function levelOpacity(count: number) {
    if (count === 0) return 1; // full opacity on the neutral --border color itself
    const intensity = Math.min(count / maxActivity, 1);
    return Math.max(intensity, 0.28);
  }

  function levelBackground(count: number) {
    return count === 0 ? "var(--border)" : "var(--primary)";
  }

  return (
    <FadeIn>
      <div className="card-premium">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold text-fg">Learning calendar</p>
            <p className="text-xs text-fg-secondary mt-0.5">{totalActive} active days in the last year</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-fg-muted">
            <span>Less</span>
            {[0, 0.28, 0.5, 0.75, 1].map((v) => (
              <span
                key={v}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: v === 0 ? "var(--border)" : "var(--primary)", opacity: v === 0 ? 1 : v }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="inline-flex flex-col gap-1 min-w-full">
            <div className="flex gap-1 pl-6 relative h-3">
              {monthMarkers.map((m) => (
                <span
                  key={`${m.label}-${m.weekIndex}`}
                  className="absolute text-[10px] text-fg-muted"
                  style={{ left: `${m.weekIndex * 14}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 pr-1 pt-0.5">
                {DAY_LABELS.map((d, i) => (
                  <span key={i} className="text-[9px] text-fg-muted h-2.5 leading-[10px]">
                    {d}
                  </span>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) =>
                    day ? (
                      <div
                        key={di}
                        className="w-2.5 h-2.5 rounded-sm cursor-pointer transition-transform hover:scale-125"
                        style={{ backgroundColor: levelBackground(day.activityCount), opacity: levelOpacity(day.activityCount) }}
                        onMouseEnter={() => setHovered(day)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    ) : (
                      <div key={di} className="w-2.5 h-2.5" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-fg-secondary mt-3 h-4">
          {hovered
            ? `${hovered.activityCount} session${hovered.activityCount === 1 ? "" : "s"} on ${new Date(
                hovered.date + "T00:00:00"
              ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
            : "Hover a square to see that day's activity"}
        </p>
      </div>
    </FadeIn>
  );
}
