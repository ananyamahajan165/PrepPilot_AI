import { useReducedMotion } from "framer-motion";
import { RecordingStatus } from "../../hooks/useVoiceRecorder";
import { formatDuration } from "../../lib/formatTime";

function Waveform({ active }: { active: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const bars = Array.from({ length: 24 });

  return (
    <div className="flex items-end justify-center gap-1 h-12" aria-hidden="true">
      {bars.map((_, i) => {
        const height = 20 + Math.abs(Math.sin(i * 0.8)) * 80;
        return (
          <div
            key={i}
            className={`w-1 rounded-full bg-primary origin-bottom transition-opacity ${
              active && !shouldReduceMotion ? "animate-wave-drift" : "opacity-30"
            }`}
            style={{ height: `${height}%`, animationDelay: `${(i % 8) * 0.12}s` }}
          />
        );
      })}
    </div>
  );
}

interface MicRecorderProps {
  status: RecordingStatus;
  transcript: string;
  setTranscript: (t: string) => void;
  elapsedSeconds: number;
  audioUrl: string | null;
  micError: string | null;
  isSupported: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export default function MicRecorder({
  status,
  transcript,
  setTranscript,
  elapsedSeconds,
  audioUrl,
  micError,
  isSupported,
  onStart,
  onPause,
  onResume,
  onStop,
  onDelete,
}: MicRecorderProps) {
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-fg-secondary">
          Voice input isn't supported in this browser. Try Chrome, or use text input instead.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {micError && (
        <p className="mb-4 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">{micError}</p>
      )}

      {status === "idle" && (
        <div className="flex flex-col items-center py-6">
          <button
            onClick={onStart}
            aria-label="Start recording"
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center shadow-[0_0_40px_-10px_rgba(246,183,60,0.5)]"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
              <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-2.06A9 9 0 0 0 21 11h-2Z" />
            </svg>
          </button>
          <p className="mt-3 text-sm text-fg-secondary">Tap to start speaking</p>
        </div>
      )}

      {(status === "recording" || status === "paused") && (
        <div className="py-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`w-2 h-2 rounded-full ${status === "recording" ? "bg-rose-500 animate-pulse" : "bg-fg-muted"}`} />
            <span className="font-display text-2xl text-fg tabular-nums">{formatDuration(elapsedSeconds)}</span>
          </div>
          <Waveform active={status === "recording"} />
          {transcript && (
            <p className="mt-4 text-sm text-fg-secondary leading-relaxed max-h-24 overflow-y-auto">{transcript}</p>
          )}
          <div className="mt-5 flex justify-center gap-3">
            {status === "recording" ? (
              <button
                onClick={onPause}
                className="text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-5 py-2"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-5 py-2"
              >
                Resume
              </button>
            )}
            <button
              onClick={onStop}
              className="text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-5 py-2"
            >
              Stop Recording
            </button>
          </div>
        </div>
      )}

      {status === "stopped" && (
        <div className="py-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-fg-secondary">
              Speaking time: {formatDuration(elapsedSeconds)} · {wordCount} word{wordCount === 1 ? "" : "s"}
            </span>
          </div>

          {audioUrl && (
            <audio controls src={audioUrl} className="w-full h-10">
              Your browser does not support audio playback.
            </audio>
          )}

          <div>
            <label htmlFor="voice-transcript" className="text-xs font-medium text-fg-secondary mb-1.5 block">
              Transcript (review and edit if needed)
            </label>
            <textarea
              id="voice-transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onDelete}
              className="text-sm font-medium text-rose-400 border border-border hover:border-rose-400/60 transition-colors rounded-full px-5 py-2"
            >
              Delete Recording
            </button>
            <button
              onClick={() => {
                onDelete();
                onStart();
              }}
              className="text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-5 py-2"
            >
              Record Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
