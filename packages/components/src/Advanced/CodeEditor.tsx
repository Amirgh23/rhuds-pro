import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  readOnly?: boolean;
  height?: number;
  className?: string;
}

export function CodeEditor({
  value = '',
  onChange,
  language = 'javascript',
  showLineNumbers = true,
  readOnly = false,
  height = 400,
  className = '',
}: CodeEditorProps) {
  const themeContext = useTheme();
  const [code, setCode] = useState(value);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onChange?.(newCode);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const syntaxHighlight = (code: string): string => {
    // Simple syntax highlighting
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export'],
      typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'interface', 'type'],
      python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while', 'try', 'except'],
    };

    let highlighted = code;
    const langKeywords = keywords[language as keyof typeof keywords] || [];
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span style="color: #0066cc; font-weight: bold;">${keyword}</span>`);
    });

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #008000;">$&</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*/g, '<span style="color: #808080; font-style: italic;">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #808080; font-style: italic;">$&</span>');

    return highlighted;
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        border: `1px solid ${themeContext.currentMode.colors.border}`,
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: themeContext.currentMode.colors.surface,
        height,
      }}
    >
      {/* Line numbers */}
      {showLineNumbers && (
        <div
          style={{
            padding: '16px 8px',
            backgroundColor: themeContext.currentMode.colors.background,
            borderRight: `1px solid ${themeContext.currentMode.colors.border}`,
            color: themeContext.currentMode.colors.text,
            opacity: 0.5,
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'right',
            userSelect: 'none',
            minWidth: '40px',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
      )}

      {/* Code area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Syntax highlighted preview */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '16px',
            color: themeContext.currentMode.colors.text,
            fontSize: '14px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            pointerEvents: 'none',
            overflowY: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(code) }}
        />

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            padding: '16px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'transparent',
            caretColor: themeContext.currentMode.colors.text,
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'none',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        />
      </div>
    </div>
  );
}

