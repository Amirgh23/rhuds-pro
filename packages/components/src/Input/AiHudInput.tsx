/**
 * AiHudInput Component
 * AI-themed HUD input with animated grid and futuristic button
 */

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

export interface AiHudInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  color?: string;
  className?: string;
}

// Keyframe animations with unique names
const aiHudGridMove = keyframes`
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 40px 40px, 40px 40px;
  }
`;

const aiHudFramePulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
`;

const Grid = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
      0deg,
      ${props => props.$color}0D 0px,
      ${props => props.$color}0D 1px,
      transparent 1px,
      transparent 20px
    ),
    repeating-linear-gradient(
      90deg,
      ${props => props.$color}0D 0px,
      ${props => props.$color}0D 1px,
      transparent 1px,
      transparent 20px
    );
  animation: ${aiHudGridMove} 2s linear infinite;
  z-index: 0;
  pointer-events: none;
`;

const Frame = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  padding: 1.5rem;
  width: 24em;
  background: ${props => props.$color}0D;
  border: 1px solid ${props => props.$color}33;
  box-shadow: 0 0 30px ${props => props.$color}1A;
  backdrop-filter: blur(5px);
  z-index: 2;
  animation: ${aiHudFramePulse} 5s infinite ease-in-out;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 3;
`;

const StyledInput = styled.input<{ $color: string }>`
  flex: 1;
  background: transparent;
  border: 1px solid ${props => props.$color}33;
  outline: none;
  color: ${props => props.$color};
  font-family: 'Orbitron', 'Fira Code', 'Courier New', monospace;
  font-size: 1rem;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.75rem;
  caret-color: ${props => props.$color};
  transition: border 0.3s, box-shadow 0.3s;

  &:hover {
    border: 1px solid ${props => props.$color}80;
    box-shadow: 0 0 12px ${props => props.$color}4D;
  }

  &:focus {
    border: 1px solid ${props => props.$color};
    box-shadow: 0 0 20px ${props => props.$color}66;
  }

  &::placeholder {
    color: ${props => props.$color}66;
  }
`;

const SubmitButton = styled.button<{ $color: string }>`
  background: ${props => props.$color}0D;
  border: 1px solid ${props => props.$color}66;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-left: 0.75rem;
  transition: all 0.4s ease;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
  box-shadow: 0 0 8px ${props => props.$color}4D;
  transform: rotate(-1deg);

  &:hover {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    box-shadow: 0 0 25px ${props => props.$color}CC, 0 0 40px ${props => props.$color}80;
    background: ${props => props.$color}14;
    transform: rotate(-1deg) scale(1.1);
  }

  &:active {
    transform: rotate(-2deg) scale(1);
  }
`;

const Icon = styled.svg<{ $color: string }>`
  width: 1rem;
  height: 1rem;
  stroke: ${props => props.$color};
`;

export function AiHudInput({
  placeholder = 'Ask anything...',
  value: controlledValue,
  onChange,
  onSubmit,
  color = '#29F2DF',
  className = '',
}: AiHudInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value);
      if (controlledValue === undefined) {
        setInternalValue('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container className={className}>
      <Grid $color={color} />
      <Frame $color={color}>
        <InputWrapper>
          <StyledInput
            type="text"
            $color={color}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <SubmitButton $color={color} onClick={handleSubmit} type="button">
            <Icon
              $color={color}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </Icon>
          </SubmitButton>
        </InputWrapper>
      </Frame>
    </Container>
  );
}

export default AiHudInput;
