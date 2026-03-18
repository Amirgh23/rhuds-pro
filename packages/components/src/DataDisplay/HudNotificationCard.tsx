import React from 'react';
import styled from 'styled-components';

export interface HudNotificationCardProps {
  title?: string;
  message?: string;
  timestamp?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const HudNotificationCard: React.FC<HudNotificationCardProps> = ({
  title = 'SYSTEM ALERT',
  message = 'Threat detected in sector 7',
  timestamp = '12 min ago',
  color = '#29F2DF',
  onClick,
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
      : { r: 41, g: 242, b: 223 };
  };

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper $color={color} $rgb={rgb} className={className}>
      <div className="hud-card">
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-tr" />
        <div className="hud-corner hud-corner-bl" />
        <div className="hud-corner hud-corner-br" />

        <div className="hud-glow" />

        <div className="hud-img" />

        <div className="hud-textBox">
          <div className="hud-textContent">
            <p className="hud-h1">{title}</p>
            <span className="hud-span">{timestamp}</span>
          </div>
          <p className="hud-p">{message}</p>
        </div>

        <div className="hud-scanline" />
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $rgb: { r: number; g: number; b: number };
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .hud-card {
    width: 100%;
    max-width: 320px;
    height: 80px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
    border: 2px solid ${(props) => props.$color};
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow:
      0 0 20px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.3)`},
      inset 0 0 20px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.1)`};
  }

  .hud-card:hover {
    transform: scale(1.02);
    box-shadow:
      0 0 30px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.5)`},
      inset 0 0 30px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.2)`};
  }

  .hud-corner {
    position: absolute;
    width: 15px;
    height: 15px;
    border: 2px solid ${(props) => props.$color};
  }

  .hud-corner-tl {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }

  .hud-corner-tr {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
  }

  .hud-corner-bl {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
  }

  .hud-corner-br {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }

  .hud-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.1)`},
      transparent
    );
    animation: hud-glow-pulse 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes hud-glow-pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
  }

  .hud-img {
    width: 50px;
    height: 50px;
    margin-left: 15px;
    border: 2px solid ${(props) => props.$color};
    background: linear-gradient(
      135deg,
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.2)`},
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.05)`}
    );
    position: relative;
    z-index: 2;
    box-shadow: 0 0 10px
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.3)`};
  }

  .hud-card:hover > .hud-img {
    box-shadow: 0 0 20px
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.6)`};
  }

  .hud-textBox {
    width: calc(100% - 100px);
    margin-left: 15px;
    color: ${(props) => props.$color};
    font-family: 'Courier New', monospace;
    position: relative;
    z-index: 2;
  }

  .hud-textContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .hud-span {
    font-size: 9px;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .hud-h1 {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 10px
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.5)`};
  }

  .hud-p {
    font-size: 11px;
    font-weight: normal;
    margin: 2px 0 0 0;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .hud-scanline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.03)`} 0px,
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.03)`} 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    animation: hud-scan 8s linear infinite;
  }

  @keyframes hud-scan {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

export default HudNotificationCard;
