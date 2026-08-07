import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "./shared";
import ThemeToggle from "../ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

// Colors come entirely from design tokens, so this switches theme
// automatically. The only branching left is the *scroll* state (solid bar
// vs. transparent-over-hero) — a layout concern, not a color one — and even
// the "transparent" state uses text-fg, so it reads correctly against the
// hero's own themed background instead of assuming it's always dark.
export default function StickyNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically after tapping any in-page link.
  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-surface/90 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container className="flex items-center justify-between h-16">
        <a href="#top" className="font-display text-lg font-medium tracking-tight text-fg">
          Verba<span className="text-primary italic">AI</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-fg-secondary hover:text-fg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium text-fg-secondary hover:text-fg transition-colors">
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold transition-colors rounded-full px-4 py-2 text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            Get Started
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 -mr-2 text-fg"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="md:hidden border-t border-border px-6 pb-6 pt-2 space-y-1 bg-surface">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="block py-2.5 text-sm text-fg-secondary hover:text-fg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-3">
            <Link
              to="/login"
              onClick={handleLinkClick}
              className="flex-1 text-center text-sm font-medium rounded-full py-2.5 text-fg border border-border"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={handleLinkClick}
              className="flex-1 text-center text-sm font-semibold rounded-full py-2.5 text-primary-foreground bg-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
