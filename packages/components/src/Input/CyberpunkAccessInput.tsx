import React, { useState } from 'react';
import styled from 'styled-components';

export interface CyberpunkAccessInputProps {
  /** Placeholder text (default: "➤ ENTER CREDENTIALS") */
  placeholder?: string;
  /** Label text (default: "ADMIN_ACCESS") */
  label?: string;
  /** Primary color (default: #22c55e - green-400) */
  primaryColor?: string;
  /** Input type (default: "password") */
  type?: 'text' | 'password' | 'email';
  /** Value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Custom className */
  className?: string;
  /** Warning text (default: "Unauthorized access will be reported") */
  warningText?: string;
}

export const CyberpunkAccessInput: React.FC<CyberpunkAccessInputProps> = ({
  placeholder = '➤ ENTER CREDENTIALS',
  label = 'ADMIN_ACCESS',
  primaryColor = '#22c55e',
  type = 'password',
  value = '',
  onChange,
  className,
  warningText = 'Unauthorized access will be reported',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledWrapper $primaryColor={primaryColor}>
      <div className={`access-container ${className || ''}`}>
        {/* Corner brackets */}
        <div className="corner corner-tl">
          <div className="bracket-h" />
          <div className="bracket-v" />
        </div>
        <div className="corner corner-tr">
          <div className="bracket-h" />
          <div className="bracket-v" />
        </div>
        <div className="corner corner-bl">
          <div className="bracket-h" />
          <div className="bracket-v" />
        </div>
        <div className="corner corner-br">
          <div className="bracket-h" />
          <div className="bracket-v" />
        </div>

        {/* Scan line effect */}
        <div className="scan-line" />

        {/* Content */}
        <div className="content">
          <label className="label" htmlFor="access-input">
            <span className="arrow">➜</span>
            <span className="label-text">{label}</span>
            <span className="cursor">▋</span>
          </label>

          <div className="input-wrapper">
            <input
              id="access-input"
              className="input"
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="lock-icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Warning message */}
          <div className="warning">
            <span className="warning-dot" />
            <span className="warning-text">
              <span className="warning-label">WARNING:</span> {warningText}
            </span>
          </div>

          {/* Decorative lines */}
          <div className="decorative-lines">
            <div className="line line-1" />
            <div className="line line-2" />
            <div className="line line-3" />
            <div className="line line-4" />
            <div className="line line-5" />
            <div className="line line-6" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  --color-primary: ${(props) => props.$primaryColor};
  --color-dark: #000;
  --color-light: #fff;

  .access-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    font-family: 'Courier New', monospace;
  }

  .corner {
    position: absolute;
    width: 24px;
    height: 24px;
    display: flex;
    z-index: 10;

    .bracket-h {
      position: absolute;
      height: 2px;
      background-color: var(--color-primary);
    }

    .bracket-v {
      position: absolute;
      width: 2px;
      background-color: var(--color-primary);
    }
  }

  .corner-tl {
    top: 0;
    left: 0;

    .bracket-h {
      width: 24px;
      top: 0;
      left: 0;
    }

    .bracket-v {
      height: 24px;
      top: 0;
      left: 0;
    }
  }

  .corner-tr {
    top: 0;
    right: 0;

    .bracket-h {
      width: 24px;
      top: 0;
      right: 0;
    }

    .bracket-v {
      height: 24px;
      top: 0;
      right: 0;
    }
  }

  .corner-bl {
    bottom: 0;
    left: 0;

    .bracket-h {
      width: 24px;
      bottom: 0;
      left: 0;
    }

    .bracket-v {
      height: 24px;
      bottom: 0;
      left: 0;
    }
  }

  .corner-br {
    bottom: 0;
    right: 0;

    .bracket-h {
      width: 24px;
      bottom: 0;
      right: 0;
    }

    .bracket-v {
      height: 24px;
      bottom: 0;
      right: 0;
    }
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: linear-gradient(to bottom, transparent, rgba(34, 197, 94, 0.1), transparent);
    pointer-events: none;
    z-index: 5;
  }

  .content {
    position: relative;
    padding: 24px;
    background-color: var(--color-dark);
    border: 2px solid var(--color-primary);
    border-radius: 8px;
    overflow: hidden;
  }

  .label {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--color-primary);
    cursor: pointer;

    .arrow {
      margin-right: 8px;
      color: rgba(34, 197, 94, 0.6);
    }

    .label-text {
      font-weight: bold;
      color: rgba(34, 197, 94, 0.8);
    }

    .cursor {
      margin-left: 8px;
      animation: blink 1s infinite;
    }
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    width: 100%;
    background-color: transparent;
    color: rgba(34, 197, 94, 0.8);
    font-size: 16px;
    border: 2px solid rgba(34, 197, 94, 0.6);
    border-radius: 6px;
    padding: 12px;
    padding-right: 40px;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(34, 197, 94, 0.4);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
      color: var(--color-primary);
    }
  }

  .lock-icon {
    position: absolute;
    right: 12px;
    width: 20px;
    height: 20px;
    color: rgba(34, 197, 94, 0.6);
    pointer-events: none;
  }

  .warning {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(34, 197, 94, 0.6);

    .warning-dot {
      width: 8px;
      height: 8px;
      background-color: #ef4444;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .warning-text {
      line-height: 1.4;
    }

    .warning-label {
      color: #f87171;
      font-weight: bold;
    }
  }

  .decorative-lines {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;

    .line {
      width: 1px;
      background-color: rgba(34, 197, 94, 0.5);
    }

    .line-1 {
      height: 16px;
      opacity: 0.5;
    }

    .line-2 {
      height: 24px;
      opacity: 0.3;
    }

    .line-3 {
      height: 8px;
      opacity: 0.7;
    }

    .line-4 {
      height: 16px;
      opacity: 0.5;
    }

    .line-5 {
      height: 24px;
      opacity: 0.3;
    }

    .line-6 {
      height: 8px;
      opacity: 0.7;
    }
  }

  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }
`;

export default CyberpunkAccessInput;
