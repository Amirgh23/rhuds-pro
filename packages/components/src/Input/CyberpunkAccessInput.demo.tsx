import React, { useState } from 'react';
import styled from 'styled-components';
import CyberpunkAccessInput from './CyberpunkAccessInput';

export const CyberpunkAccessInputDemo = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  return (
    <DemoWrapper>
      <h2>CyberpunkAccessInput Component</h2>
      <p>
        Cyberpunk-themed admin access input with corner brackets, scan lines, and warning messages.
      </p>

      <DemoGrid>
        {/* Default Green */}
        <DemoCard>
          <h3>Default (Green)</h3>
          <CyberpunkAccessInput
            value={value1}
            onChange={setValue1}
            label="ADMIN_ACCESS"
            placeholder="➤ ENTER CREDENTIALS"
            warningText="Unauthorized access will be reported"
          />
        </DemoCard>

        {/* Blue Variant */}
        <DemoCard>
          <h3>Blue Variant</h3>
          <CyberpunkAccessInput
            value={value2}
            onChange={setValue2}
            label="SECURE_LOGIN"
            placeholder="➤ ENTER PASSWORD"
            primaryColor="#3b82f6"
            warningText="Invalid credentials detected"
          />
        </DemoCard>

        {/* Red Variant */}
        <DemoCard>
          <h3>Red Variant</h3>
          <CyberpunkAccessInput
            value={value3}
            onChange={setValue3}
            label="DANGER_ZONE"
            placeholder="➤ CONFIRM ACTION"
            primaryColor="#ef4444"
            warningText="This action cannot be undone"
          />
        </DemoCard>

        {/* Purple Variant */}
        <DemoCard>
          <h3>Purple Variant</h3>
          <CyberpunkAccessInput
            value={value4}
            onChange={setValue4}
            label="NEURAL_LINK"
            placeholder="➤ SYNC CREDENTIALS"
            primaryColor="#a855f7"
            warningText="Neural sync in progress"
          />
        </DemoCard>

        {/* Email Type */}
        <DemoCard>
          <h3>Email Input</h3>
          <CyberpunkAccessInput
            type="email"
            label="EMAIL_VERIFY"
            placeholder="➤ ENTER EMAIL"
            primaryColor="#06b6d4"
            warningText="Verification email will be sent"
          />
        </DemoCard>

        {/* Text Type */}
        <DemoCard>
          <h3>Text Input</h3>
          <CyberpunkAccessInput
            type="text"
            label="USERNAME"
            placeholder="➤ ENTER USERNAME"
            primaryColor="#ec4899"
            warningText="Username must be unique"
          />
        </DemoCard>
      </DemoGrid>

      <CodeExample>
        <h3>Usage Example</h3>
        <pre>{`import { CyberpunkAccessInput } from '@rhuds/components';

export function MyComponent() {
  const [password, setPassword] = useState('');

  return (
    <CyberpunkAccessInput
      value={password}
      onChange={setPassword}
      label="ADMIN_ACCESS"
      placeholder="➤ ENTER CREDENTIALS"
      primaryColor="#22c55e"
      warningText="Unauthorized access will be reported"
    />
  );
}`}</pre>
      </CodeExample>
    </DemoWrapper>
  );
};

const DemoWrapper = styled.div`
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #fff;
  font-family: 'Courier New', monospace;

  h2 {
    font-size: 28px;
    margin-bottom: 8px;
    color: #22c55e;
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
  }

  > p {
    color: #888;
    margin-bottom: 40px;
    font-size: 14px;
  }
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const DemoCard = styled.div`
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);

  h3 {
    font-size: 14px;
    color: #22c55e;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const CodeExample = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;

  h3 {
    color: #22c55e;
    margin-bottom: 15px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  pre {
    background: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    color: #22c55e;
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
  }
`;

export default CyberpunkAccessInputDemo;
