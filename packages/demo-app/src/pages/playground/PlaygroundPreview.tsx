import React, { useState, useEffect, Suspense } from 'react';
import { HudBox } from '@rhuds/components';
import * as RhudsComponents from '@rhuds/components';
import './PlaygroundPreview.css';

// Load Babel Standalone for JSX transpilation at runtime
declare global {
  interface Window {
    Babel?: any;
  }
}

// Transpile JSX code to JavaScript using Babel
async function transpileJSXWithBabel(code: string): Promise<string> {
  // Load Babel if not already loaded
  if (!window.Babel) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        try {
          resolve(transpileJSXWithBabel(code));
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = () => reject(new Error('Failed to load Babel'));
      document.head.appendChild(script);
    });
  }

  try {
    // Check if code looks like multiple JSX elements or statements
    // If so, wrap in a fragment
    let codeToTranspile = code;

    // If code starts with < and contains multiple top-level JSX elements, wrap in fragment
    if (code.trim().startsWith('<') && !code.trim().startsWith('<>')) {
      const jsxCount = (code.match(/^<\w+/gm) || []).length;
      if (jsxCount > 1) {
        codeToTranspile = `<>${code}</>`;
      }
    }

    const result = window.Babel.transform(codeToTranspile, {
      presets: ['react'],
      filename: 'component.jsx',
      parserOpts: {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
      },
    });
    return result.code;
  } catch (err) {
    throw new Error(
      `JSX transpilation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

interface PlaygroundPreviewProps {
  code: string;
  renderTrigger: number;
}

// Error Boundary Component
class ErrorBoundaryComponent extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="preview-error">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Component Error</div>
          <div className="error-message">{this.state.error?.message}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function PlaygroundPreview({ code, renderTrigger }: PlaygroundPreviewProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const executeCode = async () => {
      setIsLoading(true);
      setError(null);
      setComponent(null);

      try {
        if (!code.trim()) {
          setComponent(null);
          setIsLoading(false);
          return;
        }

        // Remove 'export default' if present
        let cleanCode = code.replace(/export\s+default\s+/, '').trim();

        // Transpile JSX to JavaScript
        let transpiledCode: string;
        try {
          transpiledCode = await transpileJSXWithBabel(cleanCode);
        } catch (transpileErr) {
          throw new Error(
            `Failed to transpile code: ${transpileErr instanceof Error ? transpileErr.message : String(transpileErr)}`
          );
        }

        // Create a wrapper component that uses eval to execute the code
        const ComponentFn = () => {
          // Create scope with all components and React
          const scope = {
            React,
            ...RhudsComponents,
          };

          // Create variable declarations for all scope items
          const varDeclarations = Object.keys(scope)
            .map((key) => `const ${key} = scope['${key}'];`)
            .join('\n');

          // Wrap transpiled code in a function that captures the result
          // The transpiled code is usually a React.createElement call
          // We need to wrap it so it returns the result
          const wrappedCode = `
            (function() {
              ${varDeclarations}
              
              return (function() {
                return ${transpiledCode}
              })();
            })()
          `;

          // Execute the code with error handling
          try {
            const result = eval(wrappedCode);
            return result;
          } catch (evalErr) {
            throw evalErr instanceof Error ? evalErr : new Error(String(evalErr));
          }
        };

        // Test the component by trying to render it
        try {
          const testResult = ComponentFn();
          if (!testResult) {
            throw new Error(
              'Component returned nothing - make sure your code returns a valid JSX element'
            );
          }
        } catch (testErr) {
          const errorMsg = testErr instanceof Error ? testErr.message : String(testErr);
          throw new Error(`Component execution failed: ${errorMsg}`);
        }

        setComponent(() => ComponentFn);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Add timeout to prevent infinite hanging
    let timeoutId: ReturnType<typeof setTimeout>;
    const executeWithTimeout = async () => {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError(
          'Code execution timeout - your code may have an infinite loop or is taking too long'
        );
      }, 10000);

      try {
        await executeCode();
      } finally {
        clearTimeout(timeoutId);
      }
    };

    executeWithTimeout();
  }, [code, renderTrigger]);

  return (
    <div className="playground-preview">
      <div className="preview-header">
        <span className="preview-icon">👁️</span>
        <span className="preview-title">Live Preview</span>
        {isLoading && <span className="preview-loading">⏳ Rendering...</span>}
      </div>
      <div className="preview-content">
        <div className="preview-render">
          {error ? (
            <div className="preview-error">
              <div className="error-icon">⚠️</div>
              <div className="error-title">Render Error</div>
              <div className="error-message">{error}</div>
            </div>
          ) : Component ? (
            <ErrorBoundaryComponent>
              <Suspense fallback={<div className="preview-loading">Loading...</div>}>
                <Component />
              </Suspense>
            </ErrorBoundaryComponent>
          ) : (
            <HudBox variant="tech-panel" color="#29F2DF" animated width="100%">
              <div style={{ padding: '20px', textAlign: 'center', color: '#a8dadc' }}>
                <p>Enter code in the editor to see preview</p>
              </div>
            </HudBox>
          )}
        </div>
      </div>
    </div>
  );
}
