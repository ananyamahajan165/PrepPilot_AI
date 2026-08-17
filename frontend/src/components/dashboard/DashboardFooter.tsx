import { Link } from "react-router-dom";
import { FadeIn } from "../ui/motion";

type IconProps = { className?: string };

function GitHubIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.28 9.28 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
function LinkedInIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-1 1.83-2.05 3.77-2.05C21.5 8.66 22 11.2 22 14.5V21h-4v-5.7c0-1.36-.02-3.1-1.89-3.1-1.9 0-2.19 1.48-2.19 3v5.8h-4V9Z" />
    </svg>
  );
}
function PortfolioIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function MailIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  );
}

const DEVELOPER_PROFILE = {
  name: "Ananya Mahajan",
  githubUrl: "REPLACE_WITH_YOUR_GITHUB_URL",
  linkedinUrl: "REPLACE_WITH_YOUR_LINKEDIN_URL",
  portfolioUrl: "",
  email: "REPLACE_WITH_YOUR_EMAIL",
};

const CONNECT_LINKS = [
  { label: "GitHub", href: DEVELOPER_PROFILE.githubUrl, icon: GitHubIcon },
  { label: "LinkedIn", href: DEVELOPER_PROFILE.linkedinUrl, icon: LinkedInIcon },
  ...(DEVELOPER_PROFILE.portfolioUrl ? [{ label: "Portfolio", href: DEVELOPER_PROFILE.portfolioUrl, icon: PortfolioIcon }] : []),
  { label: "Email", href: `mailto:${DEVELOPER_PROFILE.email}`, icon: MailIcon },
];

const TECH_STACK = ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Gemini AI"];

const PRODUCT_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Communication Coach", to: "/communication-coach" },
  { label: "Interview Practice", to: "/interview" },
  { label: "Resume Analyzer", to: "/resume" },
  { label: "Profile", to: "/profile" },
];

export default function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <FadeIn>
      <footer className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background p-10 sm:p-12">
        <div
          className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-x-10 gap-y-10">
          <div>
            <p className="font-display text-2xl text-fg">
              PrepPilot<span className="text-primary italic"> AI</span>
            </p>
            <p className="text-sm text-fg-secondary mt-3 max-w-xs leading-relaxed">
              AI-powered interview and communication coaching.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium text-fg-secondary bg-surface-secondary/70 border border-border rounded-full px-2.5 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted mb-4">Product</p>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-fg-secondary hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted mb-4">Connect</p>
            <ul className="space-y-2.5">
              {CONNECT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-fg-secondary hover:text-primary transition-colors duration-200 group"
                  >
                    <span className="w-7 h-7 rounded-full border border-border bg-surface-secondary/60 flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:-translate-y-0.5 transition-all duration-300">
                      <link.icon className="w-3.5 h-3.5" />
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-fg-muted">
          <p>&copy; {year} PrepPilot AI. All rights reserved.</p>
          <p>
            Built by <span className="text-fg-secondary font-medium">{DEVELOPER_PROFILE.name}</span>
          </p>
        </div>
      </footer>
    </FadeIn>
  );
}
