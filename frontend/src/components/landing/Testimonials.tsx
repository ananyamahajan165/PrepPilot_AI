import { Container, Reveal, SectionHeading } from "./shared";

const testimonials = [
  {
    quote:
      "I used to freeze during mock interviews. Practicing HR questions here and reading the feedback out loud actually changed how I sound in real interviews.",
    name: "Riya S.",
    role: "Final-year CSE student",
    initials: "RS",
  },
  {
    quote:
      "The Communication Coach caught mistakes I didn't even know I was making — and helped me sound more confident, not just more correct. My spoken English in group discussions got noticeably better in a month.",
    name: "Arjun P.",
    role: "Placement aspirant, ECE",
    initials: "AP",
  },
  {
    quote:
      "Uploaded my resume expecting generic advice. Instead I got specific missing keywords and a rewritten summary that actually sounded like me, just sharper.",
    name: "Meera K.",
    role: "Self-taught developer",
    initials: "MK",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-secondary py-28 border-y border-border">
      <Container>
        <SectionHeading
          eyebrow="Student stories"
          title="Built for people getting ready"
          emphasize="for the real thing."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-background p-7 flex flex-col">
                <p className="text-sm text-fg-secondary leading-relaxed flex-1">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-fg">{t.name}</p>
                    <p className="text-xs text-fg-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
