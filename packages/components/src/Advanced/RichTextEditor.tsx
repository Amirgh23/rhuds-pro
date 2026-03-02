import React, { useState, useRef } from 'react';
import { useTheme } from '@rhuds/core';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  className?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  height = 300,
  className = '',
}: RichTextEditorProps) {
  const theme = useTheme();
  const [content, setContent] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: 'B', command: 'bold', title: 'Bold' },
    { icon: 'I', command: 'italic', title: 'Italic' },
    { icon: 'U', command: 'underline', title: 'Underline' },
    { icon: '≡', command: 'justifyLeft', title: 'Align Left' },
    { icon: '≣', command: 'justifyCenter', title: 'Align Center' },
    { icon: '⋮', command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: '⋯', command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <div className={className} style={{ opacity: disabled ? 0.5 : 1 }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px',
          backgroundColor: theme.currentMode.colors.surface,
          borderBottom: `1px solid ${theme.currentMode.colors.border}`,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      >
        {toolbarButtons.map((btn) => (
          <button
            key={btn.command}
            onClick={() => execCommand(btn.command)}
            disabled={disabled}
            title={btn.title}
            style={{
              padding: '6px 12px',
              border: `1px solid ${theme.currentMode.colors.border}`,
              borderRadius: '4px',
              backgroundColor: theme.currentMode.colors.background,
              color: theme.currentMode.colors.text,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {btn.icon}
          </button>
        ))}
        
        <button
          onClick={insertLink}
          disabled={disabled}
          title="Insert Link"
          style={{
            padding: '6px 12px',
            border: `1px solid ${theme.currentMode.colors.border}`,
            borderRadius: '4px',
            backgroundColor: theme.currentMode.colors.background,
            color: theme.currentMode.colors.text,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          🔗
        </button>

        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          disabled={disabled}
          style={{
            padding: '6px',
            border: `1px solid ${theme.currentMode.colors.border}`,
            borderRadius: '4px',
            backgroundColor: theme.currentMode.colors.background,
            color: theme.currentMode.colors.text,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          minHeight: height,
          padding: '16px',
          border: `1px solid ${theme.currentMode.colors.border}`,
          borderTop: 'none',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          backgroundColor: theme.currentMode.colors.background,
          color: theme.currentMode.colors.text,
          outline: 'none',
          overflowY: 'auto',
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

