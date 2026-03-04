/**
 * HoloCheckbox Component
 * Futuristic holographic checkbox with 3D effects, particles, and space theme
 */

import React from 'react';
import styled from 'styled-components';

export interface HoloCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
}

const StyledWrapper = styled.div`
  .checkbox-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 200px;
    z-index: 10;
  }

  .holo-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .holo-checkbox {
    position: relative;
    width: 80px;
    height: 80px;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .holo-box {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(0, 162, 255, 0.7);
    border-radius: 12px;
    background-color: rgba(0, 24, 55, 0.5);
    box-shadow: 0 0 10px rgba(0, 162, 255, 0.5), inset 0 0 15px rgba(0, 162, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.3s ease;
    transform-style: preserve-3d;
  }

  .holo-inner {
    position: absolute;
    width: 30%;
    height: 30%;
    background-color: rgba(0, 162, 255, 0.5);
    border-radius: 4px;
    opacity: 0;
    transform: scale(0) rotate(45deg);
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 162, 255, 0.8);
  }

  .scan-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 162, 255, 0.8), transparent);
    animation: holoCheckboxScanOff 4s infinite;
    opacity: 0.3;
    transition: all 0.3s ease;
  }

  @keyframes holoCheckboxScanOff {
    0% {
      left: -100%;
      opacity: 0.3;
    }
    100% {
      left: 100%;
      opacity: 0.3;
    }
  }

  @keyframes holoCheckboxScanOn {
    0% {
      left: -100%;
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 1;
    }
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-box {
    border-color: rgba(0, 255, 136, 0.7);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.6), inset 0 0 15px rgba(0, 255, 136, 0.4);
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-inner {
    background-color: rgba(0, 255, 136, 0.7);
    box-shadow: 0 0 15px rgba(0, 255, 136, 1);
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }

  .holo-checkbox-input:checked + .holo-checkbox .scan-effect {
    animation: holoCheckboxScanOn 2s infinite;
    opacity: 1;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.8), transparent);
  }

  .holo-glow {
    position: absolute;
    width: 200%;
    height: 200%;
    left: -50%;
    top: -50%;
    background: radial-gradient(ellipse at center, rgba(0, 162, 255, 0.2) 0%, rgba(0, 162, 255, 0.1) 40%, rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    filter: blur(10px);
    opacity: 0.5;
    z-index: -1;
    animation: holoCheckboxGlowPulse 4s infinite alternate;
    transition: all 0.5s ease;
  }

  @keyframes holoCheckboxGlowPulse {
    0% {
      opacity: 0.3;
      filter: blur(10px) brightness(0.8);
    }
    100% {
      opacity: 0.6;
      filter: blur(15px) brightness(1.2);
    }
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-glow {
    background: radial-gradient(ellipse at center, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 40%, rgba(0, 0, 0, 0) 70%);
    animation: holoCheckboxActiveGlowPulse 2s infinite alternate;
  }

  @keyframes holoCheckboxActiveGlowPulse {
    0% {
      opacity: 0.4;
      filter: blur(10px) brightness(1);
    }
    100% {
      opacity: 0.8;
      filter: blur(20px) brightness(1.5);
    }
  }

  .corner-accent {
    position: absolute;
    width: 15px;
    height: 15px;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(0, 162, 255, 0.5);
    transition: all 0.3s ease;
  }

  .corner-accent:nth-child(1) {
    top: -5px;
    left: -5px;
    border-right: none;
    border-bottom: none;
    border-radius: 5px 0 0 0;
  }

  .corner-accent:nth-child(2) {
    top: -5px;
    right: -5px;
    border-left: none;
    border-bottom: none;
    border-radius: 0 5px 0 0;
  }

  .corner-accent:nth-child(3) {
    bottom: -5px;
    left: -5px;
    border-right: none;
    border-top: none;
    border-radius: 0 0 0 5px;
  }

  .corner-accent:nth-child(4) {
    bottom: -5px;
    right: -5px;
    border-left: none;
    border-top: none;
    border-radius: 0 0 5px 0;
  }

  .holo-checkbox-input:checked + .holo-checkbox .corner-accent {
    width: 20px;
    height: 20px;
    border-color: rgba(0, 255, 136, 0.7);
  }

  .status-text {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 162, 255, 0.8);
    text-shadow: 0 0 5px rgba(0, 162, 255, 0.5);
    position: relative;
    transition: all 0.3s ease;
  }

  .status-text::before {
    content: "SYSTEM DEACTIVATED";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .holo-checkbox-input:checked ~ .status-text::before {
    content: "SYSTEM ACTIVATED";
    color: rgba(0, 255, 136, 0.8);
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
  }

  .activation-rings {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .activation-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    height: 40%;
    border: 1px solid rgba(0, 255, 136, 0);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked + .holo-checkbox .activation-ring {
    animation: holoCheckboxRingExpand 2s ease-out forwards;
    border-color: rgba(0, 255, 136, 0.7);
  }

  .holo-checkbox-input:checked + .holo-checkbox .activation-ring:nth-child(1) {
    animation-delay: 0s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .activation-ring:nth-child(2) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .activation-ring:nth-child(3) {
    animation-delay: 0.6s;
  }

  @keyframes holoCheckboxRingExpand {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
  }

  .holo-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .holo-particle {
    position: absolute;
    background-color: rgba(0, 162, 255, 0.7);
    border-radius: 50%;
    width: 3px;
    height: 3px;
    opacity: 0;
    filter: blur(1px);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle {
    background-color: rgba(0, 255, 136, 0.7);
    animation: holoCheckboxParticleFloat 3s infinite ease-in-out;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(1) {
    top: 20%;
    left: 30%;
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(2) {
    top: 70%;
    left: 20%;
    animation-delay: 0.7s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(3) {
    top: 40%;
    left: 80%;
    animation-delay: 1.3s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(4) {
    top: 60%;
    left: 60%;
    animation-delay: 1.9s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(5) {
    top: 30%;
    left: 45%;
    animation-delay: 2.5s;
  }

  .holo-checkbox-input:checked + .holo-checkbox .holo-particle:nth-child(6) {
    top: 60%;
    left: 40%;
    animation-delay: 3.1s;
  }

  @keyframes holoCheckboxParticleFloat {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(-20px) scale(0);
      opacity: 0;
    }
  }

  .cube-transform {
    position: absolute;
    width: 30%;
    height: 30%;
    transform-style: preserve-3d;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cube-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 162, 255, 0.3);
    border: 1px solid rgba(0, 162, 255, 0.5);
    box-shadow: 0 0 5px rgba(0, 162, 255, 0.3);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-transform {
    opacity: 1;
    animation: holoCheckboxCubeRotate 5s infinite linear;
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face {
    background-color: rgba(0, 255, 136, 0.3);
    border-color: rgba(0, 255, 136, 0.5);
    box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(1) {
    transform: translateZ(15px);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(2) {
    transform: rotateY(180deg) translateZ(15px);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(3) {
    transform: rotateY(90deg) translateZ(15px);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(4) {
    transform: rotateY(-90deg) translateZ(15px);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(5) {
    transform: rotateX(90deg) translateZ(15px);
  }

  .holo-checkbox-input:checked + .holo-checkbox .cube-face:nth-child(6) {
    transform: rotateX(-90deg) translateZ(15px);
  }

  @keyframes holoCheckboxCubeRotate {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }

  .frequency-spectrum {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 30px;
    width: 200px;
    margin-top: 20px;
    gap: 2px;
  }

  .frequency-bar {
    width: 3px;
    height: 4px;
    background: rgba(0, 162, 255, 0.5);
    border-radius: 2px 2px 0 0;
    transition: height 0.3s ease, background 0.3s ease;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar {
    background: rgba(0, 255, 136, 0.5);
    animation: frequency-animation 1.5s infinite ease;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(1) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(3) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(5) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(6) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(7) {
    animation-delay: 0.4s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(8) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(9) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(10) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(11) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(12) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(13) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(14) {
    animation-delay: 0.4s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(15) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(16) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(17) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(18) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(19) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(20) {
    animation-delay: 0.4s;
  }

  .holo-label {
    position: absolute;
    bottom: -45px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(0, 162, 255, 0.8);
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(0, 162, 255, 0.5);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked ~ .holo-label {
    color: rgba(0, 255, 136, 0.8);
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
  }

  .data-chips {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: white;
  }

  .data-chip {
    position: absolute;
    padding: 5px 8px;
    background-color: rgba(0, 24, 55, 0.7);
    border: 1px solid rgba(0, 162, 255, 0.5);
    border-radius: 4px;
    font-size: 10px;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar {
    background: rgba(0, 255, 136, 0.5);
    animation: holoCheckboxFrequencyAnimation 1.5s infinite ease;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(1) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(3) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(5) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(6) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(7) {
    animation-delay: 0.4s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(8) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(9) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(10) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(11) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(12) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(13) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(14) {
    animation-delay: 0.4s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(15) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(16) {
    animation-delay: 0.3s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(17) {
    animation-delay: 0.1s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(18) {
    animation-delay: 0.5s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(19) {
    animation-delay: 0.2s;
  }

  .holo-checkbox-input:checked ~ .frequency-spectrum .frequency-bar:nth-child(20) {
    animation-delay: 0.4s;
  }

  @keyframes holoCheckboxFrequencyAnimation {
    0% {
      height: 4px;
    }
    50% {
      height: 25px;
    }
    100% {
      height: 4px;
    }
  }

  .holo-label {
    position: absolute;
    bottom: -45px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(0, 162, 255, 0.8);
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(0, 162, 255, 0.5);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked ~ .holo-label {
    color: rgba(0, 255, 136, 0.8);
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
  }

  .data-chips {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: white;
  }

  .data-chip {
    position: absolute;
    padding: 5px 8px;
    background-color: rgba(0, 24, 55, 0.7);
    border: 1px solid rgba(0, 162, 255, 0.5);
    border-radius: 4px;
    font-size: 10px;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
  }

  .holo-checkbox-input:checked ~ .data-chips .data-chip {
    animation: holoCheckboxChipAppear 0.5s ease forwards;
    border-color: rgba(0, 255, 136, 0.5);
  }

  @keyframes holoCheckboxChipAppear {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .data-chip:nth-child(1) {
    top: -50px;
    left: 40px;
    animation-delay: 0.5s;
  }

  .data-chip:nth-child(2) {
    top: 30px;
    left: -100px;
    animation-delay: 1.2s;
  }

  .data-chip:nth-child(3) {
    top: 80px;
    left: 50px;
    animation-delay: 1.8s;
  }

  .data-chip:nth-child(4) {
    top: 15px;
    left: 100px;
    animation-delay: 2.3s;
  }
`;

export function HoloCheckbox({
  checked = false,
  onChange,
  label,
  id = 'holo-check',
  className = '',
}: HoloCheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <StyledWrapper className={className}>
      <div>
        <div className="checkbox-container">
          <input
            className="holo-checkbox-input"
            id={id}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          <label className="holo-checkbox" htmlFor={id}>
            <div className="holo-box">
              <div className="holo-inner" />
              <div className="scan-effect" />
              <div className="holo-particles">
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
              </div>
              <div className="activation-rings">
                <div className="activation-ring" />
                <div className="activation-ring" />
                <div className="activation-ring" />
              </div>
              <div className="cube-transform">
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
              </div>
            </div>
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="holo-glow" />
          </label>
          <div className="status-text" />
          <div className="frequency-spectrum">
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
            <div className="frequency-bar" />
          </div>
          <div className="data-chips">
            <div className="data-chip">STATUS: IDLE [0x4F]</div>
            <div className="data-chip">QUANTUM VERIFY: 82.6%</div>
            <div className="data-chip">SYNCH: PENDING</div>
            <div className="data-chip">0x7A2C8B9F</div>
          </div>
          {label && <div className="holo-label">{label}</div>}
        </div>
      </div>
    </StyledWrapper>
  );
}
