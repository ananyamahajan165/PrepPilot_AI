import { Container, Reveal, SectionHeading } from "./shared";

const steps = [
  { number: "01", title: "Create your account", desc: "Sign up in seconds — no credit card, no setup." },
  { number: "02", title: "Practice a module", desc: "Write a sentence, answer an interview question, or upload your resume." },
  { number: "03", title: "Get AI feedback", desc: "Gemini scores your response and explains exactly what to improve." },
  { number: "04", title: "Track your growth", desc: "Watch your grammar, confidence, and interview scores climb on your dashboard." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-secondary py-28 border-y border-border">
      <Container>
        <SectionHeading
          eyebrow="The loop"
          title="From first sentence to"
          emphasize="interview ready."
          subtitle="The same four-step loop, every time you practice — so progress compounds instead of scattering across different tools."
        />

        <div className="mt-16 grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border" aria-hidden="true" />

          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="relative">
                <div className="relative z-10 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center font-display text-primary font-medium">
                  {step.number}
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-fg">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-fg-secondary leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
