import { FadeIn } from "../ui/motion";

interface SkillScores {
  grammar: number;
  confidence: number;
  vocabulary: number;
  communication: number;
  professionalism: number;
  fluency: number;
}

interface Axis {
  key: keyof SkillScores | "technical" | "eyeContact" | "leadership";
  label: string;
  tracked: boolean; // false = no real data source yet; rendered as "coming soon"
}

const AXES: Axis[] = [
  { key: "grammar", label: "Grammar", tracked: true },
  { key: "confidence", label: "Confidence", tracked: true },
  { key: "vocabulary", label: "Vocabulary", tracked: true },
  { key: "communication", label: "Communication", tracked: true },
  { key: "professionalism", label: "Professionalism", tracked: true },
  { key: "technical", label: "Technical", tracked: true },
  { key: "fluency", label: "Fluency", tracked: true },
  { key: "eyeContact", label: "Eye Contact", tracked: false },
  { key: "leadership", label: "Leadership", tracked: false },
];

const SIZE = 300;
const CENTER = SIZE / 2;
const MAX_RADIUS = 105;
const RINGS = [0.25, 0.5, 0.75, 1];
const COMING_SOON_RADIUS_FRACTION = 0.12; // small dot near center, not a real score

function pointOnAxis(index: number, total: number, radiusFraction: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * MAX_RADIUS * radiusFraction,
    y: CENTER + Math.sin(angle) * MAX_RADIUS * radiusFraction,
  };
}

/** Section 5 (left) — hand-rolled SVG spider chart, no charting library
 * needed for a fixed-axis shape. Seven axes plot real scores from the
 * Communication Coach and Interview Practice; "Eye Contact" and
 * "Leadership" have no tracked data source yet, so rather than invent
 * numbers for them, they're shown as small "coming soon" markers —
 * present in the shape (matching the requested layout) without faking data. */
export default function SkillRadarChart({
  scores,
  technicalScore,
}: {
  scores: SkillScores;
  technicalScore: number;
}) {
  const values: Record<string, number> = { ...scores, technical: technicalScore };
  const hasData = Object.values(scores).some((v) => v > 0) || technicalScore > 0;

  const trackedAxes = AXES.filter((a) => a.tracked);
  const dataPoints = trackedAxes.map((axis) => {
    const fullIndex = AXES.findIndex((a) => a.key === axis.key);
    return pointOnAxis(fullIndex, AXES.length, Math.max(values[axis.key] ?? 0, 0) / 100);
  });
  const dataPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <FadeIn>
      <div className="card-premium p-6 h-full">
        <p className="text-sm font-semibold text-fg mb-1">Skill Radar</p>
        <p className="text-xs text-fg-secondary mb-4">Your profile across every dimension we coach</p>

        {!hasData ? (
          <div className="py-12 text-center">
            <p className="text-sm text-fg-muted">Complete a session to see your skill breakdown.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[300px]">
              {RINGS.map((r) => (
                <polygon
                  key={r}
                  points={AXES.map((_, i) => {
                    const p = pointOnAxis(i, AXES.length, r);
                    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                  }).join(" ")}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              ))}

              {AXES.map((axis, i) => {
                const p = pointOnAxis(i, AXES.length, 1);
                return (
                  <line
                    key={axis.key}
                    x1={CENTER}
                    y1={CENTER}
                    x2={p.x}
                    y2={p.y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray={axis.tracked ? undefined : "2 2"}
                  />
                );
              })}

              <polygon points={dataPath} fill="var(--primary)" fillOpacity="0.18" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
              {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="var(--primary)" />
              ))}

              {/* "Coming soon" axes — small muted dot, not part of the data shape */}
              {AXES.filter((a) => !a.tracked).map((axis) => {
                const fullIndex = AXES.findIndex((a) => a.key === axis.key);
                const p = pointOnAxis(fullIndex, AXES.length, COMING_SOON_RADIUS_FRACTION);
                return <circle key={axis.key} cx={p.x} cy={p.y} r={2.5} fill="var(--text-muted)" opacity="0.5" />;
              })}

              {AXES.map((axis, i) => {
                const p = pointOnAxis(i, AXES.length, 1.24);
                return (
                  <text
                    key={axis.key}
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9.5"
                    fill={axis.tracked ? "var(--text-secondary)" : "var(--text-muted)"}
                  >
                    {axis.label}
                  </text>
                );
              })}
            </svg>

            <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-4 w-full">
              {AXES.map((axis) => (
                <div key={axis.key} className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted">{axis.label}</span>
                  <span className={axis.tracked ? "font-semibold text-fg" : "text-fg-muted italic"}>
                    {axis.tracked ? values[axis.key] ?? 0 : "Soon"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
