import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FadeIn } from "../ui/motion";
import ScoreCard from "./ScoreCard";
import ImprovementGraph from "./ImprovementGraph";

interface SessionResult {
  scores: {
    confidence: number;
    communication: number;
    professionalism: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
  };
  overallScore: number;
  fillerWordCount: number;
  fillerWordsFound: string[];
  positiveFeedback: string[];
  areasOfImprovement: string[];
  detailedExplanation: string;
  suggestedResponse: string;
  interviewTips: string[];
  practiceExercise: string;
  dailyChallenge: string;
  motivationalMessage: string;
  vocabularySuggestions?: string[];
  grammarCorrections?: string[];
  actionPlan?: string[];
  topic?: string;
  difficulty?: string;
  category?: string;
}

function FeedbackCard({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="rounded-2xl p-5 border bg-card border-border">
        <p className="text-sm font-semibold mb-3 text-fg">{title}</p>
        {children}
      </div>
    </FadeIn>
  );
}

export default function ResultsPanel({
  session,
  history = [],
}: {
  session: SessionResult;
  history?: { overallScore: number; createdAt: string }[];
}) {
  const { theme } = useTheme();
  const scoreEntries: { label: string; value: number }[] = [
    { label: "Confidence", value: session.scores.confidence },
    { label: "Communication", value: session.scores.communication },
    { label: "Professionalism", value: session.scores.professionalism },
    { label: "Grammar", value: session.scores.grammar },
    { label: "Vocabulary", value: session.scores.vocabulary },
    { label: "Fluency", value: session.scores.fluency },
  ];

  return (
    <div className="space-y-6">
      {session.topic && (
        <FadeIn>
          <div className={`text-center text-xs font-medium ${theme === "dark" ? "text-fg-secondary" : "text-fg-muted"}`}>
            Answered:{" "}
            <span className="text-fg font-semibold">"{session.topic}"</span>
            {session.category ? ` · ${session.category}` : ""}
            {session.difficulty ? ` · ${session.difficulty}` : ""}
          </div>
        </FadeIn>
      )}

      <FadeIn>
        <div className="text-center">
          <p className={`text-xs uppercase tracking-wide ${
            theme === "dark" ? "text-fg-secondary" : "text-fg-muted"
          }`}>Overall score</p>
          <p className={"font-display text-5xl font-medium mt-1 text-primary"}>{session.overallScore}</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {scoreEntries.map((s, i) => (
          <ScoreCard key={s.label} label={s.label} value={s.value} index={i} />
        ))}
      </div>

      <ImprovementGraph points={history} />

      {session.fillerWordCount > 0 && (
        <FeedbackCard title="Filler words detected">
          <p className={"text-sm text-fg-secondary"}>
            {session.fillerWordCount} filler word{session.fillerWordCount === 1 ? "" : "s"} found:{" "}
            {session.fillerWordsFound.map((w) => (
              <span key={w} className={`inline-block text-xs font-medium rounded-full px-2.5 py-0.5 mr-1.5 mb-1 ${
                theme === "dark"
                  ? "bg-amber-400/10 text-amber-400"
                  : "bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400"
              }`}>
                {w}
              </span>
            ))}
          </p>
        </FeedbackCard>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FeedbackCard title="What you did well">
          <ul className="space-y-2">
            {session.positiveFeedback.map((item, i) => (
              <li key={i} className={"text-sm flex gap-2 text-fg-secondary"}>
                <span className={theme === "dark" ? "text-teal-400" : "text-teal-600"}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </FeedbackCard>

        <FeedbackCard title="Areas to improve" delay={0.05}>
          <ul className="space-y-2">
            {session.areasOfImprovement.map((item, i) => (
              <li key={i} className={"text-sm flex gap-2 text-fg-secondary"}>
                <span className={theme === "dark" ? "text-primary" : "text-amber-600"}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </FeedbackCard>
      </div>

      <FeedbackCard title="Coach's notes">
        <p className={"text-sm leading-relaxed text-fg-secondary"}>{session.detailedExplanation}</p>
      </FeedbackCard>

      <FeedbackCard title="A more confident version">
        <p className={"text-sm leading-relaxed italic text-fg"}>"{session.suggestedResponse}"</p>
      </FeedbackCard>

      <div className="grid md:grid-cols-2 gap-4">
        <FeedbackCard title="Interview tips">
          <ul className="space-y-2">
            {session.interviewTips.map((tip, i) => (
              <li key={i} className={"text-sm flex gap-2 text-fg-secondary"}>
                <span className={theme === "dark" ? "text-primary" : "text-amber-600"}>•</span>
                {tip}
              </li>
            ))}
          </ul>
        </FeedbackCard>

        <FeedbackCard title="Practice exercise" delay={0.05}>
          <p className={"text-sm leading-relaxed text-fg-secondary"}>{session.practiceExercise}</p>
        </FeedbackCard>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FeedbackCard title="Today's challenge">
          <p className={"text-sm leading-relaxed text-fg-secondary"}>{session.dailyChallenge}</p>
        </FeedbackCard>

        <FeedbackCard title="From your coach" delay={0.05}>
          <p className={`text-sm leading-relaxed italic ${
            theme === "dark" ? "text-teal-300" : "text-teal-700"
          }`}>{session.motivationalMessage}</p>
        </FeedbackCard>
      </div>

      {((session.vocabularySuggestions?.length ?? 0) > 0 || (session.grammarCorrections?.length ?? 0) > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {(session.vocabularySuggestions?.length ?? 0) > 0 && (
            <FeedbackCard title="Vocabulary suggestions">
              <ul className="space-y-2">
                {session.vocabularySuggestions!.map((item, i) => (
                  <li key={i} className={"text-sm flex gap-2 text-fg-secondary"}>
                    <span className={theme === "dark" ? "text-primary" : "text-amber-600"}>↑</span>
                    {item}
                  </li>
                ))}
              </ul>
            </FeedbackCard>
          )}

          {(session.grammarCorrections?.length ?? 0) > 0 && (
            <FeedbackCard title="Grammar corrections" delay={0.05}>
              <ul className="space-y-2">
                {session.grammarCorrections!.map((item, i) => (
                  <li key={i} className={"text-sm flex gap-2 text-fg-secondary"}>
                    <span className={theme === "dark" ? "text-rose-400" : "text-rose-600"}>✎</span>
                    {item}
                  </li>
                ))}
              </ul>
            </FeedbackCard>
          )}
        </div>
      )}

      {(session.actionPlan?.length ?? 0) > 0 && (
        <FeedbackCard title="Your action plan">
          <ol className="space-y-2">
            {session.actionPlan!.map((item, i) => (
              <li key={i} className={"text-sm flex gap-3 text-fg-secondary"}>
                <span className={`shrink-0 font-semibold ${theme === "dark" ? "text-primary" : "text-amber-600"}`}>{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </FeedbackCard>
      )}
    </div>
  );
}
