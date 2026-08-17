import { FadeIn, staggerDelay, StatCounter } from "../ui/motion";
import { TargetIcon, MicIcon, LayersIcon, ClockIcon, TrophyIcon } from "./icons";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: (props: { className?: string }) => JSX.Element;
}

function formatMinutes(totalSeconds: number) {
  return Math.round(totalSeconds / 60);
}

export default function FooterStats({
  totalInterviews,
  totalCommunicationSessions,
  totalResumeReports,
  speakingTimeSeconds,
  totalWordsSpoken,
  averageAtsScore,
}: {
  totalInterviews: number;
  totalCommunicationSessions: number;
  totalResumeReports: number;
  speakingTimeSeconds: number;
  totalWordsSpoken: number;
  averageAtsScore: number;
}) {
  const stats: Stat[] = [
    { label: "Interviews", value: totalInterviews, icon: TargetIcon },
    { label: "Sessions", value: totalCommunicationSessions, icon: MicIcon },
    { label: "Resumes", value: totalResumeReports, icon: LayersIcon },
    { label: "Hours", value: Math.round((formatMinutes(speakingTimeSeconds) / 60) * 10) / 10, icon: ClockIcon },
    { label: "Words", value: totalWordsSpoken, icon: MicIcon },
    { label: "Avg ATS", value: averageAtsScore, suffix: "%", icon: TrophyIcon },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface-secondary px-8 py-7">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={staggerDelay(i)}>
            <div
              className={`flex flex-col items-center text-center px-4 py-2 ${
                i > 0 ? "lg:border-l lg:border-border" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 text-fg-muted mb-1.5">
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-xl font-semibold text-fg">
                <StatCounter value={stat.value} suffix={stat.suffix} immediate />
              </p>
              <p className="text-[11px] text-fg-muted mt-0.5">{stat.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
