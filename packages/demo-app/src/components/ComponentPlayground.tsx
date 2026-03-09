import React, { useState } from 'react';
import { Text, Stack } from '@rhuds/components';
import { CodeBlock } from './CodeBlock';

interface ComponentPlaygroundProps {
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

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({
  title,
  description,
  code,
  children,
  props,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [showProps, setShowProps] = useState(false);

  return (
    <div style={{
      marginBottom: '3rem',
      padding: '2rem',
      background: 'rgba(10, 10, 10, 0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(41, 242, 223, 0.3)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Text variant="h2" style={{ color: '#29F2DF', marginBottom: '0.5rem' }}>
          {title}
        </Text>
        <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {description}
        </Text>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(41, 242, 223, 0.3)',
        paddingBottom: '0.5rem',
      }}>
        <button
          onClick={() => {
            setShowCode(false);
            setShowProps(false);
          }}
          style={{
            background: !showCode && !showProps ? 'rgba(41, 242, 223, 0.2)' : 'transparent',
            border: 'none',
            color: !showCode && !showProps ? '#29F2DF' : 'rgba(255, 255, 255, 0.6)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            borderRadius: '4px',
            transition: 'all 0.2s',
          }}
        >
          Preview
        </button>
        <button
          onClick={() => {
            setShowCode(true);
            setShowProps(false);
          }}
          style={{
            background: showCode ? 'rgba(41, 242, 223, 0.2)' : 'transparent',
            border: 'none',
            color: showCode ? '#29F2DF' : 'rgba(255, 255, 255, 0.6)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            borderRadius: '4px',
            transition: 'all 0.2s',
          }}
        >
          Code
        </button>
        {props && (
          <button
            onClick={() => {
              setShowCode(false);
              setShowProps(true);
            }}
            style={{
              background: showProps ? 'rgba(41, 242, 223, 0.2)' : 'transparent',
              border: 'none',
              color: showProps ? '#29F2DF' : 'rgba(255, 255, 255, 0.6)',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
              borderRadius: '4px',
              transition: 'all 0.2s',
            }}
          >
            Props
          </button>
        )}
      </div>

      {/* Content */}
      {!showCode && !showProps && (
        <div style={{
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(41, 242, 223, 0.2)',
        }}>
          {children}
        </div>
      )}

      {showCode && <CodeBlock code={code} />}

      {showProps && props && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(41, 242, 223, 0.2)',
          overflow: 'hidden',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{
                background: 'rgba(41, 242, 223, 0.1)',
                borderBottom: '1px solid rgba(41, 242, 223, 0.3)',
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#29F2DF' }}>Prop</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#29F2DF' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#29F2DF' }}>Default</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#29F2DF' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((prop, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: index < props.length - 1 ? '1px solid rgba(41, 242, 223, 0.1)' : 'none',
                  }}
                >
                  <td style={{ padding: '1rem', color: '#1C7FA6', fontFamily: 'monospace' }}>
                    {prop.name}
                  </td>
                  <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {prop.type}
                  </td>
                  <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {prop.default || '-'}
                  </td>
                  <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
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
