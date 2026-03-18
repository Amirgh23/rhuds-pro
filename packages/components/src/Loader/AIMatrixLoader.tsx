import React from 'react';
import styled from 'styled-components';

export interface AIMatrixLoaderProps {
  color?: string;
  size?: number;
  className?: string;
}

const AIMatrixLoader: React.FC<AIMatrixLoaderProps> = ({
  color = '#00ff88',
  size = 120,
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
      : { r: 0, g: 255, b: 136 };
  };

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper $color={color} $size={size} $rgb={rgb} className={className}>
      <div className="ai-matrix-loader">
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="glow" />
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
  .ai-matrix-loader {
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size * 1.33}px;
    margin: 30px auto;
    position: relative;
    perspective: 800px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .digit {
    color: ${(props) => props.$color};
    font-family: monospace;
    font-size: ${(props) => props.$size * 0.15}px;
    text-align: center;
    text-shadow: 0 0 5px ${(props) => props.$color};
    animation:
      matrix-fall 2s infinite,
      matrix-flicker 0.5s infinite;
    opacity: 0;
  }

  .digit:nth-child(1) {
    animation-delay: 0.1s;
  }

  .digit:nth-child(2) {
    animation-delay: 0.3s;
  }

  .digit:nth-child(3) {
    animation-delay: 0.5s;
  }

  .digit:nth-child(4) {
    animation-delay: 0.7s;
  }

  .digit:nth-child(5) {
    animation-delay: 0.9s;
  }

  .digit:nth-child(6) {
    animation-delay: 1.1s;
  }

  .digit:nth-child(7) {
    animation-delay: 1.3s;
  }

  .digit:nth-child(8) {
    animation-delay: 1.5s;
  }

  .glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle,
      rgba(${(props) => props.$rgb.r}, ${(props) => props.$rgb.g}, ${(props) => props.$rgb.b}, 0.1)
        0%,
      transparent 70%
    );
    animation: matrix-pulse 2s infinite;
  }

  @keyframes matrix-fall {
    0% {
      transform: translateY(-50px) rotateX(90deg);
      opacity: 0;
    }
    20%,
    80% {
      transform: translateY(0) rotateX(0deg);
      opacity: 0.8;
    }
    100% {
      transform: translateY(50px) rotateX(-90deg);
      opacity: 0;
    }
  }

  @keyframes matrix-flicker {
    0%,
    19%,
    21%,
    100% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.2;
    }
  }

  @keyframes matrix-pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

export default AIMatrixLoader;
