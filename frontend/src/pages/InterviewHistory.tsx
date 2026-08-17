import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { FadeIn } from "../components/ui/motion";
import { useToast } from "../context/ToastContext";
import api from "../lib/api";

interface Session {
  _id: string;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  grammarScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  professionalismScore: number;
  overallScore: number;
  createdAt: string;
}

export default function InterviewHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get("/interview/history")
      .then((res) => setSessions(res.data.sessions))
      .catch(() => {
        setLoadError(true);
        showToast("Couldn't load your interview history.", "error");
      })
      .finally(() => setLoading(false));

  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-fg mb-6">Interview History</h1>

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading interview history">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl shadow-sm p-5 animate-pulse">
              <div className="h-3 w-40 bg-surface-secondary rounded mb-3" />
              <div className="h-4 w-3/4 bg-surface-secondary rounded mb-3" />
              <div className="h-3 w-full bg-surface-secondary rounded" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <FadeIn>
          <div className="text-center py-16 bg-card rounded-xl shadow-sm">
            <p className="text-fg-muted text-sm">Something went wrong loading your history. Please try refreshing.</p>
          </div>
        </FadeIn>
      ) : sessions.length === 0 ? (
        <FadeIn>
          <div className="text-center py-16 bg-card rounded-xl shadow-sm">
            <p className="text-fg-muted text-sm">No past interview sessions yet.</p>
            <Link to="/interview" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">
              Start your first practice session →
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <FadeIn key={s._id} delay={i * 0.03}>
              <div className="bg-card rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-fg-muted">
                      {s.category} · {s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-medium text-fg mt-1">{s.question}</p>
                    <p className="text-fg-secondary mt-2 text-sm">{s.answer}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-fg-muted">
                      <span>Grammar {s.grammarScore}</span>
                      <span>Communication {s.communicationScore}</span>
                      <span>Technical {s.technicalScore}</span>
                      <span>Confidence {s.confidenceScore}</span>
                      <span>Professionalism {s.professionalismScore}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-primary-hover font-bold whitespace-nowrap">{s.overallScore}/100</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </Layout>
  );
}
