import { Link } from "react-router-dom";
import { Container } from "./shared";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Get Started", href: "/signup" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background pt-20 pb-10">
      <Container>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <span className="font-display text-lg font-medium text-fg">
              Verba<span className="text-primary italic">AI</span>
            </span>
            <p className="mt-3 text-sm text-fg-secondary max-w-xs leading-relaxed">
              Your AI-powered interview and English communication coach — built for placement
              season.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-fg">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) =>
                  link.href.startsWith("#") ? (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-fg-secondary hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-fg-secondary hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-fg-secondary">© {year} VerbaAI. Built by Ananya Mahajan.</p>
          <p className="text-xs text-fg-secondary">Made for students preparing for placements.</p>
        </div>
      </Container>
    </footer>
  );
}
