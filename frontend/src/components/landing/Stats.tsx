import { Container, Reveal, StatCounter } from "./shared";

const stats = [
  { value: 12000, suffix: "+", label: "Sentences corrected", decimal: false },
  { value: 500, suffix: "+", label: "Interview questions", decimal: false },
  { value: 4.9, suffix: "/5", label: "Average rating", decimal: true },
  { value: 95, suffix: "%", label: "Users feel more confident", decimal: false },
];

export default function Stats() {
  return (
    <section className="bg-surface-secondary border-y border-border py-14">
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="font-display text-3xl sm:text-4xl font-medium text-fg">
              {stat.decimal ? (
                <>
                  {stat.value}
                  {stat.suffix}
                </>
              ) : (
                <StatCounter value={stat.value} suffix={stat.suffix} />
              )}
            </div>
            <p className="mt-2 text-sm text-fg-secondary">{stat.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
