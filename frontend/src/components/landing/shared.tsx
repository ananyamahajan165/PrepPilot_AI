import { ReactNode } from "react";

export { Reveal, StatCounter } from "../ui/motion";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-px w-6 bg-primary/70" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  emphasize,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  emphasize?: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <div className={align === "center" ? "flex justify-center mb-4" : "mb-4"}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-medium text-fg leading-tight">
        {title}{" "}
        {emphasize && <em className="text-primary not-italic font-medium italic">{emphasize}</em>}
      </h2>
      {subtitle && <p className="mt-4 text-fg-secondary text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}
