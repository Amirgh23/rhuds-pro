import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export interface ProgressLoaderProps {
  progress?: number;
  color?: string;
  accentColor?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  showParticles?: boolean;
  className?: string;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress = 40,
  color = '#00f260',
  accentColor = '#0575e6',
  backgroundColor = '#1b2735',
  showPercentage = true,
  showParticles = true,
  className,
}) => {
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    setDisplayProgress(Math.min(Math.max(progress, 0), 100));
  }, [progress]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 242, b: 96 };
  };

  const colorRgb = hexToRgb(color);
  const accentRgb = hexToRgb(accentColor);

  return (
    <StyledWrapper
      $progress={displayProgress}
      $color={color}
      $accentColor={accentColor}
      $backgroundColor={backgroundColor}
      $colorRgb={colorRgb}
      $accentRgb={accentRgb}
      className={className}
    >
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-ripple" />
        </div>
        {showPercentage && <div className="progress-text">{displayProgress}%</div>}
        {showParticles && (
          <div className="particles">
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $progress: number;
  $color: string;
  $accentColor: string;
  $backgroundColor: string;
  $colorRgb: { r: number; g: number; b: number };
  $accentRgb: { r: number; g: number; b: number };
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .progress-container {
    position: relative;
    width: 60%;
    max-width: 500px;
    height: 20px;
    background: radial-gradient(circle, ${(props) => props.$backgroundColor}, #090a0f);
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 1px solid #313131;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.$progress}%;
    background: linear-gradient(
      90deg,
      ${(props) => props.$color},
      ${(props) => props.$accentColor}
    );
    border-radius: 30px;
    transition: width 0.3s ease;
    box-shadow:
      0 0 15px ${(props) => props.$color},
      0 0 30px ${(props) => props.$accentColor};
  }

  .progress-bar-ripple {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
    opacity: 0.5;
    animation: ripple 3s infinite;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
    z-index: 2;
  }

  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    opacity: 0.6;
    animation: float 5s infinite ease-in-out;
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.7;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
    100% {
      transform: translateY(0) translateX(0);
    }
  }

  .particle:nth-child(1) {
    top: 10%;
    left: 20%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    top: 30%;
    left: 70%;
    animation-delay: 1s;
  }

  .particle:nth-child(3) {
    top: 50%;
    left: 50%;
    animation-delay: 2s;
  }

  .particle:nth-child(4) {
    top: 80%;
    left: 40%;
    animation-delay: 1.5s;
  }

  .particle:nth-child(5) {
    top: 90%;
    left: 60%;
    animation-delay: 2.5s;
  }
`;

export default ProgressLoader;
