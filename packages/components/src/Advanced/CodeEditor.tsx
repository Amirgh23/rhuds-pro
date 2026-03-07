import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json' | 'cpp';
  showLineNumbers?: boolean;
  readOnly?: boolean;
  height?: number;
  className?: string;
  title?: string;
}

const StyledWrapper = styled.div<{ height: number }>`
  .card {
    width: 100%;
    height: ${props => props.height}px;
    background: #0a0e1a;
    border: 2px solid #29F2DF;
    font-size: 14px;
    font-family: 'Courier New', monospace;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px rgba(41, 242, 223, 0.3);
  }

  .titlebar {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    font-size: 12px;
    background-color: #0d1520;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 35px;
    border-bottom: 1px solid #29F2DF;
  }

  .title-text {
    color: #29F2DF;
    font-size: 12px;
  }

  .buttons {
    display: flex;
  }

  .card button {
    width: 40px;
    height: 35px;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  button svg path, button svg rect, button svg polygon {
    fill: #29F2DF;
  }

  button svg {
    width: 10px;
    height: 10px;
  }

  .close:hover {
    background-color: rgba(255, 0, 100, 0.3);
  }

  .code-container {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .line-numbers {
    padding: 10px 8px;
    background-color: #060a12;
    border-right: 1px solid #29F2DF;
    color: #29F2DF;
    opacity: 0.6;
    font-size: 14px;
    text-align: right;
    user-select: none;
    min-width: 50px;
  }

  .editor-area {
    flex: 1;
    position: relative;
  }

  .code-display {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
    color: #bafff8;
    font-size: 14px;
    white-space: pre;
    pointer-events: none;
    overflow: auto;
    line-height: 1.5;
  }

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    border: none;
    background: transparent;
    color: transparent;
    caret-color: #29F2DF;
    font-size: 14px;
    resize: none;
    line-height: 1.5;
  }

  .keyword { color: #ff4284; }
  .string { color: #22ff00; }
  .number { color: #ffae00; }
  .function { color: #4281ff; }
  .operator { color: #29F2DF; }
  .bracket { color: #EF3EF1; }
  .rounds { color: #ffffff; }
  .semicolon { color: #e600ff; }
  .variable { color: #ffae00; }
  .property { color: #bafff8; }
`;

export function CodeEditor({
  value = '',
  onChange,
  showLineNumbers = true,
  readOnly = false,
  height = 300,
  className = '',
  title = 'Code Editor',
}: CodeEditorProps) {
  const [code, setCode] = useState(value);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(value);
  }, [value]);

  useEffect(() => {
    setLineCount(code.split('\n').length);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
  };

  const syntaxHighlight = (code: string): string => {
    // Escape HTML first
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // C++ Keywords (int, void, using, return, etc.)
    highlighted = highlighted.replace(
      /\b(int|void|using|return|namespace|include|if|else|for|while|do|switch|case|break|continue|const|static|class|struct|public|private|protected|virtual|override|template|typename|auto|bool|char|double|float|long|short|unsigned|signed)\b/g,
      '<span class="keyword">$1</span>'
    );

    // Strings (including #include <...>)
    highlighted = highlighted.replace(
      /(#include\s+&lt;[^&]+&gt;|"[^"]*")/g,
      '<span class="string">$1</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="number">$1</span>'
    );

    // Functions (word followed by parenthesis)
    highlighted = highlighted.replace(
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
      '<span class="function">$1</span>'
    );

    // Properties (cout, cin, std, endl)
    highlighted = highlighted.replace(
      /\b(cout|cin|std|endl|cerr|string|vector|map|set|list|queue|stack|pair)\b/g,
      '<span class="property">$1</span>'
    );

    // Stream operators (<< >>)
    highlighted = highlighted.replace(
      /(&lt;&lt;|&gt;&gt;)/g,
      '<span class="rounds">$1</span>'
    );

    // Operators (=, +, -, *, /, %, etc.)
    highlighted = highlighted.replace(
      /([+\-*/%=!<>]+)/g,
      '<span class="operator">$1</span>'
    );

    // Curly brackets
    highlighted = highlighted.replace(
      /([{}])/g,
      '<span class="bracket">$1</span>'
    );

    // Parentheses
    highlighted = highlighted.replace(
      /([()])/g,
      '<span class="rounds">$1</span>'
    );

    // Semicolons
    highlighted = highlighted.replace(
      /(;)/g,
      '<span class="semicolon">$1</span>'
    );

    return highlighted;
  };

  return (
    <StyledWrapper height={height} className={className}>
      <div className="card">
        <div className="titlebar">
          <span className="title-text">{title}</span>
          <span className="buttons">
            <button className="minimize">
              <svg viewBox="0 0 10.2 1">
                <rect x={0} y="50%" width="10.2" height={1} />
              </svg>
            </button>
            <button className="maximize">
              <svg viewBox="0 0 10 10">
                <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
              </svg>
            </button>
            <button className="close">
              <svg viewBox="0 0 10 10">
                <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
              </svg>
            </button>
          </span>
        </div>
        <div className="code-container">
          {showLineNumbers && (
            <div className="line-numbers">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
          )}
          <div className="editor-area">
            <div
              className="code-display"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(code) }}
            />
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleChange}
              readOnly={readOnly}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}
