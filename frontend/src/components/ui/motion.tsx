import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function staggerDelay(index: number, step = 0.06) {
  return index * step;
}

export function StatCounter({
  value,
  suffix = "",
  duration = 1200,
  immediate = false,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewResult = useInView(ref, { once: true, margin: "-40px" });
  const inView = immediate || inViewResult;
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
