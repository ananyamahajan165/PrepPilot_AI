import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import QuestionProgress from "../components/interview/QuestionProgress";
import SessionTimer from "../components/interview/SessionTimer";
import SessionResults from "../components/interview/SessionResults";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

type Stage = "setup" | "practice" | "results";

export default function InterviewPractice() {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [count, setCount] = useState(5);

  const [stage, setStage] = useState<Stage>("setup");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const [sessions, setSessions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    api.get("/interview/categories").then((res) => {
      setCategories(res.data.categories);
      setCategory(res.data.categories[0]);
    });
  }, []);

  useEffect(() => {
    if (stage === "practice") {
      timerRef.current = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
    }
  }, [stage]);

  async function startSession(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoadingQuestions(true);
    try {
      const res = await api.post("/interview/questions", { category, difficulty, count });
      const qs: string[] = res.data.questions;
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(""));
      setCurrentIndex(0);
      setElapsedSeconds(0);
      setStage("practice");
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't generate questions right now. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  function updateAnswer(value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = value;
      return next;
    });
  }

  const answeredIndices = new Set(answers.map((a, i) => (a.trim() ? i : -1)).filter((i) => i >= 0));
  const allAnswered = answeredIndices.size === questions.length;

  async function finishSession() {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/interview/submit", {
        category,
        difficulty,
        answers: questions.map((q, i) => ({ question: q, answer: answers[i] })),
      });
      setSessions(res.data.sessions);
      setSummary(res.data.summary);
      setStage("results");
      showToast("Your feedback is ready.", "success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't score your answers right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setStage("setup");
    setQuestions([]);
    setAnswers([]);
    setSessions([]);
    setSummary(null);
    setError("");
  }

  return (
    <Layout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-2xl font-bold text-fg">Interview Preparation</h1>
        <Link to="/interview/history" className="text-sm font-medium text-primary hover:text-primary-hover">
          View History →
        </Link>
      </div>
      <p className="text-fg-muted mb-6">
        Pick a category and difficulty — questions are generated fresh by AI, and every answer is
        scored on grammar, communication, technical quality, confidence, and professionalism.
      </p>

      {stage === "setup" && (
        <form onSubmit={startSession} className="bg-card rounded-xl shadow-sm p-5 grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="interview-category" className="block text-sm font-medium text-fg-secondary mb-1">Category</label>
            <select
              id="interview-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-field"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="interview-difficulty" className="block text-sm font-medium text-fg-secondary mb-1">Difficulty</label>
            <select
              id="interview-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-field"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="interview-count" className="block text-sm font-medium text-fg-secondary mb-1"># Questions</label>
            <input
              id="interview-count"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Math.min(Math.max(Number(e.target.value) || 1, 1), 10))}
              className="form-field"
            />
          </div>
          <button
            type="submit"
            disabled={loadingQuestions || !category}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {loadingQuestions ? "Generating questions…" : "Start Practice"}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {stage === "practice" && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <QuestionProgress
              total={questions.length}
              currentIndex={currentIndex}
              answeredIndices={answeredIndices}
              onNavigate={setCurrentIndex}
            />
            <SessionTimer elapsedSeconds={elapsedSeconds} />
          </div>

          <div className="bg-card rounded-xl shadow-sm p-5">
            <p className="text-xs text-fg-muted mb-1">
              {category} · {difficulty}
            </p>
            <p className="text-lg font-medium text-fg">{questions[currentIndex]}</p>

            <textarea
              value={answers[currentIndex]}
              onChange={(e) => updateAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer here..."
              className="form-field mt-4"
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
                className="text-sm font-medium text-fg-secondary hover:text-fg disabled:opacity-30 transition-colors"
              >
                ← Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={finishSession}
                  disabled={!allAnswered || submitting}
                  title={!allAnswered ? "Answer every question to finish" : undefined}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  {submitting ? "Scoring your answers…" : "Finish & Get Feedback"}
                </button>
              )}
            </div>
            {!allAnswered && currentIndex === questions.length - 1 && (
              <p className="text-xs text-amber-600 mt-2">
                Answer all {questions.length} questions to finish — use the dots above to jump back.
              </p>
            )}
          </div>
        </div>
      )}

      {stage === "results" && summary && (
        <div className="mt-6">
          <SessionResults sessions={sessions} summary={summary} onRestart={restart} />
        </div>
      )}
    </Layout>
  );
}
