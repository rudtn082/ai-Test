import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
            <div className="text-red-500 text-5xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
              오류가 발생했습니다
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              예기치 않은 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mb-4 overflow-auto max-h-32 text-slate-700 dark:text-slate-300">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white px-6 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors font-medium"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
