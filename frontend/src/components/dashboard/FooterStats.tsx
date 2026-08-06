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

/** Section 10 — Footer Stats. Every number here comes straight from the
 * dashboard payload; nothing derived or estimated. */
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
    { label: "Total Interviews", value: totalInterviews, icon: TargetIcon },
    { label: "Communication Sessions", value: totalCommunicationSessions, icon: MicIcon },
    { label: "Resume Reports", value: totalResumeReports, icon: LayersIcon },
    { label: "Hours Practiced", value: Math.round((formatMinutes(speakingTimeSeconds) / 60) * 10) / 10, icon: ClockIcon },
    { label: "Words Spoken", value: totalWordsSpoken, icon: MicIcon },
    { label: "Average ATS", value: averageAtsScore, suffix: "%", icon: TrophyIcon },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface-secondary p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={staggerDelay(i)}>
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center mx-auto mb-2 text-fg-secondary">
                <stat.icon className="w-4 h-4" />
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
