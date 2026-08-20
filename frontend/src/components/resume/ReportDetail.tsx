import { FadeIn, staggerDelay } from "../ui/motion";
import ProgressRing from "../ui/ProgressRing";
import { ResumeReport } from "./types";
import { formatReportAsText } from "./formatReport";
import { downloadFile } from "../../lib/download";
import { scoreHex } from "../../lib/scoreColor";

function ListSection({ title, items, tone = "neutral", delay = 0 }: { title: string; items: string[]; tone?: "positive" | "negative" | "neutral"; delay?: number }) {
  if (items.length === 0) return null;
  const bullet = tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-rose-500" : "text-primary";
  const symbol = tone === "positive" ? "✓" : tone === "negative" ? "!" : "•";

  return (
    <FadeIn delay={delay}>
      <div className="bg-card rounded-xl shadow-sm p-5 h-full">
        <h4 className="text-sm font-semibold text-fg-muted uppercase tracking-wide mb-3">{title}</h4>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-fg-secondary">
              <span className={`shrink-0 ${bullet}`}>{symbol}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}

export default function ReportDetail({ report }: { report: ResumeReport }) {
  function handleDownload() {
    downloadFile(`preppilot-ai-resume-report-${report._id || "latest"}.txt`, formatReportAsText(report), "text/plain");
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-card rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <ProgressRing progress={report.atsScore / 100} size={88} color={scoreHex(report.atsScore)} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-fg">{report.atsScore}</span>
                <span className="text-[10px] text-fg-muted">/100</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs text-fg-muted uppercase tracking-wide">ATS Score</p>
              <h3 className="font-semibold text-fg mt-0.5">{report.fileName}</h3>
              {report.professionalSummary && (
                <p className="text-sm text-fg-secondary mt-2 leading-relaxed">{report.professionalSummary}</p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="shrink-0 text-sm font-medium text-primary-hover border border-primary/30 hover:bg-primary/10 transition-colors rounded-md px-4 py-2"
            >
              Download Report
            </button>
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-4">
        <ListSection title="Strengths" items={report.strengths} tone="positive" delay={staggerDelay(0)} />
        <ListSection title="Weaknesses" items={report.weaknesses} tone="negative" delay={staggerDelay(1)} />
        <ListSection title="Missing Keywords" items={report.missingKeywords} delay={staggerDelay(2)} />
        <ListSection title="Grammar Issues" items={report.grammarIssues} tone="negative" delay={staggerDelay(3)} />
        <ListSection title="Formatting Suggestions" items={report.formattingSuggestions} delay={staggerDelay(4)} />
        <ListSection title="Suggestions" items={report.suggestions} delay={staggerDelay(5)} />
      </div>
    </div>
  );
}
