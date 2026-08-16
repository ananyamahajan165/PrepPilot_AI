import { useState } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.1-5.1C33.9 6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 5.9 4.3C13.8 15.4 18.5 12.4 24 12.4c3.1 0 5.9 1.1 8 3.1l5.1-5.1C33.9 6 29.2 4 24 4c-7.6 0-14.1 4.3-17.7 10.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.1c-2 1.4-4.6 2.2-7.2 2.2-5.3 0-9.7-3.4-11.3-8l-6.1 4.7C9.9 39.7 16.4 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.1 5.1C40.9 35.2 44 30 44 24c0-1.2-.1-2.4-.4-3.5Z"
      />
    </svg>
  );
}

export default function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    const apiBase = import.meta.env.VITE_API_URL || "/api";
    window.location.href = `${apiBase}/auth/google`;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 border border-border rounded-md py-2.5 text-sm font-medium text-fg bg-card hover:border-primary/60 disabled:opacity-60 transition-colors"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-fg-secondary border-t-transparent rounded-full animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      {loading ? "Redirecting…" : label}
    </button>
  );
}
