import React, { useState } from 'react';
import { Button, Text } from '@rhuds/components';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.5)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          borderBottom: '1px solid rgba(41, 242, 223, 0.3)',
        }}
      >
        <Text variant="caption" style={{ color: '#29F2DF' }}>
          {language}
        </Text>
        <Button
          variant="secondary"
          onClick={handleCopy}
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.7)',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          border: '1px solid rgba(41, 242, 223, 0.3)',
          borderTop: 'none',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      >
        <code style={{ color: '#e0e0e0' }}>{code}</code>
      </pre>
    </div>
  );
};
