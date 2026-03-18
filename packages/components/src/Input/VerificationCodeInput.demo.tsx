import React, { useState } from 'react';
import { VerificationCodeInput } from './VerificationCodeInput';

export const VerificationCodeInputDemo = () => {
  const [code, setCode] = useState('');
  const [completed, setCompleted] = useState('');

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h2>Default VerificationCodeInput</h2>
        <VerificationCodeInput />
      </div>

      <div>
        <h2>6-Digit Code (Green Theme)</h2>
        <VerificationCodeInput
          length={6}
          primaryColor="rgb(0, 255, 136)"
          backgroundColor="rgb(15, 15, 25)"
          title="Enter 6-Digit Code"
        />
      </div>

      <div>
        <h2>4-Digit Code (Cyan Theme)</h2>
        <VerificationCodeInput
          length={4}
          primaryColor="rgb(0, 200, 255)"
          backgroundColor="rgb(10, 20, 35)"
          title="Enter PIN"
        />
      </div>

      <div>
        <h2>8-Digit Code (Purple Theme)</h2>
        <VerificationCodeInput
          length={8}
          primaryColor="rgb(200, 100, 255)"
          backgroundColor="rgb(25, 15, 35)"
          title="Enter Security Code"
        />
      </div>

      <div>
        <h2>With Event Handlers</h2>
        <VerificationCodeInput
          length={6}
          onChange={(value) => setCode(value)}
          onComplete={(value) => {
            setCompleted(value);
            console.log('Code completed:', value);
          }}
          title="Verification Code"
        />
        <div style={{ marginTop: '1rem', color: '#00ff88', fontFamily: 'monospace' }}>
          <p>Current: {code || 'empty'}</p>
          <p>Completed: {completed || 'waiting...'}</p>
        </div>
      </div>

      <div>
        <h2>Red Theme (Error State)</h2>
        <VerificationCodeInput
          length={6}
          primaryColor="rgb(255, 50, 50)"
          backgroundColor="rgb(40, 15, 15)"
          title="Invalid Code - Try Again"
        />
      </div>

      <div>
        <h2>Gold Theme</h2>
        <VerificationCodeInput
          length={6}
          primaryColor="rgb(255, 200, 0)"
          backgroundColor="rgb(35, 30, 15)"
          title="Premium Access Code"
        />
      </div>

      <div>
        <h2>Multiple Instances</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h4>Step 1</h4>
            <VerificationCodeInput length={4} primaryColor="rgb(0, 255, 136)" title="First Code" />
          </div>
          <div>
            <h4>Step 2</h4>
            <VerificationCodeInput length={4} primaryColor="rgb(0, 200, 255)" title="Second Code" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInputDemo;
