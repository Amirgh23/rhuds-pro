import React, { useState, useRef } from 'react';
import styled from 'styled-components';

export interface VerificationCodeInputProps {
  /** Number of code digits (default: 6) */
  length?: number;
  /** Title text (default: "Verification Code") */
  title?: string;
  /** Primary color (default: rgb(0, 255, 136)) */
  primaryColor?: string;
  /** Background color (default: rgb(15, 15, 25)) */
  backgroundColor?: string;
  /** Text color (default: rgb(200, 200, 200)) */
  textColor?: string;
  /** On code complete handler */
  onComplete?: (code: string) => void;
  /** On code change handler */
  onChange?: (code: string) => void;
  /** Custom className */
  className?: string;
  /** Auto-focus first input */
  autoFocus?: boolean;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  title = 'Verification Code',
  primaryColor = 'rgb(0, 255, 136)',
  backgroundColor = 'rgb(15, 15, 25)',
  textColor = 'rgb(200, 200, 200)',
  onComplete,
  onChange,
  className,
  autoFocus = true,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    const fullCode = newCode.join('');
    onChange?.(fullCode);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '')) {
      onComplete?.(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);

    if (digits.length > 0) {
      const newCode = [...code];
      digits.split('').forEach((digit, index) => {
        if (index < length) {
          newCode[index] = digit;
        }
      });
      setCode(newCode);

      const fullCode = newCode.join('');
      onChange?.(fullCode);

      if (newCode.every((digit) => digit !== '')) {
        onComplete?.(fullCode);
      }

      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <StyledWrapper
      $primaryColor={primaryColor}
      $backgroundColor={backgroundColor}
      $textColor={textColor}
      className={className}
    >
      <div className="verification-container">
        <div className="verification-title">
          <h3>{title}</h3>
        </div>
        <div className="verification-inputs">
          {Array(length)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={autoFocus && index === 0}
                className="verification-input"
              />
            ))}
        </div>
        <div className="verification-status">
          <span className="status-text">
            {code.every((digit) => digit !== '')
              ? '✓ Code Complete'
              : `${code.filter((d) => d !== '').length}/${length}`}
          </span>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $primaryColor: string;
  $backgroundColor: string;
  $textColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .verification-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(
      135deg,
      ${(props) => props.$backgroundColor} 0%,
      rgba(20, 20, 35, 0.8) 100%
    );
    border: 2px solid ${(props) => props.$primaryColor};
    border-radius: 8px;
    box-shadow:
      0 0 20px rgba(0, 255, 136, 0.2),
      inset 0 0 20px rgba(0, 255, 136, 0.05);
    max-width: 400px;
    margin: 0 auto;
  }

  .verification-title {
    text-align: center;
    border-bottom: 1px solid ${(props) => props.$primaryColor};
    padding-bottom: 1rem;

    h3 {
      margin: 0;
      color: ${(props) => props.$textColor};
      font-family: 'Courier New', monospace;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .verification-inputs {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .verification-input {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    border: 2px solid ${(props) => props.$primaryColor};
    background-color: rgba(15, 15, 25, 0.5);
    color: ${(props) => props.$primaryColor};
    font-family: 'Courier New', monospace;
    border-radius: 4px;
    transition: all 0.3s ease;
    outline: none;

    &:focus {
      background-color: rgba(0, 255, 136, 0.1);
      box-shadow:
        0 0 15px ${(props) => props.$primaryColor},
        inset 0 0 10px rgba(0, 255, 136, 0.1);
      transform: scale(1.05);
    }

    &:hover {
      border-color: ${(props) => props.$primaryColor};
      box-shadow: 0 0 10px ${(props) => props.$primaryColor};
    }

    &::placeholder {
      color: rgba(200, 200, 200, 0.3);
    }

    /* Remove number spinner */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type='number'] {
      -moz-appearance: textfield;
    }
  }

  .verification-status {
    text-align: center;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 255, 136, 0.3);

    .status-text {
      color: ${(props) => props.$textColor};
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      letter-spacing: 1px;
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(0, 255, 136, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }
  }

  @media (max-width: 480px) {
    .verification-container {
      padding: 1.5rem;
    }

    .verification-input {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }

    .verification-inputs {
      gap: 0.5rem;
    }
  }
`;

export default VerificationCodeInput;
