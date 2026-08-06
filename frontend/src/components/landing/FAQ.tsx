import { useState } from "react";
import { Container, Reveal, SectionHeading } from "./shared";

const faqs = [
  {
    q: "Is VerbaAI free to use?",
    a: "Yes. Sign up and use the Communication Coach, Interview Practice, and Resume Analyzer at no cost.",
  },
  {
    q: "Which AI model powers the feedback?",
    a: "VerbaAI uses Google's Gemini API to analyze sentences, score interview answers, and review resumes — all called securely from the backend, never exposed to the browser.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. VerbaAI runs entirely in your browser — no downloads, no extensions.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resume is parsed for text, analyzed, and the report is stored to your account only. It's never shared or used to train models.",
  },
  {
    q: "Can I practice interviews for a specific role?",
    a: "Yes — choose a category (like DSA, HR, or system design) and difficulty before each interview practice session.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Frequently asked" emphasize="questions." />

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium text-fg">{item.q}</span>
                    <span
                      className={`shrink-0 text-primary text-lg transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-4 text-sm text-fg-secondary leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
