/**
 * Error Handler
 * Handles and isolates errors in chart rendering
 */

export interface ErrorContext {
  component: string;
  operation: string;
  error: Error;
  timestamp: number;
}

export class ErrorHandler {
  private errors: ErrorContext[] = [];
  private maxErrors: number = 100;
  private onError?: (context: ErrorContext) => void;

  constructor(onError?: (context: ErrorContext) => void) {
    this.onError = onError;
  }

  /**
   * Handle error with isolation
   */
  handle(component: string, operation: string, error: Error): void {
    const context: ErrorContext = {
      component,
      operation,
      error,
      timestamp: Date.now(),
    };

    this.errors.push(context);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error
    console.error(`[${component}] ${operation}:`, error);

    // Call error callback
    if (this.onError) {
      try {
        this.onError(context);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    }
  }

  /**
   * Execute function with error isolation
   */
  isolate<T>(component: string, operation: string, fn: () => T, fallback?: T): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.handle(component, operation, error instanceof Error ? error : new Error(String(error)));
      return fallback;
    }
  }

  /**
   * Execute async function with error isolation
   */
  async isolateAsync<T>(
    component: string,
    operation: string,
    fn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handle(component, operation, error instanceof Error ? error : new Error(String(error)));
      return fallback;
    }
  }

  /**
   * Get all errors
   */
  getErrors(): ErrorContext[] {
    return [...this.errors];
  }

  /**
   * Get errors for component
   */
  getComponentErrors(component: string): ErrorContext[] {
    return this.errors.filter((e) => e.component === component);
  }

  /**
   * Clear errors
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Check if there are errors
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

export default ErrorHandler;
