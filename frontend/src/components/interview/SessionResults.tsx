import { useState } from "react";
import ScoreBar from "./ScoreBar";

interface SessionRecord {
  _id: string;
  question: string;
  answer: string;
  grammarScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  professionalismScore: number;
  overallScore: number;
  suggestions: string[];
}

interface Summary {
  questionCount: number;
  averageOverallScore: number;
  averageGrammarScore: number;
  averageCommunicationScore: number;
  averageTechnicalScore: number;
  averageConfidenceScore: number;
  averageProfessionalismScore: number;
}

export default function SessionResults({
  sessions,
  summary,
  onRestart,
}: {
  sessions: SessionRecord[];
  summary: Summary;
  onRestart: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(sessions[0]?._id ?? null);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-sm p-6 text-center">
        <p className="text-sm text-fg-muted">
          Session complete — {summary.questionCount} question{summary.questionCount === 1 ? "" : "s"} answered
        </p>
        <p className="text-5xl font-bold text-primary-hover mt-2">{summary.averageOverallScore}</p>
        <p className="text-xs text-fg-muted mt-1">average overall score</p>

        <div className="grid sm:grid-cols-5 gap-4 mt-6 text-left">
          <ScoreBar label="Grammar" value={summary.averageGrammarScore} />
          <ScoreBar label="Communication" value={summary.averageCommunicationScore} />
          <ScoreBar label="Technical" value={summary.averageTechnicalScore} />
          <ScoreBar label="Confidence" value={summary.averageConfidenceScore} />
          <ScoreBar label="Professionalism" value={summary.averageProfessionalismScore} />
        </div>

        <button
          onClick={onRestart}
          className="mt-6 bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors"
        >
          Start Another Session
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-fg">Question breakdown</p>
        {sessions.map((s, i) => {
          const isExpanded = expandedId === s._id;
          return (
            <div key={s._id} className="bg-card rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : s._id)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-xs text-fg-muted">Question {i + 1}</p>
                  <p className="text-sm font-medium text-fg mt-0.5 truncate">{s.question}</p>
                </div>
                <span className="shrink-0 font-bold text-primary-hover">{s.overallScore}</span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">Your answer</p>
                    <p className="text-sm text-fg-secondary">{s.answer}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <ScoreBar label="Grammar" value={s.grammarScore} />
                    <ScoreBar label="Communication" value={s.communicationScore} />
                    <ScoreBar label="Technical" value={s.technicalScore} />
                    <ScoreBar label="Confidence" value={s.confidenceScore} />
                    <ScoreBar label="Professionalism" value={s.professionalismScore} />
                  </div>
                  {s.suggestions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">Suggestions</p>
                      <ul className="list-disc list-inside text-sm text-fg-secondary space-y-1">
                        {s.suggestions.map((sug, idx) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
