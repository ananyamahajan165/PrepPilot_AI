import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches render-time JS errors anywhere in the tree below it and shows a
 * friendly fallback instead of a blank white screen. This app uses plain
 * <BrowserRouter>/<Routes> (not the data-router API), so react-router's
 * `errorElement` isn't available — a classic class-based boundary is the
 * only mechanism React currently offers for this. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 0 0 4 21h16a2 2 0 0 0 1.89-2.96L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-fg">Something went wrong</h1>
        <p className="text-fg-muted mt-2 max-w-sm">
          An unexpected error occurred. You can try reloading the page — if this keeps happening,
          let us know via the feedback option.
        </p>
        <button
          onClick={this.handleReload}
          className="mt-6 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-md px-5 py-2.5"
        >
          Reload VerbaAI
        </button>
      </div>
    );
  }
}
