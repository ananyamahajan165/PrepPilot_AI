import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { FadeIn } from "../ui/motion";
import ResultsPanel from "./ResultsPanel";
import { formatDuration } from "../../lib/formatTime";
import api from "../../lib/api";

interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
  correction?: string | null;
}

type Phase = "intro" | "active" | "ended";
type TurnState = "idle" | "ai-speaking" | "listening" | "processing";
export type SpeechRate = 0.8 | 1 | 1.2;

const MIN_RESPONSE_CHARS = 2;

const SPEECH_SUPPORTED = typeof window !== "undefined" && "speechSynthesis" in window;

/** Picks the most natural-sounding available English voice, preferring en-US. */
function pickBestEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const byQuality = (v: SpeechSynthesisVoice) => /Google|Natural|Neural|Online|Premium/i.test(v.name);

  const enUS = voices.filter((v) => v.lang === "en-US");
  const enAny = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));

  return (
    enUS.find(byQuality) ||
    enUS.find((v) => v.default) ||
    enUS[0] ||
    enAny.find(byQuality) ||
    enAny.find((v) => v.default) ||
    enAny[0] ||
    voices[0] ||
    null
  );
}

interface SpeakOptions {
  rate?: SpeechRate;
  voice?: SpeechSynthesisVoice | null;
  onStart?: () => void;
}

/**
 * Speaks text aloud via the Web Speech API. Calls onDone once when playback ends or isn't
 * supported. If the browser's autoplay policy blocks playback (e.g. Safari outside a direct
 * user gesture), onDone receives the SpeechSynthesisErrorEvent so the caller can offer a
 * manual "tap to speak" fallback.
 */
function speak(
  text: string,
  onDone: (blockedEvent?: SpeechSynthesisErrorEvent) => void,
  options: SpeakOptions = {}
): boolean {
  if (!SPEECH_SUPPORTED) {
    onDone();
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    if (options.voice) utterance.voice = options.voice;
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => onDone();
    utterance.onerror = (e) => onDone(e.error === "not-allowed" ? e : undefined);
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onDone();
    return false;
  }
}

function SpeakingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 w-fit">
      <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-primary animate-wave-drift"
            style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-fg-secondary">{label}</span>
    </div>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 w-fit">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-fg-secondary">{label}</span>
    </div>
  );
}

