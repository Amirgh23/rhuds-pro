import React, { useRef, useState, useCallback } from 'react';

export interface CodeEditorProps {
  value?: string;
  onChange?: (code: string) => void;
  language?: string;
  theme?: 'dark' | 'light';
  showLineNumbers?: boolean;
  disabled?: boolean;
}

const KEYWORDS: Record<string, string[]> = {
  javascript: [
    'function',
    'const',
    'let',
    'var',
    'if',
    'else',
    'for',
    'while',
    'return',
    'class',
    'import',
    'export',
  ],
  typescript: [
    'function',
    'const',
    'let',
    'var',
    'if',
    'else',
    'for',
    'while',
    'return',
    'class',
    'interface',
    'type',
    'import',
    'export',
  ],
  python: [
    'def',
    'class',
    'if',
    'else',
    'for',
    'while',
    'return',
    'import',
    'from',
    'as',
    'with',
    'try',
    'except',
  ],
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'dark',
  showLineNumbers = true,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState(value);
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set());

  const highlightCode = useCallback(
    (text: string): string => {
      let highlighted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      const keywords = KEYWORDS[language] || [];
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span style="color: #ff6b6b;">${keyword}</span>`);
      });

      highlighted = highlighted.replace(
        /\/\/.*/g,
        (match) => `<span style="color: #888;">${match}</span>`
      );
      highlighted = highlighted.replace(
        /"[^"]*"/g,
        (match) => `<span style="color: #51cf66;">${match}</span>`
      );
      highlighted = highlighted.replace(
        /'[^']*'/g,
        (match) => `<span style="color: #51cf66;">${match}</span>`
      );
      highlighted = highlighted.replace(
        /\d+/g,
        (match) => `<span style="color: #ffd93d;">${match}</span>`
      );

      return highlighted;
    },
    [language]
  );

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      onChange?.(newCode);

      if (highlightRef.current) {
        highlightRef.current.innerHTML = highlightCode(newCode);
      }

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    },
    [onChange, highlightCode]
  );

  const toggleLineExpand = useCallback(
    (lineNum: number) => {
      const newExpanded = new Set(expandedLines);
      if (newExpanded.has(lineNum)) {
        newExpanded.delete(lineNum);
      } else {
        newExpanded.add(lineNum);
      }
      setExpandedLines(newExpanded);
    },
    [expandedLines]
  );

  const lines = code.split('\n');

  return (
    <div
      style={{
        border: '1px solid #666',
        borderRadius: '8px',
        overflow: 'hidden',
        background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          background: theme === 'dark' ? '#1a1a1a' : '#e0e0e0',
          padding: '10px',
          borderBottom: '1px solid #666',
          gap: '10px',
        }}
      >
        <span style={{ color: '#aaa', fontSize: '12px' }}>{language}</span>
        <span style={{ color: '#aaa', fontSize: '12px', marginLeft: 'auto' }}>
          {lines.length} lines
        </span>
      </div>

      <div style={{ display: 'flex', position: 'relative' }}>
        {showLineNumbers && (
          <div
            style={{
              background: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
              color: '#666',
              padding: '15px 10px',
              textAlign: 'right',
              userSelect: 'none',
              borderRight: '1px solid #666',
              minWidth: '50px',
              fontSize: '12px',
              lineHeight: '1.5',
            }}
          >
            {lines.map((_, i) => (
              <div key={i} style={{ cursor: 'pointer' }} onClick={() => toggleLineExpand(i + 1)}>
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            disabled={disabled}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              padding: '15px',
              background: 'transparent',
              color: 'transparent',
              caretColor: '#00ff00',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              zIndex: 2,
              opacity: disabled ? 0.5 : 1,
            }}
          />

          <div
            ref={highlightRef}
            style={{
              position: 'relative',
              padding: '15px',
              color: theme === 'dark' ? '#fff' : '#000',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </div>
      </div>
    </div>
  );
};
