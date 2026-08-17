import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ReportDetail from "../components/resume/ReportDetail";
import { ResumeReport } from "../components/resume/types";
import { FadeIn } from "../components/ui/motion";
import { scorePillClass } from "../lib/scoreColor";
import { useToast } from "../context/ToastContext";
import api from "../lib/api";

interface ReportSummary {
  _id: string;
  fileName: string;
  atsScore: number;
  createdAt: string;
}

export default function ResumeHistory() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedReport, setExpandedReport] = useState<ResumeReport | null>(null);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get("/resume/history")
      .then((res) => setReports(res.data.reports))
      .catch(() => {
        setLoadError(true);
        showToast("Couldn't load your resume history.", "error");
      })
      .finally(() => setLoading(false));

  }, []);

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedReport(null);
      return;
    }
    setExpandedId(id);
    setExpandedReport(null);
    setExpandedLoading(true);
    try {
      const res = await api.get(`/resume/history/${id}`);
      setExpandedReport(res.data.report);
    } catch {
      showToast("Couldn't load that report. Please try again.", "error");
      setExpandedId(null);
    } finally {
      setExpandedLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-2xl font-bold text-fg">Resume Report History</h1>
        <Link
          to="/resume"
          className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-md px-4 py-2"
        >
          Analyze New Resume
        </Link>
      </div>
      <p className="text-fg-muted mb-6">Every resume you've analyzed, with the full report available on demand.</p>

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading resume history">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-card shadow-sm animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <FadeIn>
          <div className="text-center py-16 bg-card rounded-xl shadow-sm">
            <p className="text-fg-muted text-sm">Something went wrong loading your history. Please try refreshing.</p>
          </div>
        </FadeIn>
      ) : reports.length === 0 ? (
        <FadeIn>
          <div className="text-center py-16 bg-card rounded-xl shadow-sm">
            <p className="text-fg-muted text-sm">No resumes analyzed yet.</p>
            <Link to="/resume" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">
              Analyze your first resume →
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const isExpanded = expandedId === r._id;
            return (
              <FadeIn key={r._id}>
                <div className="bg-card rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleExpand(r._id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-fg truncate">{r.fileName}</p>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold px-3 py-1 rounded-full ${scorePillClass(r.atsScore)}`}>
                      {r.atsScore}/100
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      {expandedLoading ? (
                        <div className="h-32 rounded-lg bg-surface-secondary animate-pulse" />
                      ) : (
                        expandedReport && <ReportDetail report={expandedReport} />
                      )}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
