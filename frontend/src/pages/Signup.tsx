import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import GoogleButton from "../components/auth/GoogleButton";

export default function Signup() {
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Same as Login.tsx — a failed Google attempt redirects back here with
  // ?error=... rather than a normal caught request/response.
  useEffect(() => {
    if (searchParams.get("error") === "google_auth_failed") {
      setError("Google sign-in didn't complete. Please try again.");
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(name, email, password, false);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 ${theme === "dark" ? "bg-background" : "bg-surface-secondary"}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`absolute top-6 right-6 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          theme === "dark"
            ? "bg-card text-fg hover:bg-surface-secondary"
            : "bg-card text-fg-secondary border border-border hover:bg-surface-secondary"
        }`}
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
      <Link to="/" className={"font-display text-xl font-medium mb-8 text-fg"}>
        Verba<span className="text-primary italic">AI</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm rounded-2xl p-8 border ${theme === "dark" ? "bg-card border-border" : "bg-card border-border shadow-sm"}`}
      >
        <h1 className={"font-display text-2xl font-medium mb-1 text-fg"}>Create your account</h1>
        <p className={"text-sm mb-6 text-fg-secondary"}>Start practicing with VerbaAI</p>

        {error && (
          <p role="alert" className="mb-4 text-sm text-rose-400 bg-rose-400/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <GoogleButton label="Continue with Google" />

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-fg-muted">or</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <label htmlFor="signup-name" className={"block text-sm font-medium mb-1.5 text-fg-secondary"}>
          Name
        </label>
        <input
          id="signup-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 mb-4 text-sm text-fg focus:outline-none focus:border-primary/60"
        />

        <label htmlFor="signup-email" className={"block text-sm font-medium mb-1.5 text-fg-secondary"}>
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 mb-4 text-sm text-fg focus:outline-none focus:border-primary/60"
        />

        <label htmlFor="signup-password" className={"block text-sm font-medium mb-1.5 text-fg-secondary"}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full rounded-md px-3 py-2 mb-6 text-sm focus:outline-none ${theme === "dark" ? "bg-background border border-border text-fg focus:border-primary/60" : "bg-surface-secondary border border-border text-fg focus:border-primary"}`}
        />

        <button
          type="submit"
          disabled={submitting}
          className={"w-full rounded-full py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 bg-primary hover:bg-primary-hover text-primary-foreground"}
        >
          {submitting ? "Creating account…" : "Sign Up"}
        </button>

        <p className={"text-sm mt-5 text-center text-fg-secondary"}>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:text-primary-hover">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
