import { Container, Reveal, SectionHeading } from "./shared";

const features = [
  {
    title: "AI Confidence & Communication Coach",
    desc: "Speak or type like you're in an interview and get scored on confidence, clarity, grammar, and more — real coaching, not just corrections.",
    icon: (
      <path d="M4 6h16M4 12h10M4 18h13" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Interview Practice",
    desc: "Pick a category and difficulty, answer real technical and HR questions, and get scored on clarity, confidence, and accuracy.",
    icon: (
      <path
        d="M8 10h8M8 14h5M4 4h16v14H8l-4 4V4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Resume Analyzer",
    desc: "Upload your resume PDF and get an ATS score, missing keywords, and a rewritten professional summary in seconds.",
    icon: (
      <path
        d="M7 3h7l4 4v14H7V3z M14 3v4h4 M9 12h6 M9 16h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Progress Dashboard",
    desc: "See your grammar improvement, average interview scores, and daily goals — pulled straight from your real activity.",
    icon: (
      <path
        d="M4 19V9m6 10V5m6 14v-7m6 7V3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-28">
      <Container>
        <SectionHeading
          eyebrow="What you get"
          title="Everything placement prep needs,"
          emphasize="in one place."
          subtitle="Stop juggling four different websites for grammar, interviews, resumes, and progress tracking."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-9 h-9 text-primary"
                >
                  {f.icon}
                </svg>
                <h3 className="mt-4 font-display text-lg font-medium text-fg">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-fg-secondary leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
