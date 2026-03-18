import React from 'react';
import styled from 'styled-components';

export interface CyberSubscribeButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  color?: string;
  className?: string;
  disabled?: boolean;
}

const CyberSubscribeButton: React.FC<CyberSubscribeButtonProps> = ({
  onClick,
  children = 'Subscribe',
  color = '#6eefff',
  className,
  disabled = false,
}) => {
  // Convert hex color to RGB with opacity
  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return `rgba(110, 239, 255, ${opacity})`;
  };

  const colorLight = hexToRgba(color, 0.5);
  const colorDark = hexToRgba(color, 0.271);

  return (
    <StyledWrapper className={className} $colorLight={colorLight} $colorDark={colorDark}>
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $colorLight: string; $colorDark: string }>`
  button {
    min-height: 53px;
    min-width: 166px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    cursor: pointer;
    background: linear-gradient(
      90deg,
      ${(props) => props.$colorLight} -12.74%,
      ${(props) => props.$colorDark} 56.76%
    );
    border: 2px solid #acf7ff;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0 20px;
  }

  button:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(172, 247, 255, 0.5);
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button::before {
    content: '';
    width: 4px;
    height: 28px;
    background: #19173b;
    border: 2px solid #acf7ff;
    transform: rotate(-45deg);
    position: absolute;
    border-top: 0;
    border-left: 0;
    border-bottom: 0;
    bottom: -7px;
    left: 4px;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }

  button::after {
    content: '';
    position: absolute;
    left: -2px;
    bottom: -2px;
    border-top: 15px solid transparent;
    border-left: 15px solid #fffcf7;
  }
`;

export default CyberSubscribeButton;
