import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import MicRecorder from "../components/communication/MicRecorder";
import ThinkingIndicator from "../components/communication/ThinkingIndicator";
import ResultsPanel from "../components/communication/ResultsPanel";
import ConversationCoach from "../components/communication/conversationCoach";
import TopicGenerator, { GeneratedTopic } from "../components/communication/TopicGenerator";
import { FadeIn } from "../components/ui/motion";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useToast } from "../context/ToastContext";
import api from "../lib/api";

type Mode = "text" | "voice" | "conversation";

export default function CommunicationCoach() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<Mode>("text");
  const [textInput, setTextInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [activeTopic, setActiveTopic] = useState<GeneratedTopic | null>(null);
  const [recentHistory, setRecentHistory] = useState<{ overallScore: number; createdAt: string }[]>([]);
  const { showToast } = useToast();
  const recorder = useVoiceRecorder();

  const activeTranscript = mode === "text" ? textInput : recorder.transcript;
  const wordCount = activeTranscript.trim() ? activeTranscript.trim().split(/\s+/).length : 0;
  const canSubmit =
    activeTranscript.trim().length > 0 &&
    !submitting &&
    (mode === "text" || recorder.status === "stopped");

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSession(null);
    try {
      const res = await api.post("/communication/analyze", {
        transcript: activeTranscript.trim(),
        inputMethod: mode,
        durationSeconds: mode === "voice" ? recorder.elapsedSeconds : 0,
        ...(activeTopic
          ? {
              topic: activeTopic.topic,
              difficulty: activeTopic.difficulty,
              category: activeTopic.category,
              recommendedMinutes: activeTopic.recommendedMinutes,
            }
          : {}),
      });
      setSession(res.data.session);
      showToast("Feedback ready — check out your scores below.", "success");

      try {
        const historyRes = await api.get("/communication/history", { params: { limit: 8 } });
        const sessions = (historyRes.data.sessions || [])
          .slice()
          .reverse()
          .map((s: any) => ({ overallScore: s.overallScore, createdAt: s.createdAt }));
        setRecentHistory(sessions);
      } catch {

      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleModeSwitch(next: Mode) {
    setMode(next);
    setSession(null);
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className={"text-xs font-semibold uppercase tracking-wide text-primary"}>Flagship feature</p>
            <h1 className={"font-display text-2xl font-medium mt-1 text-fg"}>
              AI Confidence & Communication Coach
            </h1>
            <p className={"text-sm mt-1 max-w-xl text-fg-secondary"}>
              Speak or write like you're answering an interview question — your coach evaluates
              confidence, clarity, and professionalism, not just grammar.
            </p>
          </div>
          <Link
            to="/communication-coach/history"
            className={`text-sm font-medium rounded-full px-4 py-2 shrink-0 transition-colors border ${
              theme === "dark"
                ? "text-fg border-border hover:border-primary/60"
                : "text-primary-hover border-primary/30 hover:border-primary"
            }`}
          >
            View History
          </Link>
        </div>

        {mode !== "conversation" && (
          <TopicGenerator
            activeTopic={activeTopic}
            onTopicGenerated={(t) => {
              setActiveTopic(t);
              setSession(null);
            }}
            onClearTopic={() => setActiveTopic(null)}
            disabled={submitting}
          />
        )}

        <FadeIn>
          <div className={`inline-flex rounded-full p-1 border ${
            theme === "dark"
              ? "bg-card border-border"
              : "bg-surface-secondary border-border"
          }`}>
            {(["text", "voice", "conversation"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`text-sm font-medium rounded-full px-5 py-2 transition-colors ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-fg-secondary hover:text-fg"
                }`}
              >
                {m === "text" ? "Text Input" : m === "voice" ? "Voice Input" : "AI Conversation"}
              </button>
            ))}
          </div>
        </FadeIn>

        {mode === "conversation" ? (
          <ConversationCoach />
        ) : (
          <>
            {mode === "text" ? (
              <FadeIn>
                <div className={"rounded-xl border p-5 bg-card border-border"}>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                      activeTopic
                        ? `Answer "${activeTopic.topic}" here...`
                        : "Type a response, like you're answering an interview question: 'Tell me about a time you solved a difficult problem...'"
                    }
                    aria-label="Your response"
                    rows={6}
                    className={"w-full bg-transparent text-sm focus:outline-none resize-none text-fg placeholder:text-fg-muted"}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      theme === "dark" ? "text-fg-secondary" : "text-fg-muted"
                    }`}>{wordCount} words</span>
                  </div>
                </div>
              </FadeIn>
            ) : (
              <MicRecorder
                status={recorder.status}
                transcript={recorder.transcript}
                setTranscript={recorder.setTranscript}
                elapsedSeconds={recorder.elapsedSeconds}
                audioUrl={recorder.audioUrl}
                micError={recorder.micError}
                isSupported={recorder.isSupported}
                onStart={recorder.start}
                onPause={recorder.pause}
                onResume={recorder.resume}
                onStop={recorder.stop}
                onDelete={recorder.deleteRecording}
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={"w-full sm:w-auto text-sm font-semibold rounded-full px-8 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground bg-primary hover:bg-primary-hover"}
            >
              {submitting ? "Analyzing…" : "Get Coaching Feedback"}
            </button>

            {submitting && <ThinkingIndicator />}

            {session && !submitting && <ResultsPanel session={session} history={recentHistory} />}
          </>
        )}
      </div>
    </Layout>
  );
}
