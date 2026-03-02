import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Stack, Button, Container } from '@rhuds/components';
import { ComponentPlayground } from '../components/ComponentPlayground';

const docs = {
  'getting-started': {
    title: 'Getting Started',
    content: `# Getting Started

Get up and running with RHUDS in minutes.

## Installation

\`\`\`bash
npm install @rhuds/core @rhuds/components
\`\`\`

## Basic Setup

1. Wrap your app with providers
2. Import and use components
3. Customize your theme

## Quick Example

See the playground below for a working example.`,
  },
  'button': {
    title: 'Button Component',
    content: 'Interactive button with multiple variants and states.',
  },
  'input': {
    title: 'Input Component',
    content: 'Text input field with label and error support.',
  },
  'select': {
    title: 'Select Component',
    content: 'Dropdown select with searchable options.',
  },
  'modal': {
    title: 'Modal Component',
    content: 'Modal dialog with backdrop and animations.',
  },
  'table': {
    title: 'Table Component',
    content: 'Data table with sorting and pagination.',
  },
};

export const DocsPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const [selectedDoc, setSelectedDoc] = useState(section || 'getting-started');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRight: '1px solid rgba(0, 246, 255, 0.3)',
        padding: '2rem 1rem',
        overflowY: 'auto',
      }}>
        <Text variant="h3" style={{ color: '#00f6ff', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
          Documentation
        </Text>

        <div style={{ marginBottom: '2rem' }}>
          <Text variant="caption" style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            marginBottom: '0.5rem',
            paddingLeft: '1rem',
            display: 'block',
          }}>
            GETTING STARTED
          </Text>
          <Link to="/docs/getting-started" style={{ textDecoration: 'none' }}>
            <button
              onClick={() => setSelectedDoc('getting-started')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                background: selectedDoc === 'getting-started' ? 'rgba(0, 246, 255, 0.2)' : 'transparent',
                border: 'none',
                color: selectedDoc === 'getting-started' ? '#00f6ff' : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s',
              }}
            >
              Getting Started
            </button>
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <Text variant="caption" style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            marginBottom: '0.5rem',
            paddingLeft: '1rem',
            display: 'block',
          }}>
            COMPONENTS
          </Text>
          {['button', 'input', 'select', 'modal', 'table'].map((doc) => (
            <Link key={doc} to={`/docs/${doc}`} style={{ textDecoration: 'none' }}>
              <button
                onClick={() => setSelectedDoc(doc)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  background: selectedDoc === doc ? 'rgba(0, 246, 255, 0.2)' : 'transparent',
                  border: 'none',
                  color: selectedDoc === doc ? '#00f6ff' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}
              >
                {doc}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Container maxWidth="1200px" style={{ padding: '3rem 2rem' }}>
          <Text variant="h1" style={{ color: '#00f6ff', marginBottom: '2rem' }}>
            {docs[selectedDoc as keyof typeof docs].title}
          </Text>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            whiteSpace: 'pre-wrap',
          }}>
            {docs[selectedDoc as keyof typeof docs].content}
          </div>

          {/* Component Playgrounds */}
          {selectedDoc === 'button' && (
            <ComponentPlayground
              title="Button Variants"
              description="Buttons come in multiple variants for different use cases."
              code={`import { Button } from '@rhuds/components';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>`}
              props={[
                { name: 'variant', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Button style variant' },
                { name: 'onClick', type: '() => void', description: 'Click handler' },
                { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
                { name: 'children', type: 'ReactNode', description: 'Button content' },
              ]}
            >
              <Stack direction="row" gap="1rem">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'getting-started' && (
            <ComponentPlayground
              title="Quick Start Example"
              description="A complete example showing theme setup and component usage."
              code={`import { ThemeProvider, BleepsProvider } from '@rhuds/core';
import { Button, Text } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider>
      <BleepsProvider>
        <Text variant="h1">Welcome to RHUDS</Text>
        <Button variant="primary">Get Started</Button>
      </BleepsProvider>
    </ThemeProvider>
  );
}`}
            >
              <Stack direction="column" gap="1.5rem">
                <Text variant="h2">Welcome to RHUDS</Text>
                <Text variant="body">
                  A futuristic sci-fi UI framework for React applications.
                </Text>
                <div>
                  <Button variant="primary">Get Started</Button>
                </div>
              </Stack>
            </ComponentPlayground>
          )}
        </Container>
      </div>
    </div>
  );
};
