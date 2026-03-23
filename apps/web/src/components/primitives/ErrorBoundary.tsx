import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { aw, semantic } from '../../theme/tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <AlertTriangle className="h-10 w-10 mb-4" style={{ color: semantic.error }} />
        <div className="aw-section" style={{ color: aw.textStrong }}>
          Something went wrong
        </div>
        <div className="aw-body mt-2 max-w-[360px]" style={{ color: aw.textSoft }}>
          An unexpected error occurred. Please try again or return to the missions page.
        </div>
        {isDev && this.state.error && (
          <pre
            className="aw-micro mt-4 max-w-lg overflow-auto border p-4 text-left"
            style={{
              borderColor: aw.lineDark,
              backgroundColor: semantic.errorSoft,
              color: semantic.error,
            }}
          >
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        )}
        <a
          href="/missions"
          className="aw-section mt-6 inline-block border px-4 py-2 transition-colors"
          style={{
            borderColor: aw.lineDark,
            color: aw.textStrong,
          }}
        >
          Back to Missions
        </a>
      </div>
    );
  }
}
