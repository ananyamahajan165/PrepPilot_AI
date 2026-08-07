import { useTheme } from "../context/ThemeContext";

/** The one theme toggle control for the entire app. Both the authenticated
 * Navbar and the public Landing page's StickyNavbar render this same
 * component — there is exactly one ThemeContext and exactly one toggle UI,
 * so there's nothing to keep in sync between them; they're the same state. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-full px-3 py-1.5 text-sm font-medium bg-surface-secondary text-fg-secondary hover:text-fg transition-colors ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
