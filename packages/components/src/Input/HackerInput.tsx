/**
 * HackerInput Component
 * Futuristic hacker-style input with glowing effects and animations
 */

import React from 'react';
import styled from 'styled-components';

export interface HackerInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  className?: string;
}

const StyledWrapper = styled.div`
  .hacker-input-container {
    position: relative;
    width: 300px;
    margin-top: 20px;
  }

  .hacker-input {
    width: 100%;
    padding: 12px 15px;
    background: #000000;
    border: 2px solid #00f6ff;
    color: #00f6ff;
    font-family: "Courier New", monospace;
    font-size: 16px;
    outline: none;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
    transition: all 0.3s ease;
  }

  /* Placeholder styling */
  .hacker-input::placeholder {
    color: rgba(0, 246, 255, 0.6);
    opacity: 0.7;
  }

  /* Focus state with enhanced glow */
  .hacker-input:focus {
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.8), 0 0 30px rgba(0, 246, 255, 0.6);
    background: rgba(0, 246, 255, 0.05);
  }

  /* Label animation */
  .hacker-label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    color: #00f6ff;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 246, 255, 0.8);
  }

  /* Move label up and scale when input is focused or filled */
  .hacker-input:focus + .hacker-label,
  .hacker-input:not(:placeholder-shown) + .hacker-label {
    top: -10px;
    left: 10px;
    font-size: 12px;
    background: #0a0a0a;
    padding: 0 5px;
  }

  /* Cursor blinking effect */
  .hacker-input-container::after {
    content: "_";
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #00f6ff;
    font-size: 20px;
    animation: hackerInputBlink 0.7s infinite;
  }

  /* Scanline effect across input */
  .hacker-input-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 246, 255, 0.3);
    animation: hackerInputScanline 2s infinite linear;
  }

  @keyframes hackerInputBlink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes hackerInputScanline {
    0% {
      top: 0;
    }
    50% {
      top: 100%;
    }
    100% {
      top: 100%;
    }
  }

  /* Digital glitch effect on hover */
  .hacker-input:hover {
    animation: hackerInputGlitch 0.5s infinite;
  }

  @keyframes hackerInputGlitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(2px, -2px);
    }
    60% {
      transform: translate(-2px, 0);
    }
    80% {
      transform: translate(2px, 0);
    }
    100% {
      transform: translate(0);
    }
  }
`;

export function HackerInput({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  label = 'Input Command',
  className = '',
}: HackerInputProps) {
  return (
    <StyledWrapper className={className}>
      <div className="hacker-input-container">
        <input
          placeholder=" "
          className="hacker-input"
          type={type}
          value={value}
          onChange={onChange}
        />
        <label className="hacker-label">{label}</label>
      </div>
    </StyledWrapper>
  );
}
