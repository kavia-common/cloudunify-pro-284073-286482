import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

// PUBLIC_INTERFACE
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  /** React error boundary to render a fallback UI if children throw. */
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-fallback">
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <button className="btn" onClick={this.handleReload}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
