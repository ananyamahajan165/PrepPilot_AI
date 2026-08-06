import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../components/Layout";
import UploadZone from "../components/resume/UploadZone";
import ReportDetail from "../components/resume/ReportDetail";
import { ResumeReport } from "../components/resume/types";
import { FadeIn } from "../components/ui/motion";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

function AnalyzingIndicator() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex items-center gap-3 bg-card rounded-xl shadow-sm px-5 py-4">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="text-sm text-fg-muted">Reading your resume and scoring it against ATS criteria…</span>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ResumeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReport(res.data.report);
      showToast("Your resume report is ready.", "success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not analyze this resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-2xl font-bold text-fg">Resume Analyzer</h1>
        <Link to="/resume/history" className="text-sm font-medium text-primary hover:text-primary-hover">
          View History →
        </Link>
      </div>
      <p className="text-fg-muted mb-6">
        Upload a PDF resume to get a real ATS score, a rewritten professional summary, and specific
        AI-driven improvement suggestions.
      </p>

      <FadeIn>
        <div className="bg-card rounded-xl shadow-sm p-5 mb-6">
          <UploadZone file={file} onSelect={setFile} disabled={loading} />
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {loading ? "Analyzing…" : "Analyze Resume"}
          </button>
        </div>
      </FadeIn>

      {loading && <AnalyzingIndicator />}

      {report && !loading && <ReportDetail report={report} />}
    </Layout>
  );
}