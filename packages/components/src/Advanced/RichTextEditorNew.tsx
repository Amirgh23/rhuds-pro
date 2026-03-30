import React, { useRef, useState, useCallback } from 'react';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onExport?: (markdown: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter text...',
  disabled = false,
  onExport,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(value);
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const text = e.currentTarget.innerHTML;
      setContent(text);
      onChange?.(text);
    },
    [onChange]
  );

  const exportMarkdown = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    let markdown = html
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<ul>(.*?)<\/ul>/g, (match, content) => {
        return content.replace(/<li>(.*?)<\/li>/g, '- $1\n');
      })
      .replace(/<ol>(.*?)<\/ol>/g, (match, content) => {
        return content.replace(/<li>(.*?)<\/li>/g, '1. $1\n');
      })
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<img src="(.*?)" alt="(.*?)">/g, '![$2]($1)')
      .replace(/<[^>]*>/g, '');

    onExport?.(markdown);
    return markdown;
  }, [onExport]);

  const importMarkdown = useCallback(
    (markdown: string) => {
      let html = markdown
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/^- (.*?)$/gm, '<li>$1</li>')
        .replace(/^1\. (.*?)$/gm, '<li>$1</li>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        setContent(html);
        onChange?.(html);
      }
    },
    [onChange]
  );

  return (
    <div style={{ border: '1px solid #666', borderRadius: '8px', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: '5px',
          padding: '10px',
          background: '#1a1a1a',
          borderBottom: '1px solid #666',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => applyFormat('bold')}
          style={{
            padding: '5px 10px',
            background: selectedFormat === 'bold' ? '#00ff00' : '#333',
            color: selectedFormat === 'bold' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          style={{
            padding: '5px 10px',
            background: selectedFormat === 'italic' ? '#00ff00' : '#333',
            color: selectedFormat === 'italic' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <i>I</i>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          style={{
            padding: '5px 10px',
            background: selectedFormat === 'underline' ? '#00ff00' : '#333',
            color: selectedFormat === 'underline' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => applyFormat('insertUnorderedList')}
          style={{
            padding: '5px 10px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          • List
        </button>
        <button
          onClick={() => applyFormat('insertOrderedList')}
          style={{
            padding: '5px 10px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          1. List
        </button>
        <button
          onClick={exportMarkdown}
          style={{
            padding: '5px 10px',
            background: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Export MD
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        style={{
          padding: '15px',
          minHeight: '200px',
          background: '#0a0a0a',
          color: '#fff',
          outline: 'none',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        suppressContentEditableWarning
      >
        {!value && <span style={{ color: '#666' }}>{placeholder}</span>}
      </div>
    </div>
  );
};
