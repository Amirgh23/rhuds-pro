import React, { useState, useCallback, useEffect } from 'react';
import './InteractivePlayground.css';
import { PlaygroundEditor } from './playground/PlaygroundEditor';
import { PlaygroundPreview } from './playground/PlaygroundPreview';
import { ComponentLibrary } from './playground/ComponentLibrary';
import { PropController } from './playground/PropController';
import { PlaygroundConsole } from './playground/PlaygroundConsole';
import { PerformanceMonitor } from './playground/PerformanceMonitor';
import { useConsoleCapture, ConsoleMessage } from './playground/hooks/useConsoleCapture';
import { usePerformanceMonitor } from './playground/hooks/usePerformanceMonitor';

const DEFAULT_CODE = `export default function Example() {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#29F2DF', marginBottom: '15px' }}>
        Welcome to RHUDS Playground
      </h3>
      <p style={{ color: '#a8dadc', marginBottom: '20px' }}>
        Edit the code to see changes in real-time
      </p>
      <p style={{ fontSize: '12px', color: '#888' }}>
        All RHUDS components are available in scope
      </p>
    </div>
  );
}`;

const STORAGE_KEY = 'rhuds-playground-code';

export default function InteractivePlayground() {
  const [code, setCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || DEFAULT_CODE;
    }
    return DEFAULT_CODE;
  });
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [props, setProps] = useState<Record<string, any>>({});
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('split');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const { messages, clearMessages } = useConsoleCapture((msg) => {
    setConsoleMessages((prev) => {
      // Keep only last 100 messages to prevent memory issues
      const updated = [...prev, msg];
      return updated.length > 100 ? updated.slice(-100) : updated;
    });
  });

  const { getMetrics } = usePerformanceMonitor();

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code]);

  const handleInsertComponent = useCallback((componentCode: string) => {
    setCode((prev) => prev + '\n\n' + componentCode);
    // Trigger re-render after inserting component
    setTimeout(() => {
      setRenderTrigger((prev) => prev + 1);
    }, 100);
  }, []);

  const handlePropChange = useCallback((key: string, value: any) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
    setProps({});
    clearMessages();
    localStorage.removeItem(STORAGE_KEY);
  }, [clearMessages]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  const handleDownloadCode = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'component.tsx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [code]);

  const handleGenerateShareLink = useCallback(() => {
    const encoded = btoa(code);
    const link = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  }, [code]);

  const handleToggleFullscreen = useCallback(() => {
    setFullscreen(!fullscreen);
  }, [fullscreen]);

  const handleRunCode = useCallback(() => {
    setRenderTrigger((prev) => prev + 1);
  }, []);

  // Keyboard shortcut: Ctrl+Enter to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunCode]);

  return (
    <div className={`playground ${theme} ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="playground-header">
        <div className="playground-title">
          <h1>RHUDS Interactive Playground</h1>
          <p>Test and customize components before adding to your project</p>
        </div>
        <div className="playground-controls">
          <button
            className={`layout-btn ${layout === 'split' ? 'active' : ''}`}
            onClick={() => setLayout('split')}
            title="Split View"
          >
            ⊞⊞
          </button>
          <button
            className={`layout-btn ${layout === 'editor' ? 'active' : ''}`}
            onClick={() => setLayout('editor')}
            title="Editor Only"
          >
            ⊞
          </button>
          <button
            className={`layout-btn ${layout === 'preview' ? 'active' : ''}`}
            onClick={() => setLayout('preview')}
            title="Preview Only"
          >
            ⊞
          </button>
          <div className="divider" />
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Theme"
          >
            🌙
          </button>
          <button
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light Theme"
          >
            ☀️
          </button>
          <div className="divider" />
          <button
            className={`toggle-btn ${showConsole ? 'active' : ''}`}
            onClick={() => setShowConsole(!showConsole)}
            title="Toggle Console"
          >
            💻 Console
          </button>
          <button
            className={`toggle-btn ${showPerformance ? 'active' : ''}`}
            onClick={() => setShowPerformance(!showPerformance)}
            title="Toggle Performance"
          >
            ⚡ Perf
          </button>
          <button
            className={`toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            ≡ Sidebar
          </button>
          <div className="divider" />
          <button
            className="action-btn run-btn"
            onClick={handleRunCode}
            title="Run Code (Ctrl+Enter)"
          >
            ▶️ Run
          </button>
          <button className="action-btn" onClick={handleCopyCode} title="Copy Code">
            📋 Copy
          </button>
          <button className="action-btn" onClick={handleDownloadCode} title="Download Code">
            ⬇️ Download
          </button>
          <button className="action-btn" onClick={handleGenerateShareLink} title="Share Link">
            🔗 Share
          </button>
          <button className="action-btn" onClick={handleReset} title="Reset to Default">
            🔄 Reset
          </button>
          <button
            className="action-btn fullscreen-btn"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
          >
            {fullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`playground-content layout-${layout}`}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="playground-sidebar">
            <ComponentLibrary
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onInsertComponent={handleInsertComponent}
            />
          </aside>
        )}

        {/* Editor Section */}
        {(layout === 'split' || layout === 'editor') && (
          <div className="playground-editor-section">
            <PlaygroundEditor code={code} onChange={setCode} />
            {showPerformance && (
              <PerformanceMonitor metrics={getMetrics()} isVisible={showPerformance} />
            )}
          </div>
        )}

        {/* Preview Section */}
        {(layout === 'split' || layout === 'preview') && (
          <div className="playground-preview-section">
            <PlaygroundPreview code={code} renderTrigger={renderTrigger} />
          </div>
        )}
      </div>

      {/* Console */}
      {showConsole && (
        <PlaygroundConsole
          messages={consoleMessages}
          onClear={() => {
            setConsoleMessages([]);
            clearMessages();
          }}
        />
      )}

      {/* Props Panel */}
      {selectedComponent && (
        <div className="playground-props-panel">
          <PropController component={selectedComponent} props={props} onChange={handlePropChange} />
        </div>
      )}
    </div>
  );
}
