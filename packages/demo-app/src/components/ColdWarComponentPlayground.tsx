import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface ColdWarComponentPlaygroundProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  props?: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }>;
}

export const ColdWarComponentPlayground: React.FC<ColdWarComponentPlaygroundProps> = ({
  title,
  description,
  code,
  children,
  props,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [showProps, setShowProps] = useState(false);

  return (
    <div
      style={{
        marginBottom: '3rem',
        padding: '2rem',
        background: 'var(--cw-color-surface)',
        border: '1px solid var(--cw-color-primary)',
        clipPath: 'var(--cw-chamfer-medium)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: 'var(--cw-font-size-xl)',
            fontWeight: 700,
            letterSpacing: 'var(--cw-letter-spacing-headers)',
            textTransform: 'uppercase',
            color: 'var(--cw-color-primary)',
            marginBottom: '0.5rem',
            fontFamily: 'var(--cw-font-family)',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 'var(--cw-font-size-sm)',
            color: 'var(--cw-color-text-secondary)',
            letterSpacing: 'var(--cw-letter-spacing-body)',
            fontFamily: 'var(--cw-font-family)',
          }}
        >
          {description}
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '2px solid var(--cw-color-primary)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => {
            setShowCode(false);
            setShowProps(false);
          }}
          style={{
            background: !showCode && !showProps ? 'var(--cw-color-primary)' : 'transparent',
            border: '1px solid var(--cw-color-primary)',
            color:
              !showCode && !showProps ? 'var(--cw-color-background)' : 'var(--cw-color-primary)',
            padding: '0.5rem 1.5rem',
            cursor: 'pointer',
            fontSize: 'var(--cw-font-size-sm)',
            fontWeight: 700,
            letterSpacing: 'var(--cw-letter-spacing-buttons)',
            textTransform: 'uppercase',
            fontFamily: 'var(--cw-font-family)',
            clipPath: 'var(--cw-chamfer-small)',
            transition: 'all var(--cw-animation-hover) var(--cw-ease-tactical)',
          }}
        >
          PREVIEW
        </button>
        <button
          onClick={() => {
            setShowCode(true);
            setShowProps(false);
          }}
          style={{
            background: showCode ? 'var(--cw-color-primary)' : 'transparent',
            border: '1px solid var(--cw-color-primary)',
            color: showCode ? 'var(--cw-color-background)' : 'var(--cw-color-primary)',
            padding: '0.5rem 1.5rem',
            cursor: 'pointer',
            fontSize: 'var(--cw-font-size-sm)',
            fontWeight: 700,
            letterSpacing: 'var(--cw-letter-spacing-buttons)',
            textTransform: 'uppercase',
            fontFamily: 'var(--cw-font-family)',
            clipPath: 'var(--cw-chamfer-small)',
            transition: 'all var(--cw-animation-hover) var(--cw-ease-tactical)',
          }}
        >
          CODE
        </button>
        {props && (
          <button
            onClick={() => {
              setShowCode(false);
              setShowProps(true);
            }}
            style={{
              background: showProps ? 'var(--cw-color-primary)' : 'transparent',
              border: '1px solid var(--cw-color-primary)',
              color: showProps ? 'var(--cw-color-background)' : 'var(--cw-color-primary)',
              padding: '0.5rem 1.5rem',
              cursor: 'pointer',
              fontSize: 'var(--cw-font-size-sm)',
              fontWeight: 700,
              letterSpacing: 'var(--cw-letter-spacing-buttons)',
              textTransform: 'uppercase',
              fontFamily: 'var(--cw-font-family)',
              clipPath: 'var(--cw-chamfer-small)',
              transition: 'all var(--cw-animation-hover) var(--cw-ease-tactical)',
            }}
          >
            PROPS
          </button>
        )}
      </div>

      {/* Content */}
      {!showCode && !showProps && (
        <div
          style={{
            padding: '2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--cw-color-primary)',
            clipPath: 'var(--cw-chamfer-small)',
          }}
        >
          {children}
        </div>
      )}

      {showCode && (
        <div
          style={{
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--cw-color-primary)',
            clipPath: 'var(--cw-chamfer-small)',
            fontFamily: 'var(--cw-font-family)',
            fontSize: 'var(--cw-font-size-sm)',
            color: 'var(--cw-color-primary)',
            overflow: 'auto',
            maxHeight: '400px',
            lineHeight: '1.6',
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{code}</code>
          </pre>
        </div>
      )}

      {showProps && props && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--cw-color-primary)',
            clipPath: 'var(--cw-chamfer-small)',
            overflow: 'hidden',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--cw-font-family)',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'var(--cw-color-primary)',
                  borderBottom: '2px solid var(--cw-color-primary)',
                }}
              >
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--cw-color-background)',
                    fontSize: 'var(--cw-font-size-sm)',
                    fontWeight: 700,
                    letterSpacing: 'var(--cw-letter-spacing-headers)',
                    textTransform: 'uppercase',
                  }}
                >
                  PROP
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--cw-color-background)',
                    fontSize: 'var(--cw-font-size-sm)',
                    fontWeight: 700,
                    letterSpacing: 'var(--cw-letter-spacing-headers)',
                    textTransform: 'uppercase',
                  }}
                >
                  TYPE
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--cw-color-background)',
                    fontSize: 'var(--cw-font-size-sm)',
                    fontWeight: 700,
                    letterSpacing: 'var(--cw-letter-spacing-headers)',
                    textTransform: 'uppercase',
                  }}
                >
                  DEFAULT
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--cw-color-background)',
                    fontSize: 'var(--cw-font-size-sm)',
                    fontWeight: 700,
                    letterSpacing: 'var(--cw-letter-spacing-headers)',
                    textTransform: 'uppercase',
                  }}
                >
                  DESCRIPTION
                </th>
              </tr>
            </thead>
            <tbody>
              {props.map((prop, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      index < props.length - 1 ? '1px solid var(--cw-color-primary)' : 'none',
                    background: index % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                  }}
                >
                  <td
                    style={{
                      padding: '1rem',
                      color: 'var(--cw-color-primary)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                    }}
                  >
                    {prop.name}
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: 'var(--cw-color-text-secondary)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--cw-font-size-xs)',
                    }}
                  >
                    {prop.type}
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: 'var(--cw-color-text-tertiary)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--cw-font-size-xs)',
                    }}
                  >
                    {prop.default || '-'}
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: 'var(--cw-color-text-secondary)',
                      fontSize: 'var(--cw-font-size-sm)',
                    }}
                  >
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
