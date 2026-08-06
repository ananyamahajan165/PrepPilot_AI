import { Link } from "react-router-dom";

// Deliberately standalone — not wrapped in the authenticated <Layout> (which
// assumes a logged-in user and shows the app navbar) since this route
// matches for anyone, logged in or not, who hits a bad/typo'd URL.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center px-6 text-center">
      <Link to="/" className="text-lg font-bold text-primary-hover mb-8">
        VerbaAI
      </Link>
      <p className="text-7xl font-bold text-border select-none">404</p>
      <h1 className="text-xl font-semibold text-fg mt-2">Page not found</h1>
      <p className="text-fg-muted mt-2 max-w-sm">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-md px-5 py-2.5"
        >
          Go home
        </Link>
        <Link
          to="/dashboard"
          className="text-sm font-medium text-primary-hover border border-primary/30 hover:bg-primary/10 transition-colors rounded-md px-5 py-2.5"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
