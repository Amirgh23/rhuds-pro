/**
 * GlitchRadio Component
 * Radio button with glitch effects and pulse animations
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface GlitchRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface GlitchRadioProps {
  name: string;
  options: GlitchRadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const glitchAnimText = keyframes`
  0% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
  }
  20% {
    transform: translate(-3px, 2px);
    clip-path: inset(50% 0 20% 0);
  }
  40% {
    transform: translate(2px, -1px);
    clip-path: inset(20% 0 60% 0);
  }
  60% {
    transform: translate(-2px, 1px);
    clip-path: inset(80% 0 5% 0);
  }
  80% {
    transform: translate(2px, -2px);
    clip-path: inset(30% 0 45% 0);
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
  }
`;

const pulseWave = keyframes`
  from {
    transform: scale(1);
    opacity: 0.7;
  }
  to {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  --bg-color: #0d0d0d;
  --primary-color: #00f2ea;
  --secondary-color: #a855f7;
  --text-color: #e5e5e5;
  --disabled-color: #555;
  --font-family: 'Fira Code', Consolas, 'Courier New', Courier, monospace;
  --glitch-anim-duration: 0.4s;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: var(--font-family);
  background-color: #050505;
  padding: 2rem;
  border-radius: 1rem;
`;

const RadioContainer = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  position: relative;

  input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const RadioCircle = styled.div<{ $checked: boolean; $disabled?: boolean }>`
  width: 1.5em;
  height: 1.5em;
  border: 2px solid ${props => props.$disabled ? 'var(--disabled-color)' : 'var(--primary-color)'};
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$disabled ? 0.5 : 1};

  ${RadioContainer}:hover & {
    box-shadow: ${props => props.$disabled ? 'none' : '0 0 10px var(--primary-color)'};
  }
`;

const RadioDot = styled.div<{ $checked: boolean }>`
  width: 60%;
  height: 60%;
  background-color: var(--primary-color);
  border-radius: 50%;
  transform: scale(${props => props.$checked ? 1 : 0});
  opacity: ${props => props.$checked ? 1 : 0};
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
`;

const Pulse = styled.div<{ $checked: boolean; $delay: string }>`
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  opacity: 0;
  animation: ${props => props.$checked ? pulseWave : 'none'} 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
  animation-delay: ${props => props.$delay};
`;

const RadioLabel = styled.span<{ $checked: boolean; $disabled?: boolean }>`
  color: ${props => props.$disabled ? 'var(--disabled-color)' : props.$checked ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: 500;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  text-shadow: ${props => props.$checked ? '0 0 8px rgba(0, 242, 234, 0.7)' : 'none'};

  ${RadioContainer}:hover &::before,
  ${RadioContainer}:hover &::after {
    content: ${props => props.$disabled ? 'none' : `attr(data-text)`};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #050505;
  }

  ${RadioContainer}:hover &::before {
    color: var(--secondary-color);
    animation: ${props => props.$disabled ? 'none' : glitchAnimText} var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  ${RadioContainer}:hover &::after {
    color: var(--primary-color);
    animation: ${props => props.$disabled ? 'none' : glitchAnimText} var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
  }
`;

export function GlitchRadio({
  name,
  options,
  value,
  onChange,
  className = '',
}: GlitchRadioProps) {
  const handleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <Wrapper className={className}>
      {options.map((option, index) => {
        const isChecked = value === option.value;
        const isDisabled = option.disabled || false;

        return (
          <RadioContainer key={index} $disabled={isDisabled}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => !isDisabled && handleChange(option.value)}
            />
            <RadioCircle $checked={isChecked} $disabled={isDisabled}>
              <RadioDot $checked={isChecked} />
              <Pulse $checked={isChecked} $delay="0s" />
              <Pulse $checked={isChecked} $delay="0.3s" />
            </RadioCircle>
            <RadioLabel
              $checked={isChecked}
              $disabled={isDisabled}
              data-text={option.label}
            >
              {option.label}
            </RadioLabel>
          </RadioContainer>
        );
      })}
    </Wrapper>
  );
}

export default GlitchRadio;
