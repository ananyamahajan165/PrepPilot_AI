import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/communication-coach", label: "Communication Coach" },
  { to: "/interview", label: "Interview" },
  { to: "/resume", label: "Resume" },
  { to: "/profile", label: "Profile" },
];

// Single navbar shell for every authenticated page. Colors come entirely
// from design tokens (bg-surface, text-fg, border-border, bg-primary), so
// it switches theme automatically with the rest of the app — no manual
// theme === "dark" branching needed.
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function linkClass({ isActive }: { isActive: boolean }) {
    return `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-surface-secondary text-primary" : "text-fg-secondary hover:text-fg"
    }`;
  }

  return (
    <nav className="bg-surface border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-medium text-fg">
            Verba<span className="text-accent italic">AI</span>
          </span>
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm hidden sm:inline text-fg-secondary">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-danger hover:opacity-80 transition-opacity"
          >
            Logout
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-1.5 -mr-1.5 text-fg-secondary"
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
      </div>

      {menuOpen && (
        <div className="md:hidden pt-3 pb-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block" }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
