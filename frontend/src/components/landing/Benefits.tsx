import { Container, Reveal, SectionHeading } from "./shared";

const oldWay = [
  "One site for grammar checking",
  "Another for interview questions",
  "A third for resume review",
  "No single place to see if you're actually improving",
];

const newWay = [
  "Grammar, vocabulary & confidence in one coach",
  "Technical + HR interview practice, scored instantly",
  "ATS resume analysis with a rewritten summary",
  "One dashboard tracking every score over time",
];

export default function Benefits() {
  return (
    <section className="bg-background py-28">
      <Container>
        <SectionHeading
          eyebrow="Why VerbaAI"
          title="Stop stitching together"
          emphasize="five different tools."
          subtitle="Placement prep is scattered by default. VerbaAI puts the whole loop — practice, feedback, progress — behind one login."
        />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card/50 p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-fg-secondary">
                The old way
              </h3>
              <ul className="mt-6 space-y-4">
                {oldWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fg-secondary">
                    <span className="mt-1 text-red-400/70">✕</span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/[0.06] to-transparent p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                With VerbaAI
              </h3>
              <ul className="mt-6 space-y-4">
                {newWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fg">
                    <span className="mt-1 text-teal-400">✓</span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
