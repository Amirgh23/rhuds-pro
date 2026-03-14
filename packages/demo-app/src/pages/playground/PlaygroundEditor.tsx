import React, { useCallback } from 'react';
import './PlaygroundEditor.css';

interface PlaygroundEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function PlaygroundEditor({ code, onChange }: PlaygroundEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.substring(0, start) + '\t' + code.substring(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    },
    [code, onChange]
  );

  return (
    <div className="playground-editor">
      <div className="editor-header">
        <span className="editor-icon">⚡</span>
        <span className="editor-title">Code Editor</span>
      </div>
      <textarea
        className="editor-textarea"
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
    </div>
  );
}