export default function ConversationCoach() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { user } = useAuth();
  const recorder = useVoiceRecorder();

  const [phase, setPhase] = useState<Phase>("intro");
  const [turnState, setTurnState] = useState<TurnState>("idle");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [textFallback, setTextFallback] = useState("");
  const [endResult, setEndResult] = useState<any>(null);
  const [ending, setEnding] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<SpeechRate>(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [replayingIndex, setReplayingIndex] = useState<number | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const pendingSpeechRef = useRef<string | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the best available English voice. Voice lists populate asynchronously in some
  // browsers, so we check immediately and again once the browser fires voiceschanged.
  useEffect(() => {
    if (!SPEECH_SUPPORTED) return;
    const loadVoice = () => setVoice(pickBestEnglishVoice(window.speechSynthesis.getVoices()));
    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
    return () => {
      if (SPEECH_SUPPORTED) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (SPEECH_SUPPORTED) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, turnState]);

  function historyForApi(msgs: ConversationMessage[]) {
    return msgs.map((m) => ({ role: m.role, content: m.content }));
  }

  async function fetchNextMessage(history: ConversationMessage[]) {
    setTurnState("processing");
    try {
      const res = await api.post("/communication/conversation/message", {
        history: historyForApi(history),
      });
      const { message, correction } = res.data as { message: string; correction: string | null };

      setMessages((prev) => [...prev, { role: "assistant", content: message, correction: undefined }]);
      if (correction && history.length > 0) {
        // attach the correction to the most recent user turn instead of the coach turn
        setMessages((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 2; i >= 0; i--) {
            if (copy[i].role === "user") {
              copy[i] = { ...copy[i], correction };
              break;
            }
          }
          return copy;
        });
      }

      setTurnState("ai-speaking");
      const started = speak(
        message,
        (blockedEvent) => {
          setSpeaking(false);
          setTurnState("idle");
          if (blockedEvent) {
            // Browser's autoplay policy blocked speech outside a direct user gesture.
            pendingSpeechRef.current = message;
            setAutoplayBlocked(true);
          }
        },
        { rate: speechRate, voice, onStart: () => setSpeaking(true) }
      );
      if (!started) {
        // Speech synthesis unavailable — move straight back to a usable state.
        setTurnState("idle");
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "I couldn't process that response. Please try again.",
        "error"
      );
      setTurnState("idle");
    }
  }

  /** Manually resumes speech after the browser blocked autoplay — called from a direct click. */
  function resumeBlockedSpeech() {
    const text = pendingSpeechRef.current;
    setAutoplayBlocked(false);
    pendingSpeechRef.current = null;
    if (!text) return;
    setTurnState("ai-speaking");
    speak(
      text,
      () => {
        setSpeaking(false);
        setTurnState("idle");
      },
      { rate: speechRate, voice, onStart: () => setSpeaking(true) }
    );
  }

  /** Interrupts the AI's current speech without losing conversation state or history. */
  function stopAiSpeech() {
    if (!SPEECH_SUPPORTED) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    if (turnState === "ai-speaking") setTurnState("idle");
  }

  /** Re-speaks a past AI message. Does not call Gemini or alter conversation state. */
  function replayMessage(index: number, text: string) {
    if (!SPEECH_SUPPORTED || turnState !== "idle") return;
    setReplayingIndex(index);
    speak(
      text,
      () => {
        setSpeaking(false);
        setReplayingIndex(null);
      },
      { rate: speechRate, voice, onStart: () => setSpeaking(true) }
    );
  }

  async function handleStart() {
    setPhase("active");
    setMessages([]);
    setEndResult(null);
    startTimeRef.current = Date.now();
    await fetchNextMessage([]);
  }

  async function submitUserMessage(raw: string) {
    const content = raw.trim();
    if (content.length < MIN_RESPONSE_CHARS) {
      showToast("Let's hear a bit more than that — try again.", "info");
      return;
    }
    const nextHistory: ConversationMessage[] = [...messages, { role: "user", content }];
    setMessages(nextHistory);
    setTextFallback("");
    recorder.deleteRecording();
    await fetchNextMessage(nextHistory);
  }

  async function handleMicToggle() {
    if (turnState === "listening") {
      recorder.stop();
      return;
    }
    if (turnState !== "idle" || speaking) return;
    setTurnState("listening");
    await recorder.start();
  }

  // Once the recorder finishes (status becomes "stopped"), submit whatever was transcribed.
  useEffect(() => {
    if (recorder.status === "stopped" && turnState === "listening") {
      const transcript = recorder.transcript.trim();
      if (!transcript) {
        showToast("I didn't catch that. Please try speaking again, or type your response below.", "info");
        setTurnState("idle");
        recorder.deleteRecording();
        return;
      }
      submitUserMessage(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.status]);

  async function handleEndConversation() {
    if (ending) return;
    const userTurnCount = messages.filter((m) => m.role === "user").length;
    if (userTurnCount === 0) {
      showToast("Say at least one thing before ending the conversation.", "info");
      return;
    }
    setEnding(true);
    if (SPEECH_SUPPORTED) window.speechSynthesis.cancel();
    setSpeaking(false);
    setAutoplayBlocked(false);
    const durationSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

    try {
      const res = await api.post("/communication/conversation/end", {
        history: historyForApi(messages),
        durationSeconds,
      });
      setEndResult(res.data);
      setPhase("ended");
      showToast("Great conversation! Here's how you performed.", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Couldn't generate your analysis. Please try again.",
        "error"
      );
    } finally {
      setEnding(false);
    }
  }

  function handlePracticeAgain() {
    setPhase("intro");
    setMessages([]);
    setEndResult(null);
    setSpeaking(false);
    setAutoplayBlocked(false);
    setReplayingIndex(null);
    recorder.deleteRecording();
  }

  const micLabel =
    turnState === "listening" ? "Stop recording" : "Hold to speak — tap to start, tap again to stop";

  if (phase === "intro") {
    return (
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-3xl mb-3" aria-hidden="true">
            🤖
          </p>
          <h2 className="font-display text-xl font-medium text-fg">AI Communication Coach</h2>
          <p className="text-sm text-fg-secondary mt-2 max-w-md mx-auto">
            Practice speaking English through a real conversation. Your coach will ask you questions,
            listen to your answers, and keep the conversation going — just like talking to a person.
          </p>
          <button
            onClick={handleStart}
            className="mt-6 text-sm font-semibold rounded-full px-8 py-3 transition-colors text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            Start Conversation
          </button>
          {!recorder.isSupported && (
            <p className="text-xs text-fg-muted mt-4">
              Voice input isn't supported in this browser — you can still type your responses during the
              conversation.
            </p>
          )}
          {!SPEECH_SUPPORTED && (
            <p className="text-xs text-fg-muted mt-2">
              Voice playback isn't available in this browser, but you can continue using text conversation.
            </p>
          )}
        </div>
      </FadeIn>
    );
  }

  if (phase === "ended" && endResult) {
    const summary = endResult.conversationSummary as
      | { strengths?: string[]; improvementAreas?: string[]; suggestedPractice?: string }
      | null;

    return (
      <div className="space-y-6">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <h2 className="font-display text-xl font-medium text-fg">Conversation Summary</h2>
            <div className="flex items-center justify-center gap-6 mt-3 text-sm text-fg-secondary">
              <span>
                Duration:{" "}
                <span className="text-fg font-medium">
                  {formatDuration(endResult.session?.durationSeconds || 0)}
                </span>
              </span>
              <span>
                Messages: <span className="text-fg font-medium">{endResult.session?.messageCount ?? 0}</span>
              </span>
            </div>
          </div>
        </FadeIn>

        {summary && (
          <FadeIn delay={0.05}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5 border bg-card border-border">
                <p className="text-sm font-semibold mb-3 text-fg">Strengths</p>
                <ul className="space-y-2">
                  {(summary.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm flex gap-2 text-fg-secondary">
                      <span className={theme === "dark" ? "text-teal-400" : "text-teal-600"}>✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-5 border bg-card border-border">
                <p className="text-sm font-semibold mb-3 text-fg">Areas to Improve</p>
                <ul className="space-y-2">
                  {(summary.improvementAreas || []).map((s, i) => (
                    <li key={i} className="text-sm flex gap-2 text-fg-secondary">
                      <span className={theme === "dark" ? "text-primary" : "text-amber-600"}>•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {summary.suggestedPractice && (
              <div className="rounded-2xl p-5 border bg-card border-border mt-4">
                <p className="text-sm font-semibold mb-2 text-fg">Suggested Practice</p>
                <p className="text-sm text-fg-secondary">{summary.suggestedPractice}</p>
              </div>
            )}
          </FadeIn>
        )}

        <ResultsPanel session={endResult.session} />

        <div className="flex justify-center">
          <button
            onClick={handlePracticeAgain}
            className="text-sm font-semibold rounded-full px-8 py-3 transition-colors text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  const stateLabel: Record<TurnState, string> = {
    idle: user?.name ? `Conversation with ${user.name}` : "Your turn",
    listening: "🎙️ Listening…",
    processing: "🧠 AI is thinking…",
    "ai-speaking": "🔊 AI is speaking…",
  };

  return (
    <div className="space-y-4">
      <FadeIn>
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                turnState === "idle" ? "bg-teal-400" : "bg-primary animate-pulse"
              }`}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-fg">{stateLabel[turnState]}</p>
          </div>
          <div className="flex items-center gap-2">
            {turnState === "ai-speaking" && (
              <button
                onClick={stopAiSpeech}
                className="text-xs font-semibold rounded-full px-4 py-1.5 border border-border text-fg-secondary hover:border-primary/60 hover:text-primary transition-colors"
              >
                ⏹ Stop AI
              </button>
            )}
            <button
              onClick={handleEndConversation}
              disabled={ending}
              className="text-xs font-semibold rounded-full px-4 py-1.5 border border-border text-fg-secondary hover:border-rose-400/60 hover:text-rose-400 transition-colors disabled:opacity-40"
            >
              {ending ? "Ending…" : "End Conversation"}
            </button>
          </div>
        </div>
      </FadeIn>

      {!SPEECH_SUPPORTED && (
        <p className="text-xs text-fg-muted bg-surface-secondary rounded-lg px-3 py-2">
          Voice playback isn't available in this browser, but you can continue using text conversation.
        </p>
      )}

      {autoplayBlocked && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <p className="text-xs text-fg-secondary">Your browser blocked automatic voice playback.</p>
          <button
            onClick={resumeBlockedSpeech}
            className="text-xs font-semibold rounded-full px-4 py-1.5 shrink-0 text-primary-foreground bg-primary hover:bg-primary-hover transition-colors"
          >
            🔊 Start Voice Conversation
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="rounded-xl border border-border bg-card p-4 sm:p-5 max-h-[28rem] overflow-y-auto space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation transcript"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] ${m.role === "user" ? "text-right" : "text-left"}`}>
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${
                  m.role === "user" ? "text-fg-muted" : "text-primary"
                }`}
              >
                {m.role === "user" ? "You" : "AI Coach"}
              </p>
              <div
                className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/10 border border-primary/20 text-fg rounded-br-sm"
                    : "bg-surface-secondary border border-border text-fg rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
              {m.role === "assistant" && SPEECH_SUPPORTED && (
                <button
                  onClick={() => replayMessage(i, m.content)}
                  disabled={turnState !== "idle"}
                  className="mt-1 text-[11px] font-medium text-fg-muted hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {replayingIndex === i ? "🔊 Playing…" : "🔊 Replay"}
                </button>
              )}
              {m.correction && (
                <p className="text-xs text-fg-muted mt-1 italic max-w-xs ml-auto">💡 {m.correction}</p>
              )}
            </div>
          </div>
        ))}

        {turnState === "processing" && (
          <div className="flex justify-start">
            <TypingDots label="🧠 AI is thinking…" />
          </div>
        )}
        {turnState === "ai-speaking" && (
          <div className="flex justify-start">
            <SpeakingIndicator label="🔊 AI coach is speaking…" />
          </div>
        )}
      </div>

      {recorder.micError && (
        <p className="text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">{recorder.micError}</p>
      )}

      <FadeIn>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col items-center gap-4">
          {recorder.isSupported && (
            <button
              onClick={handleMicToggle}
              disabled={turnState === "processing" || turnState === "ai-speaking" || speaking}
              aria-label={micLabel}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-[0_0_30px_-10px_rgba(246,183,60,0.5)] disabled:opacity-40 disabled:cursor-not-allowed ${
                turnState === "listening"
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-primary hover:bg-primary-hover"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary-foreground" fill="currentColor">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
                <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-2.06A9 9 0 0 0 21 11h-2Z" />
              </svg>
            </button>
          )}
          <p className="text-xs text-fg-secondary text-center">
            {turnState === "listening"
              ? "Listening… tap the mic again when you're done"
              : turnState === "processing"
              ? "Processing…"
              : turnState === "ai-speaking"
              ? "AI is speaking — the mic will unlock when it's done"
              : speaking
              ? "Playing back the message…"
              : recorder.isSupported
              ? "Tap the mic to answer"
              : "Voice input isn't supported — type your response below"}
          </p>

          <div className="w-full flex gap-2">
            <textarea
              value={textFallback}
              onChange={(e) => setTextFallback(e.target.value)}
              placeholder="Or type your response here…"
              aria-label="Type your response"
              rows={2}
              disabled={turnState === "processing" || turnState === "ai-speaking" || turnState === "listening"}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-primary/60 resize-none disabled:opacity-50"
            />
            <button
              onClick={() => submitUserMessage(textFallback)}
              disabled={
                !textFallback.trim() ||
                turnState === "processing" ||
                turnState === "ai-speaking" ||
                turnState === "listening"
              }
              className="text-sm font-semibold rounded-full px-5 shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground bg-primary hover:bg-primary-hover"
            >
              Send
            </button>
          </div>

          {SPEECH_SUPPORTED && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-fg-muted">Speaking Speed</span>
              <div className="inline-flex rounded-full border border-border p-0.5 bg-surface-secondary">
                {([0.8, 1, 1.2] as SpeechRate[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`text-[11px] font-medium rounded-full px-3 py-1 transition-colors ${
                      speechRate === rate
                        ? "bg-primary text-primary-foreground"
                        : "text-fg-secondary hover:text-fg"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
