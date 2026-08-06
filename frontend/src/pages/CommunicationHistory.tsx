import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { FadeIn } from "../components/ui/motion";
import { useToast } from "../context/ToastContext";
import { downloadFile } from "../lib/download";
import api from "../lib/api";

interface Session {
  _id: string;
  inputMethod: "text" | "voice";
  transcript: string;
  overallScore: number;
  scores: Record<string, number>;
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
  createdAt: string;
}

export default function CommunicationHistory() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "text" | "voice">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 10 };
    if (search.trim()) params.search = search.trim();
    if (type) params.type = type;

    api
      .get("/communication/history", { params })
      .then((res) => {
        setSessions(res.data.sessions);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(() => showToast("Couldn't load your history.", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, page]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this session permanently? This can't be undone.")) return;
    try {
      await api.delete(`/communication/history/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      showToast("Session deleted.", "success");
    } catch {
      showToast("Couldn't delete that session.", "error");
    }
  }

  function handleExportFeedback(session: Session) {
    downloadFile(
      `verbaai-feedback-${session._id}.json`,
      JSON.stringify(session, null, 2),
      "application/json"
    );
  }

  function handleDownloadTranscript(session: Session) {
    downloadFile(`verbaai-transcript-${session._id}.txt`, session.transcript, "text/plain");
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className={"font-display text-2xl font-medium text-fg"}>Session History</h1>
            <p className={"text-sm mt-1 text-fg-secondary"}>Every Communication Coach session, searchable and exportable.</p>
          </div>
          <Link
            to="/communication-coach"
            className={"text-sm font-semibold rounded-full px-4 py-2 transition-colors text-primary-foreground bg-primary hover:bg-primary-hover"}
          >
            New Session
          </Link>
        </div>

        <FadeIn>
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search transcripts…"
              aria-label="Search transcripts"
              className={`flex-1 min-w-[200px] rounded-lg px-4 py-2.5 text-sm focus:outline-none border ${
                theme === "dark"
                  ? "bg-card border-border text-fg placeholder:text-fg-muted focus:border-primary/60"
                  : "bg-card border-border text-fg placeholder:text-fg-muted focus:border-primary"
              }`}
            />
            <select
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value as "" | "text" | "voice");
              }}
              aria-label="Filter by input type"
              className={`rounded-lg px-4 py-2.5 text-sm focus:outline-none border ${
                theme === "dark"
                  ? "bg-card border-border text-fg focus:border-primary/60"
                  : "bg-card border-border text-fg focus:border-primary"
              }`}
            >
              <option value="">All types</option>
              <option value="text">Text only</option>
              <option value="voice">Voice only</option>
            </select>
          </div>
        </FadeIn>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-20 rounded-xl border animate-pulse ${
                theme === "dark"
                  ? "bg-card border-border"
                  : "bg-surface-secondary border-border"
              }`} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <FadeIn>
            <div className={`text-center py-16 rounded-xl border ${
              theme === "dark"
                ? "border-border bg-card"
                : "border-border bg-surface-secondary"
            }`}>
              <p className={`text-sm ${
                theme === "dark" ? "text-fg-secondary" : "text-fg-muted"
              }`}>No sessions match your filters yet.</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => {
              const isExpanded = expandedId === session._id;
              return (
                <FadeIn key={session._id} delay={i * 0.03}>
                  <div className={"rounded-xl border overflow-hidden border-border bg-card"}>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : session._id)}
                      className={"w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-surface-secondary"}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            theme === "dark"
                              ? "bg-teal-400/10 text-teal-300"
                              : "bg-teal-100 text-teal-700"
                          }`}>
                            {session.inputMethod}
                          </span>
                          <span className={"text-xs text-fg-muted"}>
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={"text-sm mt-1.5 truncate text-fg"}>{session.transcript}</p>
                      </div>
                      <span className={"shrink-0 font-display text-lg text-primary"}>{session.overallScore}</span>
                    </button>

                    {isExpanded && (
                      <div className={"px-5 pb-5 pt-4 space-y-4 border-t border-border"}>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                          {Object.entries(session.scores).map(([key, value]) => (
                            <div key={key}>
                              <p className={"text-sm font-semibold text-fg"}>{value}</p>
                              <p className={`text-[10px] capitalize ${
                                theme === "dark" ? "text-fg-secondary" : "text-fg-muted"
                              }`}>{key}</p>
                            </div>
                          ))}
                        </div>
                        <p className={"text-sm leading-relaxed text-fg-secondary"}>{session.detailedExplanation}</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleExportFeedback(session)}
                            className={`text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
                              theme === "dark"
                                ? "text-fg border-border hover:border-primary/60"
                                : "text-primary-hover border-primary/30 hover:border-primary"
                            }`}
                          >
                            Export Feedback
                          </button>
                          <button
                            onClick={() => handleDownloadTranscript(session)}
                            className={`text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
                              theme === "dark"
                                ? "text-fg border-border hover:border-primary/60"
                                : "text-primary-hover border-primary/30 hover:border-primary"
                            }`}
                          >
                            Download Transcript
                          </button>
                          <button
                            onClick={() => handleDelete(session._id)}
                            className={`text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
                              theme === "dark"
                                ? "text-rose-400 border-border hover:border-rose-400/60"
                                : "text-red-600 border-red-200 hover:border-red-400"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className={"text-sm disabled:opacity-30 transition-colors text-fg-secondary hover:text-fg"}
            >
              ← Prev
            </button>
            <span className={"text-xs text-fg-muted"}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className={"text-sm disabled:opacity-30 transition-colors text-fg-secondary hover:text-fg"}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
