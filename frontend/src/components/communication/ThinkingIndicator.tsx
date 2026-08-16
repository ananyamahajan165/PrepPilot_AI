import { motion, useReducedMotion } from "framer-motion";

export default function ThinkingIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
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
      <span className="text-sm text-fg-secondary">Your coach is analyzing your response…</span>
    </div>
  );
}
