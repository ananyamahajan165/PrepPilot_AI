import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container, Eyebrow } from "./shared";

// Real examples of the kind of sentence VerbaAI's Communication Coach corrects —
// this card is the page's thesis: show the product working, don't just
// describe it.
const examples = [
  {
    before: "I are preparing for interview since two month.",
    after: "I've been preparing for interviews for two months.",
    tag: "Tense · Preposition",
  },
  {
    before: "He is having good communication skill.",
    after: "He has good communication skills.",
    tag: "Verb usage · Plural",
  },
  {
    before: "I want to improve speaking, also I feel nervous in interview.",
    after: "I want to improve my speaking — I also get nervous in interviews.",
    tag: "Sentence structure",
  },
];

/** Ambient waveform bars drifting behind the hero — a quiet nod to
 * "spoken" English coaching rather than a generic gradient blob. */
function AmbientWaveform() {
  const shouldReduceMotion = useReducedMotion();
  const bars = Array.from({ length: 28 });

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-center gap-1.5 opacity-[0.14] pointer-events-none"
      aria-hidden="true"
    >
      {bars.map((_, i) => {
        const height = 20 + Math.abs(Math.sin(i * 0.7)) * 80;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-full bg-gradient-to-t from-primary to-success origin-bottom ${
              shouldReduceMotion ? "" : "animate-wave-drift"
            }`}
            style={{
              height: `${height}%`,
              animationDelay: `${(i % 8) * 0.15}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/** The hero's signature element: a floating card that cycles through real
 * sentence corrections, mirroring one part of what the Communication Coach actually does. */
function CorrectionCard() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % examples.length), 4200);
    return () => clearInterval(id);
  }, []);

  const example = examples[index];

  return (
    <div className={shouldReduceMotion ? "" : "animate-float-slow"}>
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-[0_0_60px_-15px_rgba(246,183,60,0.25)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-xs font-medium text-fg-secondary uppercase tracking-wide">
            VerbaAI · Communication Coach
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm text-fg-secondary line-through decoration-red-400/60 decoration-2 leading-relaxed">
              "{example.before}"
            </p>
            <div className="my-3 h-px bg-border" />
            <p className="text-sm text-fg leading-relaxed">
              <span className="text-success mr-1.5">✓</span>"{example.after}"
            </p>
            <span className="inline-block mt-4 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1">
              {example.tag}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-background pt-40 pb-28">
      <AmbientWaveform />

      <Container className="relative grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>AI Communication Coach for Placements</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-medium text-fg leading-[1.1] tracking-tight">
            Speak with{" "}
            <em className="text-primary not-italic font-medium italic">confidence.</em>
            <br />
            Interview like you've done it a hundred times.
          </h1>
          <p className="mt-6 text-lg text-fg-secondary leading-relaxed max-w-lg">
            Practice spoken English, prep for technical and HR interviews, and
            get instant AI feedback on your resume — all in one place built
            for placement season.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-6 py-3"
            >
              Get Started — it's free
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-6 py-3"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CorrectionCard />
        </div>
      </Container>
    </section>
  );
}
