import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface HoloInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  className?: string;
  status?: string;
}

export const HoloInput: React.FC<HoloInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter text',
  label = 'Input Field',
  type = 'text',
  className,
  status = 'Ready for input',
}) => {
  return (
    <StyledWrapper className={className}>
      <div className="input-container">
        <div className="input-field-container">
          <input
            type={type}
            className="holo-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          <div className="input-border" />
          <div className="holo-scan-line" />
          <div className="input-glow" />
          <div className="input-active-indicator" />
          <div className="input-label">{label}</div>
          <div className="input-data-visualization">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="data-segment" style={{ '--index': i + 1 } as React.CSSProperties} />
            ))}
          </div>
          <div className="input-particles">
            {[
              { top: '20%', left: '10%' },
              { top: '65%', left: '25%' },
              { top: '40%', left: '40%' },
              { top: '75%', left: '60%' },
              { top: '30%', left: '75%' },
              { top: '60%', left: '90%' },
            ].map((pos, i) => (
              <div
                key={i}
                className="input-particle"
                style={{ '--index': i + 1, ...pos } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="input-holo-overlay" />
          <div className="interface-lines">
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
          </div>
          <div className="hex-decoration" />
          <div className="input-status">{status}</div>
          <div className="power-indicator" />
          <div className="input-decoration">
            <div className="decoration-dot" />
            <div className="decoration-line" />
            <div className="decoration-dot" />
            <div className="decoration-line" />
            <div className="decoration-dot" />
            <div className="decoration-line" />
            <div className="decoration-dot" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const scanAnimation = keyframes`
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
`;

const dataPulse = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.8);
  }
  100% {
    transform: scaleY(1);
  }
`;

const particleFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const StyledWrapper = styled.div`
  .input-container {
    position: relative;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }

  .input-field-container {
    position: relative;
    width: 100%;
    margin-bottom: 30px;
  }

  .holo-input {
    width: 100%;
    height: 60px;
    background: rgba(0, 12, 36, 0.7);
    border: none;
    outline: none;
    padding: 0 60px 0 20px;
    color: rgba(41, 242, 223, 0.9);
    font-family: 'Orbitron', 'Courier New', monospace;
    font-size: 18px;
    letter-spacing: 1px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 4px;
    box-shadow: 0 0 15px rgba(41, 242, 223, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8);
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(41, 242, 223, 0.7);
    z-index: 1;
  }

  .holo-input::placeholder {
    color: rgba(41, 242, 223, 0.4);
    transition: all 0.3s ease;
  }

  .input-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 1px solid rgba(41, 242, 223, 0.4);
    border-radius: 4px;
    z-index: 2;
  }

  .input-border::before,
  .input-border::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(41, 242, 223, 0.7);
    z-index: 2;
    transition: all 0.3s ease;
  }

  .input-border::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .input-border::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .holo-scan-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(41, 242, 223, 0.5) 20%,
      rgba(27, 253, 156, 0.8) 50%,
      rgba(41, 242, 223, 0.5) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    top: 0;
    left: 0;
    opacity: 0;
    filter: blur(1px);
    z-index: 3;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .input-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(41, 242, 223, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0;
    border-radius: 4px;
    z-index: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .input-active-indicator {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(27, 253, 156, 0.7);
    border-radius: 50%;
    right: 20px;
    top: 25px;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(27, 253, 156, 0.5);
    transition: all 0.3s ease;
    z-index: 2;
  }

  .input-label {
    position: absolute;
    top: -30px;
    left: 0;
    color: rgba(41, 242, 223, 0.7);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    pointer-events: none;
    text-shadow: 0 0 5px rgba(41, 242, 223, 0.5);
  }

  .input-data-visualization {
    position: absolute;
    width: calc(100% - 40px);
    height: 3px;
    bottom: 12px;
    left: 20px;
    display: flex;
    justify-content: space-between;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .data-segment {
    width: 4%;
    height: 100%;
    background: rgba(41, 242, 223, 0.3);
    transition: all 0.5s ease;
  }

  .data-segment:nth-child(even) {
    height: 5px;
    transform: translateY(-1px);
  }

  .input-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 3;
    overflow: hidden;
    border-radius: 4px;
  }

  .input-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(27, 253, 156, 0.7);
    border-radius: 50%;
    opacity: 0;
    filter: blur(1px);
    transition: all 0.3s ease;
    box-shadow: 0 0 5px rgba(27, 253, 156, 0.7);
  }

  .input-holo-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      90deg,
      rgba(41, 242, 223, 0.05) 25%,
      rgba(41, 242, 223, 0.02) 50%,
      rgba(41, 242, 223, 0.05) 75%
    );
    background-size: 8px 100%;
    opacity: 0.5;
    pointer-events: none;
    z-index: 4;
    mix-blend-mode: overlay;
  }

  .interface-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 2;
  }

  .interface-line {
    position: absolute;
    background: rgba(41, 242, 223, 0.3);
    transition: all 0.3s ease;
  }

  .interface-line:nth-child(1) {
    width: 20px;
    height: 1px;
    top: 15px;
    right: 15px;
  }

  .interface-line:nth-child(2) {
    width: 1px;
    height: 20px;
    top: 15px;
    right: 15px;
  }

  .interface-line:nth-child(3) {
    width: 1px;
    height: 20px;
    bottom: 15px;
    left: 15px;
  }

  .interface-line:nth-child(4) {
    width: 20px;
    height: 1px;
    bottom: 15px;
    left: 15px;
  }

  .hex-decoration {
    position: absolute;
    width: 30px;
    height: 34px;
    background: transparent;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border: 1px solid rgba(41, 242, 223, 0.3);
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 1;
    transition: all 0.3s ease;
    z-index: 2;
  }

  .input-status {
    position: absolute;
    bottom: -25px;
    right: 0;
    font-size: 12px;
    color: rgba(41, 242, 223, 0.5);
    letter-spacing: 1px;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    text-transform: uppercase;
  }

  .power-indicator {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(27, 253, 156, 0.7) 0%,
      rgba(41, 242, 223, 0.3) 100%
    );
    bottom: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 3;
  }

  .input-decoration {
    position: absolute;
    top: 50%;
    right: -30px;
    transform: translateY(-50%);
    width: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    opacity: 0.7;
    transition: all 0.3s ease;
    z-index: 2;
    pointer-events: none;
  }

  .decoration-dot {
    width: 4px;
    height: 4px;
    background: rgba(41, 242, 223, 0.7);
    border-radius: 50%;
    margin: 3px 0;
  }

  .decoration-line {
    width: 15px;
    height: 1px;
    background: rgba(41, 242, 223, 0.5);
    margin: 3px 0;
  }

  /* Focus States */
  .holo-input:focus {
    background: rgba(0, 22, 46, 0.8);
    box-shadow: 0 0 20px rgba(41, 242, 223, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.9);
    color: rgba(41, 242, 223, 1);
  }

  .holo-input:focus::placeholder {
    color: rgba(41, 242, 223, 0.3);
    transform: translateX(10px);
  }

  .holo-input:focus ~ .input-border {
    border-color: rgba(41, 242, 223, 0.7);
  }

  .holo-input:focus ~ .input-border::before,
  .holo-input:focus ~ .input-border::after {
    border-color: rgba(27, 253, 156, 1);
    width: 30px;
    height: 30px;
  }

  .holo-input:focus ~ .holo-scan-line {
    opacity: 1;
    animation: ${scanAnimation} 2s infinite ease-in-out;
  }

  .holo-input:focus ~ .input-glow {
    opacity: 1;
  }

  .holo-input:focus ~ .input-active-indicator {
    opacity: 1;
    background: rgba(27, 253, 156, 1);
    box-shadow: 0 0 15px rgba(27, 253, 156, 0.7);
    transform: scale(1.2);
  }

  .holo-input:focus ~ .input-label {
    color: rgba(27, 253, 156, 1);
    text-shadow: 0 0 10px rgba(27, 253, 156, 0.7);
    transform: translateY(-5px);
  }

  .holo-input:focus ~ .input-data-visualization {
    opacity: 1;
  }

  .holo-input:focus ~ .input-data-visualization .data-segment {
    animation: ${dataPulse} 2s infinite;
    animation-delay: calc(var(--index) * 0.1s);
  }

  .holo-input:focus ~ .input-status {
    opacity: 1;
  }

  .holo-input:focus ~ .interface-lines .interface-line {
    background: rgba(27, 253, 156, 0.6);
  }

  .holo-input:focus ~ .hex-decoration {
    border-color: rgba(27, 253, 156, 0.6);
    box-shadow: 0 0 10px rgba(27, 253, 156, 0.3);
    transform: translateY(-50%) rotate(30deg);
  }

  .holo-input:focus ~ .input-particles .input-particle {
    opacity: 1;
    animation: ${particleFloat} 3s infinite ease-in-out;
    animation-delay: calc(var(--index) * 0.2s);
  }

  .holo-input:focus ~ .power-indicator {
    transform: scaleX(1);
  }

  .holo-input:focus ~ .input-decoration {
    opacity: 1;
    transform: translateY(-50%) translateX(5px);
  }

  .holo-input:focus ~ .input-decoration .decoration-dot {
    background: rgba(27, 253, 156, 1);
    box-shadow: 0 0 5px rgba(27, 253, 156, 0.7);
  }

  .holo-input:focus ~ .input-decoration .decoration-line {
    background: rgba(27, 253, 156, 0.7);
    box-shadow: 0 0 3px rgba(27, 253, 156, 0.5);
  }

  /* Hover States */
  .holo-input:hover {
    background: rgba(0, 15, 40, 0.75);
  }

  .holo-input:hover ~ .input-active-indicator {
    opacity: 0.6;
  }

  .holo-input:hover ~ .hex-decoration {
    border-color: rgba(41, 242, 223, 0.5);
  }
`;

export default HoloInput;
