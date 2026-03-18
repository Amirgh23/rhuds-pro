import React from 'react';
import styled from 'styled-components';

export interface HackerLoaderBinaryProps {
  color?: string;
  size?: number;
  className?: string;
}

const HackerLoaderBinary: React.FC<HackerLoaderBinaryProps> = ({
  color = '#00ff00',
  size = 100,
  className,
}) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 255, b: 0 };
  };

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper $color={color} $size={size} $rgb={rgb} className={className}>
      <div className="hacker-loader">
        <div className="binary-ring" />
        <div className="core" />
        <div className="binary-digits">
          <span>0</span>
          <span>1</span>
          <span>0</span>
          <span>1</span>
          <span>1</span>
          <span>0</span>
          <span>1</span>
          <span>0</span>
        </div>
        <div className="loading-text">Loading</div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $size: number;
  $rgb: { r: number; g: number; b: number };
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .hacker-loader {
    position: relative;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
  }

  /* Outer spinning binary ring */
  .binary-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px dashed ${(props) => props.$color};
    animation: spin 2s linear infinite;
  }

  /* Inner glitchy core */
  .core {
    position: absolute;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    background: rgba(
      ${(props) => props.$rgb.r},
      ${(props) => props.$rgb.g},
      ${(props) => props.$rgb.b},
      0.1
    );
    border-radius: 50%;
    animation: glitch-core 0.5s infinite;
    box-shadow: 0 0 15px ${(props) => props.$color};
  }

  /* Binary digits effect */
  .binary-digits {
    position: absolute;
    width: 100%;
    height: 100%;
    color: ${(props) => props.$color};
    font-size: 14px;
    text-align: center;
    animation: spin 1.5s linear infinite reverse;
  }

  .binary-digits span {
    position: absolute;
    top: 0;
    left: 50%;
    transform-origin: 0 ${(props) => props.$size / 2}px;
  }

  /* Position each binary digit around the circle */
  .binary-digits span:nth-child(1) {
    transform: rotate(0deg) translateY(-10px);
  }

  .binary-digits span:nth-child(2) {
    transform: rotate(45deg) translateY(-10px);
  }

  .binary-digits span:nth-child(3) {
    transform: rotate(90deg) translateY(-10px);
  }

  .binary-digits span:nth-child(4) {
    transform: rotate(135deg) translateY(-10px);
  }

  .binary-digits span:nth-child(5) {
    transform: rotate(180deg) translateY(-10px);
  }

  .binary-digits span:nth-child(6) {
    transform: rotate(225deg) translateY(-10px);
  }

  .binary-digits span:nth-child(7) {
    transform: rotate(270deg) translateY(-10px);
  }

  .binary-digits span:nth-child(8) {
    transform: rotate(315deg) translateY(-10px);
  }

  /* Loading text with flicker */
  .loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${(props) => props.$color};
    font-size: 16px;
    text-transform: uppercase;
    animation: flicker 1.5s infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes glitch-core {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.05) translate(2px, -2px);
    }
    40% {
      transform: scale(0.95) translate(-2px, 2px);
    }
    60% {
      transform: scale(1.02) translate(1px, 1px);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes flicker {
    0%,
    19%,
    21%,
    23%,
    25%,
    54%,
    56%,
    100% {
      opacity: 1;
    }
    20%,
    24%,
    55% {
      opacity: 0.3;
    }
  }
`;

export default HackerLoaderBinary;
