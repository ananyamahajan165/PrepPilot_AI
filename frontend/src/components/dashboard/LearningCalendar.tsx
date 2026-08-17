import { useMemo, useState, useRef } from "react";
import { FadeIn } from "../ui/motion";

interface TimelinePoint {
  date: string;
  avgScore: number | null;
  activityCount: number;
}

interface HoverInfo {
  day: TimelinePoint;
  x: number;
  y: number;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CELL_SIZE = 11;
const CELL_GAP = 3;
const WEEK_PITCH = CELL_SIZE + CELL_GAP;
const DAY_LABEL_COL_WIDTH = 28;

/** Sentinel meaning "rolling last 365 days ending today", same as GitHub's default view. */
const ROLLING_YEAR = "rolling";

export default function LearningCalendar({ timeline }: { timeline: TimelinePoint[] }) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(ROLLING_YEAR);
  const gridWrapRef = useRef<HTMLDivElement>(null);

  const dataByDate = useMemo(() => {
    const map = new Map<string, TimelinePoint>();
    timeline.forEach((d) => map.set(d.date, d));
    return map;
  }, [timeline]);

  const currentYear = new Date().getFullYear();

  // Years available to pick, newest first. Always include the current year even
  // if there's no data for it yet, so the selector never looks empty.
  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear]);
    timeline.forEach((d) => years.add(Number(d.date.slice(0, 4))));
    return Array.from(years).sort((a, b) => b - a);
  }, [timeline, currentYear]);

  // The window of days actually rendered: either the trailing 365 days ending
  // today (rolling view), or the full Jan 1 – Dec 31 span of a picked year.
  const displayDays = useMemo(() => {
    if (selectedYear === ROLLING_YEAR) return timeline.slice(-365);

    const year = Number(selectedYear);
    const days: TimelinePoint[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      days.push(dataByDate.get(key) ?? { date: key, avgScore: null, activityCount: 0 });
    }
    return days;
  }, [selectedYear, timeline, dataByDate]);

  const { weeks, monthMarkers, maxActivity, totalActive } = useMemo(() => {
    if (displayDays.length === 0) return { weeks: [], monthMarkers: [], maxActivity: 1, totalActive: 0 };

    const first = new Date(displayDays[0].date + "T00:00:00");
    const leadingBlanks = first.getDay();
    const padded: (TimelinePoint | null)[] = [...Array(leadingBlanks).fill(null), ...displayDays];

    const weeks: (TimelinePoint | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

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

    const maxActivity = Math.max(...displayDays.map((d) => d.activityCount), 1);
    const totalActive = displayDays.filter((d) => d.activityCount > 0).length;

    return { weeks, monthMarkers, maxActivity, totalActive };
  }, [displayDays]);

  function levelOpacity(count: number) {
    if (count === 0) return 1;
    const intensity = Math.min(count / maxActivity, 1);
    return Math.max(intensity, 0.28);
  }

  function levelBackground(count: number) {
    return count === 0 ? "var(--border)" : "var(--primary)";
  }

  function handleEnter(day: TimelinePoint, weekIndex: number, dayIndex: number) {

    const x = DAY_LABEL_COL_WIDTH + weekIndex * WEEK_PITCH + CELL_SIZE / 2;
    const y = dayIndex * WEEK_PITCH;
    setHover({ day, x, y });
  }

  const periodLabel = selectedYear === ROLLING_YEAR ? "in the last year" : `in ${selectedYear}`;

  return (
    <FadeIn>
      <div className="card-premium w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Learning calendar</p>
            <p className="text-xs text-fg-secondary mt-1">
              {totalActive} active day{totalActive === 1 ? "" : "s"} {periodLabel}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
            <span>Less</span>
            {[0, 0.28, 0.5, 0.75, 1].map((v) => (
              <span
                key={v}
                className="rounded-[2px]"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: v === 0 ? "var(--border)" : "var(--primary)",
                  opacity: v === 0 ? 1 : v,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* mx-auto keeps this tight block centered instead of stretching the
            whole card width; nowrap keeps the year list glued to the grid
            instead of dropping onto its own oversized centered row. */}
        <div className="w-full overflow-x-auto">
          <div className="flex items-start justify-center gap-4 w-max mx-auto">
            <div ref={gridWrapRef} className="relative shrink-0 pb-1">
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

            {/* Year selector, GitHub-style: compact text list, current year
                defaults to the rolling 365-day window, past years show that
                full calendar year. Sits directly beside the grid — never wraps. */}
            <div className="flex flex-col gap-0.5 shrink-0 pt-0.5 -mt-1">
              {availableYears.map((year) => {
                const isCurrentYear = year === currentYear;
                const value = isCurrentYear ? ROLLING_YEAR : String(year);
                const isSelected = selectedYear === value;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(value)}
                    className={`rounded-md text-left transition-colors ${
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-fg-secondary hover:bg-border/40"
                    }`}
                    style={{ padding: "3px 10px", fontSize: 12, lineHeight: "18px" }}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
