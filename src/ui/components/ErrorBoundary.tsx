import { Component, type ErrorInfo, type ReactNode } from 'react';

export function ErrorFallback() {
  return (
    <main className="not-found">
      <span className="eyebrow">THE MINIMALIST</span>
      <h1>A moment of pause.</h1>
      <p>Something didn’t load as expected.</p>
      <button className="text-button" onClick={() => window.location.reload()}>
        Reload the page ↗
      </button>
    </main>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The Minimalist could not render.', error, info.componentStack);
  }
  render() {
    return this.state.failed ? <ErrorFallback /> : this.props.children;
  }
}
