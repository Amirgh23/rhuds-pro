import React, { useState } from 'react';
import styled from 'styled-components';

export interface ThermostatCardProps {
  temperature?: number;
  minTemp?: number;
  maxTemp?: number;
  color?: string;
  label?: string;
  status?: string;
  onChange?: (temp: number) => void;
  className?: string;
}

const ThermostatCard: React.FC<ThermostatCardProps> = ({
  temperature = 70,
  minTemp = 30,
  maxTemp = 110,
  color = '#00f0ff',
  label = 'CURRENT',
  status = 'Comfort',
  onChange,
  className,
}) => {
  const [currentTemp, setCurrentTemp] = useState(temperature);

  const handleTempChange = (newTemp: number) => {
    setCurrentTemp(newTemp);
    onChange?.(newTemp);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 240, b: 255 };
  };

  const rgb = hexToRgb(color);
  const tempRange = maxTemp - minTemp;
  const tempPercent = ((currentTemp - minTemp) / tempRange) * 100;

  // Generate scale marks
  const scaleMarks = [];
  const step = (maxTemp - minTemp) / 8;
  for (let i = 0; i <= 8; i++) {
    const temp = minTemp + i * step;
    scaleMarks.push({
      temp: Math.round(temp),
      position: (i / 8) * 100,
      tickWidth: i % 2 === 0 ? 10 : 7,
    });
  }

  return (
    <StyledWrapper $color={color} $rgb={rgb} className={className}>
      <svg className="svg" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="turbulent-displace" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.018"
              numOctaves={6}
              result="noise"
              seed={2}
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"
              result="noiseFixed"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noiseFixed"
              scale={8}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" result="blurred" />
            <feBlend in="SourceGraphic" in2="blurred" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div className="card">
        <div className="thermostat-ui">
          <div className="thermostat glass-panel">
            <div className="thermostat-inner">
              <div className="glass-noise" />
              <div className="scale-container">
                {scaleMarks.map((mark) => (
                  <div
                    key={mark.temp}
                    className="scale-mark"
                    data-temp={mark.temp}
                    style={{ top: `${mark.position}%` }}
                  >
                    {mark.temp}
                    <div className="tick" style={{ width: mark.tickWidth }} />
                  </div>
                ))}
              </div>
              <div className="track">
                <div className="mercury" style={{ height: `${tempPercent}%` }} />
              </div>
              <div className="knob-zone">
                <div
                  className="knob"
                  style={{ top: `${tempPercent}%` }}
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startTemp = currentTemp;

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaY = moveEvent.clientY - startY;
                      const tempDelta = -(deltaY / 150) * tempRange;
                      let newTemp = startTemp + tempDelta;
                      newTemp = Math.max(minTemp, Math.min(maxTemp, newTemp));
                      handleTempChange(Math.round(newTemp));
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="temp-readout">
            <div className="temp-value">{currentTemp}°</div>
            <div className="temp-label">{label}</div>
            <div className="status-text">{status}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $rgb: { r: number; g: number; b: number };
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .svg {
    position: absolute;
    width: 0;
    height: 0;
  }

  .card {
    background: #131418;
    border-radius: 32px;
    padding: 14px 12px;
    box-shadow:
      0 30px 50px -20px rgba(0, 0, 0, 0.95),
      0 0 0 1px rgba(255, 255, 255, 0.03) inset,
      0 0 0 1px rgba(255, 255, 255, 0.02);
    width: 156px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(2px);
  }

  .glass-panel {
    background: rgba(10, 10, 12, 0.85);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      0 10px 18px -8px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  }

  .thermostat-ui {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .thermostat {
    position: relative;
    width: 58px;
    height: 190px;
    border-radius: 999px;
    overflow: visible;
  }

  .thermostat-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: visible;
  }

  .thermostat-inner::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(255, 255, 255, 0.06);
    mix-blend-mode: soft-light;
    pointer-events: none;
  }

  .glass-noise {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0.06;
    mix-blend-mode: overlay;
    pointer-events: none;
    background: repeating-radial-gradient(
      circle at 30% 40%,
      rgba(255, 255, 255, 0.1) 0px,
      transparent 2px
    );
  }

  .track {
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      rgba(40, 40, 45, 1) 0%,
      rgba(20, 20, 22, 1) 50%,
      rgba(8, 8, 10, 1) 100%
    );
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.8),
      inset 0 -1px 2px rgba(255, 255, 255, 0.05),
      0 5px 12px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  .mercury {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: ${(props) => props.$color};
    filter: url(#turbulent-displace);
    mix-blend-mode: screen;
    box-shadow:
      0 0 18px ${(props) => props.$color},
      0 0 32px ${(props) => props.$color},
      inset 0 -2px 5px rgba(255, 255, 255, 0.6);
    opacity: 0.99;
    border-radius: 0 0 999px 999px;
    transform: translateZ(0);
    will-change: transform;
    animation: flowWave 4s infinite alternate ease-in-out;
    transition: height 0.3s ease;
  }

  .mercury::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    width: 100%;
    height: 12px;
    background: radial-gradient(circle at 30% 0%, rgba(255, 255, 255, 0.7) 0%, transparent 80%);
    filter: blur(3px);
    opacity: 0.5;
  }

  .mercury::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    mix-blend-mode: hard-light;
    opacity: 0.25;
    animation: softPulse 2.5s infinite alternate ease-in-out;
  }

  @keyframes flowWave {
    0% {
      filter: url(#turbulent-displace) brightness(1);
      transform: scaleY(1);
    }
    50% {
      filter: url(#turbulent-displace) brightness(1.15);
      transform: scaleY(1.02);
    }
    100% {
      filter: url(#turbulent-displace) brightness(1);
      transform: scaleY(1);
    }
  }

  @keyframes softPulse {
    0% {
      opacity: 0.15;
    }
    100% {
      opacity: 0.3;
    }
  }

  .knob-zone {
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: 0;
    right: 0;
    pointer-events: none;
  }

  .knob {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: radial-gradient(circle at 35% 35%, #4a4a55, #1c1c22);
    backdrop-filter: blur(6px) saturate(200%);
    -webkit-backdrop-filter: blur(6px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 2px 6px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.7),
      0 6px 12px rgba(0, 0, 0, 0.7);
    pointer-events: auto;
    cursor: grab;
    transition: top 0.3s ease;

    &:active {
      cursor: grabbing;
    }
  }

  .scale-container {
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: -34px;
    width: 28px;
    pointer-events: none;
  }

  .scale-mark {
    position: absolute;
    right: 0;
    font-size: 5.5px;
    color: rgba(210, 220, 240, 0.7);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 2px;
    transform-origin: right center;
    opacity: 0.65;
    white-space: nowrap;
    letter-spacing: 0.2px;
    text-shadow: 0 0 3px
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.3)`};
    font-family: 'Inter', monospace;
  }

  .tick {
    height: 2px;
    background: rgba(220, 240, 255, 0.7);
    border-radius: 1px;
    flex-shrink: 0;
    box-shadow: 0 0 4px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.5)`};
  }

  .temp-readout {
    text-align: center;
    margin-top: 2px;
  }

  .temp-value {
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow:
      0 0 16px ${(props) => props.$color},
      0 0 30px ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.4)`};
    color: #eef5ff;
    line-height: 1.2;
    letter-spacing: -0.5px;
    background: linear-gradient(180deg, #ffffff, #aad0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px ${(props) => props.$color});
  }

  .temp-label {
    font-size: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    opacity: 0.5;
    margin-top: 3px;
    color: #a0aaba;
    font-weight: 400;
  }

  .status-text {
    margin-top: 2px;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: ${(props) => props.$color};
    opacity: 0.9;
    font-weight: 400;
    text-shadow: 0 0 6px ${(props) => props.$color};
  }

  .thermostat::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 999px;
    background: radial-gradient(
      circle at 50% 20%,
      ${(props) => `rgba(${props.$rgb.r}, ${props.$rgb.g}, ${props.$rgb.b}, 0.1)`},
      transparent 80%
    );
    filter: blur(5px);
    z-index: -1;
    pointer-events: none;
  }
`;

export default ThermostatCard;
