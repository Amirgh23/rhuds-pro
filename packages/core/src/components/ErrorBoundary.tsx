/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '20px',
              border: '2px solid #ff0000',
              borderRadius: '4px',
              backgroundColor: '#ffe0e0',
              color: '#cc0000',
              fontFamily: 'monospace',
            }}
          >
            <h2>Something went wrong</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</details>
          </div>
        )
      );
    }

    return this.props.children as ReactElement;
  }
}

export default ErrorBoundary;
