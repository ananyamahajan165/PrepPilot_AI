import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef("");

  const isRecordingRef = useRef(false);

  const isSupported = typeof window !== "undefined" && !!getSpeechRecognitionCtor() && !!navigator.mediaDevices;

  function startTimer() {
    timerRef.current = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function startRecognitionSession() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript((finalTranscriptRef.current + interim).trim());
    };
    recognition.onerror = (event) => {

      if (event?.error && event.error !== "no-speech") {
        setMicError("Voice recognition had trouble hearing you. You can keep going or switch to text.");
      }
    };
    recognition.onend = () => {

      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch {

        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  const start = useCallback(async () => {
    setMicError(null);
    setTranscript("");
    finalTranscriptRef.current = "";
    setElapsedSeconds(0);
    setAudioUrl(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      startRecognitionSession();
      startTimer();
      isRecordingRef.current = true;
      setStatus("recording");
    } catch (err) {
      setMicError("Microphone access was denied or unavailable. You can type your response instead.");
    }
  }, []);

  const pause = useCallback(() => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
    stopTimer();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    isRecordingRef.current = true;
    startRecognitionSession();
    if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
    startTimer();
    setStatus("recording");
  }, []);

  const stop = useCallback(() => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopTimer();
    setStatus("stopped");
  }, []);

  const deleteRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setTranscript("");
    finalTranscriptRef.current = "";
    setElapsedSeconds(0);
    setAudioUrl(null);
    setMicError(null);
    setStatus("idle");
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return {
    status,
    transcript,
    setTranscript,
    elapsedSeconds,
    audioUrl,
    micError,
    isSupported,
    start,
    pause,
    resume,
    stop,
    deleteRecording,
  };
}
