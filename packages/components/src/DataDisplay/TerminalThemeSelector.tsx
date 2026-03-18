import React, { useState } from 'react';
import styled from 'styled-components';

export interface TerminalThemeSelectorProps {
  onThemeChange?: (theme: string) => void;
  className?: string;
}

const TerminalThemeSelector: React.FC<TerminalThemeSelectorProps> = ({
  onThemeChange,
  className,
}) => {
  const [selectedTheme, setSelectedTheme] = useState('green');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    onThemeChange?.(theme);
  };

  return (
    <StyledWrapper $theme={selectedTheme} className={className}>
      <div className="wrapper">
        <input
          type="radio"
          name="theme"
          id="t-green"
          checked={selectedTheme === 'green'}
          onChange={() => handleThemeChange('green')}
        />
        <input
          type="radio"
          name="theme"
          id="t-blue"
          checked={selectedTheme === 'blue'}
          onChange={() => handleThemeChange('blue')}
        />
        <input
          type="radio"
          name="theme"
          id="t-amber"
          checked={selectedTheme === 'amber'}
          onChange={() => handleThemeChange('amber')}
        />
        <input
          type="radio"
          name="theme"
          id="t-red"
          checked={selectedTheme === 'red'}
          onChange={() => handleThemeChange('red')}
        />
        <input
          type="radio"
          name="theme"
          id="t-purple"
          checked={selectedTheme === 'purple'}
          onChange={() => handleThemeChange('purple')}
        />
        <input
          type="radio"
          name="theme"
          id="t-black"
          checked={selectedTheme === 'black'}
          onChange={() => handleThemeChange('black')}
        />

        <div className="terminal">
          <div className="terminal-header">
            <span />
            <span />
            <span />
          </div>
          <pre className="terminal-body">
            <span className="cmd">$</span> system.boot()
            {'\n'}
            <span className="out">[ OK ] Kernel loaded</span>
            {'\n'}
            <span className="out">[ OK ] Network ready</span>
            {'\n'}
            <span className="cmd">$</span> echo "hello uiverse"
            {'\n'}
            <span className="out">hello uiverse</span>
            {'\n'}
            {'    '}
          </pre>
        </div>

        <div className="glass-panel">
          <label htmlFor="t-green" className="c green" title="Green Theme" />
          <label htmlFor="t-blue" className="c blue" title="Blue Theme" />
          <label htmlFor="t-amber" className="c amber" title="Amber Theme" />
          <label htmlFor="t-red" className="c red" title="Red Theme" />
          <label htmlFor="t-purple" className="c purple" title="Purple Theme" />
          <label htmlFor="t-black" className="c black" title="Black Theme" />
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $theme: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  /* main wrapper */
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    font-family: monospace;
  }

  /* hide radios input's */
  .wrapper input[type='radio'] {
    display: none;
  }

  /* terminal */
  .wrapper .terminal {
    width: 300px;
    height: 200px;
    border-radius: 9px;
    background: linear-gradient(120deg, #022c22, #065f46, #022c22, #0f5132);
    background-size: 400% 400%;
    animation: terminalGradient 10s ease infinite;
    background-image:
      repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 1px,
        transparent 2px,
        transparent 4px
      ),
      linear-gradient(120deg, #022c22, #065f46, #022c22, #0f5132);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    box-shadow: inset 0 0 60px rgba(0, 255, 180, 0.15);
  }

  @keyframes terminalGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .wrapper .terminal:hover {
    transform: translateY(-6px) rotateX(2deg) rotateY(2deg);
  }

  /* terminal header */
  .wrapper .terminal-header {
    display: flex;
    gap: 8px;
    padding: 10px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  }

  .wrapper .terminal-header span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
  }

  .wrapper .terminal-header span:nth-child(1) {
    color: #ff5f56;
  }

  .wrapper .terminal-header span:nth-child(2) {
    color: #ffbd2e;
  }

  .wrapper .terminal-header span:nth-child(3) {
    color: #27c93f;
  }

  /* terminal body */
  .wrapper .terminal-body {
    padding: 14px;
    font-size: 13px;
    line-height: 1.5;
    color: #a7f3d0;
    position: relative;
    margin: 0;
  }

  .wrapper .terminal-body::after {
    content: '_';
    position: absolute;
    animation: blink 1s step-start infinite;
    color: #5eead4;
    font-weight: bold;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .wrapper .cmd {
    color: #5eead4;
  }

  .wrapper .out {
    display: block;
    color: #d1fae5;
  }

  /* glass panel */
  .wrapper .glass-panel {
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 16px 14px;
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.55));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  /* color dots */
  .wrapper .c {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
  }

  .wrapper .c::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px solid transparent;
    transition: border-color 0.25s ease;
  }

  .wrapper .c:hover::after {
    border-color: rgba(255, 255, 255, 0.6);
  }

  /* indicator */
  .wrapper #t-green:checked ~ .glass-panel .green::after,
  .wrapper #t-blue:checked ~ .glass-panel .blue::after,
  .wrapper #t-amber:checked ~ .glass-panel .amber::after,
  .wrapper #t-red:checked ~ .glass-panel .red::after,
  .wrapper #t-purple:checked ~ .glass-panel .purple::after,
  .wrapper #t-black:checked ~ .glass-panel .black::after {
    border-color: rgba(255, 255, 255, 1);
  }

  /* colors */
  .wrapper .green {
    background: #22c55e;
  }

  .wrapper .blue {
    background: #38bdf8;
  }

  .wrapper .amber {
    background: #fbbf24;
  }

  .wrapper .red {
    background: #ef4444;
  }

  .wrapper .purple {
    background: #a855f7;
  }

  .wrapper .black {
    background: #000000;
  }

  /* theme logic */
  .wrapper #t-green:checked ~ .terminal {
    background: linear-gradient(120deg, #022c22, #065f46, #022c22);
    border-color: rgba(34, 197, 94, 0.4);
  }

  .wrapper #t-blue:checked ~ .terminal {
    background: linear-gradient(120deg, #020617, #0c4a6e, #020617);
    border-color: rgba(56, 189, 248, 0.4);
  }

  .wrapper #t-amber:checked ~ .terminal {
    background: linear-gradient(120deg, #2e1b00, #78350f, #2e1b00);
    border-color: rgba(251, 191, 36, 0.4);
  }

  .wrapper #t-red:checked ~ .terminal {
    background: linear-gradient(120deg, #2a0606, #9b111e, #2a0606);
    border-color: rgba(239, 68, 68, 0.4);
  }

  .wrapper #t-purple:checked ~ .terminal {
    background: linear-gradient(120deg, #1e062a, #6b21a8, #1e062a);
    border-color: rgba(168, 85, 247, 0.4);
  }

  .wrapper #t-black:checked ~ .terminal {
    background: linear-gradient(120deg, #000000, #0a0a0a, #111111, #000000);
    background-size: 400% 400%;
    background-image:
      repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 1px,
        transparent 2px,
        transparent 4px
      ),
      linear-gradient(120deg, #000000, #0a0a0a, #111111, #000000);
    border: 1px solid #fff;
    box-shadow: inset 0 0 50px rgba(0, 255, 255, 0.15);
    transition: transform 0.3s ease;
  }
`;

export default TerminalThemeSelector;
