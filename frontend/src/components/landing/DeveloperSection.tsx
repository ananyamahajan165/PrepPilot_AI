import { Container, Reveal, Eyebrow } from "./shared";

export default function DeveloperSection() {
  return (
    <section className="bg-surface-secondary py-28 border-y border-border">
      <Container className="max-w-2xl text-center">
        <Reveal>
          <div className="flex justify-center mb-4">
            <Eyebrow>Built by</Eyebrow>
          </div>

          <div className="mx-auto w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-display text-xl font-medium text-primary">
            AM
          </div>

          <h2 className="mt-6 font-display text-2xl sm:text-3xl font-medium text-fg">
            Ananya Mahajan
          </h2>
          <p className="mt-2 text-sm text-fg-secondary">
            Designed and built PrepPilot AI end-to-end — React & TypeScript frontend, Node/Express
            backend, MongoDB, and Gemini AI integration.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="https://github.com/ananyamahajan165"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-fg border border-border hover:border-primary/60 transition-colors rounded-full px-5 py-2.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
              </svg>
              GitHub
            </a>
            <a
              href="mailto:ananya24@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-full px-5 py-2.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 6h16v12H4V6Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Contact
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
