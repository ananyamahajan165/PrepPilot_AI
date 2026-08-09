import { useMemo, useState, useRef } from "react";
import { FadeIn } from "../ui/motion";

interface TimelinePoint {
  date: string;
  avgScore: number | null;
  activityCount: number;
}

interface HoverInfo {
  day: TimelinePoint;
  x: number; // px, relative to the grid's own positioning container
  y: number;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Cell sizing lives here as real constants (not hardcoded pixel guesses
// scattered through JSX) so month-label positions are always computed from
// the same numbers the cells actually use — the previous version hardcoded
// `weekIndex * 14` separately from a 10px cell, which silently drifted out
// of sync the moment cell size changed.
const CELL_SIZE = 14; // px — up from 10px so cells read clearly at full width
const CELL_GAP = 4; // px
const WEEK_PITCH = CELL_SIZE + CELL_GAP;
const DAY_LABEL_COL_WIDTH = 28; // px, reserved for Mon/Wed/Fri labels

/** Learning Calendar — full-width GitHub-style contribution heatmap. This
 * needs real horizontal room (53 weeks × ~18px ≈ 950px+) to stay readable,
 * so it's rendered as its own full-width row in Dashboard.tsx rather than
 * squeezed into a side column next to Performance Overview — cramming a
 * full year into a ~30% column is what made cells illegibly tiny before. */
export default function LearningCalendar({ timeline }: { timeline: TimelinePoint[] }) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);

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

  function handleEnter(day: TimelinePoint, weekIndex: number, dayIndex: number) {
    // Position the tooltip directly above the hovered cell, in coordinates
    // relative to the grid wrapper (not the viewport) — keeps it correctly
    // placed regardless of page scroll, and clamped so it can't render
    // outside the card on the first/last columns.
    const x = DAY_LABEL_COL_WIDTH + weekIndex * WEEK_PITCH + CELL_SIZE / 2;
    const y = dayIndex * WEEK_PITCH;
    setHover({ day, x, y });
  }

  return (
    <FadeIn>
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Learning calendar</p>
            <p className="text-xs text-fg-secondary mt-1">{totalActive} active days in the last year</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-fg-muted">
            <span>Less</span>
            {[0, 0.28, 0.5, 0.75, 1].map((v) => (
              <span
                key={v}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: v === 0 ? "var(--border)" : "var(--primary)", opacity: v === 0 ? 1 : v }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div ref={gridWrapRef} className="relative inline-block min-w-full pb-1">
            {/* Month labels — positions computed from the same WEEK_PITCH the
                cells use, so they can never drift out of alignment. */}
            <div className="relative h-4" style={{ marginLeft: DAY_LABEL_COL_WIDTH }}>
              {monthMarkers.map((m) => (
                <span
                  key={`${m.label}-${m.weekIndex}`}
                  className="absolute text-xs text-fg-muted"
                  style={{ left: `${m.weekIndex * WEEK_PITCH}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex mt-2" style={{ gap: CELL_GAP }}>
              <div className="flex flex-col shrink-0" style={{ gap: CELL_GAP, width: DAY_LABEL_COL_WIDTH }}>
                {DAY_LABELS.map((d, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-fg-muted leading-none flex items-center"
                    style={{ height: CELL_SIZE }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: CELL_GAP }}>
                  {week.map((day, di) =>
                    day ? (
                      <div
                        key={di}
                        className="rounded-[3px] cursor-pointer transition-transform duration-150 hover:scale-125"
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          backgroundColor: levelBackground(day.activityCount),
                          opacity: levelOpacity(day.activityCount),
                        }}
                        onMouseEnter={() => handleEnter(day, wi, di)}
                        onMouseLeave={() => setHover(null)}
                      />
                    ) : (
                      <div key={di} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Floating tooltip — positioned relative to the grid wrapper
                above, clamped horizontally so it can't render outside the
                card on the far-left/right edges of the grid. */}
            {hover && (
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-full -mt-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-fg shadow-lg pointer-events-none whitespace-nowrap"
                style={{
                  left: `clamp(60px, ${hover.x}px, calc(100% - 60px))`,
                  top: hover.y,
                }}
              >
                <p className="font-medium">
                  {new Date(hover.day.date + "T00:00:00").toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-fg-secondary mt-0.5">
                  {hover.day.activityCount} session{hover.day.activityCount === 1 ? "" : "s"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
