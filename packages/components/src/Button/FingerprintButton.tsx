import React from 'react';
import styled from 'styled-components';

export interface FingerprintButtonProps {
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  className?: string;
}

const FingerprintButton: React.FC<FingerprintButtonProps> = ({
  onClick,
  color = '#00ff00',
  disabled = false,
  className,
}) => {
  return (
    <StyledWrapper $color={color} $disabled={disabled} className={className}>
      <div className="fingerprint-container">
        <div className="fingerprint-button" onClick={onClick} role="button" tabIndex={0}>
          <svg
            className="fingerprint-svg"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M7 3.516A9.004 9.004 0 0 1 20.648 8.5M21 22v-8M3 22V11c0-1.052.18-2.062.512-3" />
              <path d="M18 22V11.3C18 7.82 15.314 5 12 5s-6 2.82-6 6.3V14m0 8v-4" />
              <path d="M9 22V11.15C9 9.41 10.343 8 12 8c.865 0 1.645.385 2.193 1M15 22v-8m-3 8v-3.5m0-7.5v3" />
            </g>
          </svg>
          <div className="scan-line" />
          <div className="glitch-overlay-h" />
          <div className="glitch-overlay-v" />
          <div className="glitch-distort" />
          <div className="ripple-effect" />
          <div className="binary-particles">
            <span className="particle" style={{ left: '10%', animationDelay: '0s' }}>
              1
            </span>
            <span className="particle" style={{ left: '30%', animationDelay: '-0.2s' }}>
              0
            </span>
            <span className="particle" style={{ left: '50%', animationDelay: '-0.4s' }}>
              1
            </span>
            <span className="particle" style={{ left: '70%', animationDelay: '-0.6s' }}>
              0
            </span>
            <span className="particle" style={{ left: '90%', animationDelay: '-0.8s' }}>
              1
            </span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $disabled: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .fingerprint-container {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fingerprint-button {
    position: relative;
    width: 100px;
    height: 100px;
    background: #1a1a1a;
    border: 2px solid ${(props) => props.$color};
    border-radius: 50%;
    box-shadow: 0 0 15px ${(props) => props.$color};
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  }

  /* SVG Fingerprint */
  .fingerprint-svg {
    width: 70px;
    height: 70px;
    stroke: ${(props) => props.$color};
    fill: none;
    z-index: 2;
    transition: stroke 0.3s ease;
  }

  .fingerprint-svg path {
    stroke-dasharray: 50;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.5s ease;
  }

  /* Scan line */
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.6
    );
    box-shadow: 0 0 10px ${(props) => props.$color};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 3;
  }

  /* Horizontal glitch overlay */
  .glitch-overlay-h {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `${r}, ${g}, ${b}`;
        }},
        0.2
      ),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  /* Vertical glitch overlay */
  .glitch-overlay-v {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      transparent,
      rgba(
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `${r}, ${g}, ${b}`;
        }},
        0.15
      ),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  /* Distorted glitch layer */
  .glitch-distort {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.1
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  /* Ripple effect for click */
  .ripple-effect {
    position: absolute;
    width: 0;
    height: 0;
    background: rgba(
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.3
    );
    border-radius: 50%;
    opacity: 0;
    z-index: 2;
    pointer-events: none;
  }

  /* Binary particles */
  .binary-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 4;
  }

  .particle {
    position: absolute;
    color: ${(props) => props.$color};
    font-size: 10px;
    opacity: 0;
    animation: particle-rise 1.2s linear infinite;
  }

  /* Hover state */
  .fingerprint-button:hover:not(:disabled) {
    background: rgba(
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }},
      0.1
    );
    box-shadow: 0 0 25px ${(props) => props.$color};
    transform: scale(1.05);
  }

  .fingerprint-button:hover:not(:disabled) .fingerprint-svg {
    stroke: ${(props) => {
      const hex = props.$color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const factor = 0.8;
      return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
    }};
  }

  .fingerprint-button:hover:not(:disabled) .fingerprint-svg path:nth-child(1) {
    animation: scan-path-1 1.5s infinite linear;
  }

  .fingerprint-button:hover:not(:disabled) .fingerprint-svg path:nth-child(2) {
    animation: scan-path-2 1.5s infinite linear;
  }

  .fingerprint-button:hover:not(:disabled) .fingerprint-svg path:nth-child(3) {
    animation: scan-path-3 1.5s infinite linear;
  }

  .fingerprint-button:hover:not(:disabled) .scan-line {
    opacity: 1;
    animation: scan-move 1.5s infinite linear;
  }

  .fingerprint-button:hover:not(:disabled) .glitch-overlay-h {
    opacity: 1;
    animation: glitch-h 1s infinite;
  }

  .fingerprint-button:hover:not(:disabled) .glitch-overlay-v {
    opacity: 1;
    animation: glitch-v 0.8s infinite;
  }

  .fingerprint-button:hover:not(:disabled) .glitch-distort {
    opacity: 0.8;
    animation: glitch-distort 0.5s infinite;
  }

  /* Clicked state */
  .fingerprint-button:active:not(:disabled) {
    background: ${(props) => props.$color};
    box-shadow:
      0 0 30px ${(props) => props.$color},
      0 0 50px ${(props) => props.$color};
    transition: all 0.1s ease;
  }

  .fingerprint-button:active:not(:disabled) .fingerprint-svg {
    stroke: #0a0a0a;
  }

  .fingerprint-button:active:not(:disabled) .fingerprint-svg path {
    animation: scanned-path 0.5s ease-in-out forwards;
  }

  .fingerprint-button:active:not(:disabled) .scan-line,
  .fingerprint-button:active:not(:disabled) .glitch-overlay-h,
  .fingerprint-button:active:not(:disabled) .glitch-overlay-v,
  .fingerprint-button:active:not(:disabled) .glitch-distort {
    opacity: 0;
  }

  .fingerprint-button:active:not(:disabled) .ripple-effect {
    width: 120px;
    height: 120px;
    opacity: 1;
    animation: ripple 0.6s ease-out forwards;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  /* Animations */
  @keyframes scan-path-1 {
    0% {
      stroke-dashoffset: 50;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 50;
    }
  }

  @keyframes scan-path-2 {
    0% {
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dashoffset: 50;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scan-path-3 {
    0% {
      stroke-dashoffset: 25;
    }
    50% {
      stroke-dashoffset: 75;
    }
    100% {
      stroke-dashoffset: 25;
    }
  }

  @keyframes scan-move {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }

  @keyframes glitch-h {
    0% {
      transform: translateX(-100%);
    }
    20% {
      transform: translateX(100%) skewX(5deg);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes glitch-v {
    0% {
      transform: translateY(-100%);
    }
    30% {
      transform: translateY(100%) skewY(3deg);
    }
    100% {
      transform: translateY(100%);
    }
  }

  @keyframes glitch-distort {
    0% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(2px, -2px);
    }
    60% {
      transform: translate(-1px, 1px);
    }
    80% {
      transform: translate(1px, -1px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes scanned-path {
    0% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
    50% {
      stroke-dashoffset: 50;
      opacity: 0.8;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 120px;
      height: 120px;
      opacity: 0;
    }
  }

  @keyframes particle-rise {
    0% {
      opacity: 0;
      transform: translateY(100%) translateX(0);
    }
    20% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
      transform: translateY(-100%) translateX(10px);
    }
  }
`;

export default FingerprintButton;
