import { FadeIn } from "../ui/motion";
import { SparklesIcon } from "./icons";

const QUOTES = [
  "Every interview makes you stronger than the previous one.",
  "Confidence is a skill you build one session at a time, not a trait you're born with.",
  "The best time to practice was yesterday. The second best time is now.",
  "You don't need to be perfect — you need to be prepared.",
  "Small, consistent practice beats last-minute cramming, every time.",
  "Your voice matters more than your vocabulary — clarity beats complexity.",
  "The interview you're dreading is just another rep. Show up for it.",
  "Progress hides in the sessions that felt awkward, not just the ones that felt smooth.",
  "Great communicators aren't naturally fearless — they're just well-practiced.",
  "You're not behind. You're building something recruiters can't teach: real reps.",
  "Every 'no' in practice is a 'yes' you're protecting for the real thing.",
  "Fluency is built in silence, alone, before it ever shows up in a room full of people.",
];

// Deterministic "quote of the day" — same quote for everyone on a given
// calendar date, and it naturally changes at midnight without any stored
// state or backend call, satisfying "refresh every day" for free.
function quoteOfTheDay() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return QUOTES[dayNumber % QUOTES.length];
}

/** Section 11 — Motivation. Small, quiet card; this is meant to be a nice
 * closing note on the page, not another competing headline. */
export default function MotivationalQuote() {
  const quote = quoteOfTheDay();

  return (
    <FadeIn>
      <div className="card-premium text-center">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <SparklesIcon className="w-4.5 h-4.5" />
        </div>
        <p className="font-display text-lg text-fg italic max-w-xl mx-auto leading-relaxed">"{quote}"</p>
        <p className="text-xs text-fg-muted mt-3">Your AI coach — refreshes daily</p>
      </div>
    </FadeIn>
  );
}
