import React, { useState } from 'react';
import styled from 'styled-components';

export interface TubeAmplifierProps {
  /** Brand name (default: "FIDELITY 900") */
  brandName?: string;
  /** Is powered on */
  isPowered?: boolean;
  /** Left channel VU meter value (0-100) */
  leftChannelLevel?: number;
  /** Right channel VU meter value (0-100) */
  rightChannelLevel?: number;
  /** Volume level (0-100) */
  volume?: number;
  /** Tone control value (0-100) */
  tone?: number;
  /** On power toggle handler */
  onPowerToggle?: (isPowered: boolean) => void;
  /** On volume change handler */
  onVolumeChange?: (volume: number) => void;
  /** On tone change handler */
  onToneChange?: (tone: number) => void;
  /** Custom className */
  className?: string;
}

export const TubeAmplifier: React.FC<TubeAmplifierProps> = ({
  brandName = 'FIDELITY 900',
  isPowered = false,
  leftChannelLevel = 45,
  rightChannelLevel = 55,
  volume = 50,
  tone = 50,
  onPowerToggle,
  onVolumeChange,
  onToneChange,
  className,
}) => {
  const [localPowered, setLocalPowered] = useState(isPowered);
  const [localVolume, setLocalVolume] = useState(volume);
  const [localTone, setLocalTone] = useState(tone);

  const handlePowerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked;
    setLocalPowered(newState);
    onPowerToggle?.(newState);
  };

  const handleVolumeChange = (newVolume: number) => {
    setLocalVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handleToneChange = (newTone: number) => {
    setLocalTone(newTone);
    onToneChange?.(newTone);
  };

  // Calculate needle rotation based on level (0-100 maps to -45deg to 20deg)
  const getNeedleRotation = (level: number) => {
    return -45 + (level / 100) * 65;
  };

  return (
    <StyledWrapper className={className} $isPowered={localPowered}>
      <div className="container">
        <input
          type="checkbox"
          id="pwr"
          className="inputs"
          checked={localPowered}
          onChange={handlePowerToggle}
          aria-label="Power toggle"
        />

        <div className="amp-unit">
          {/* Wood Case */}
          <div className="wood-case" />

          {/* Tube Bay */}
          <div className="tube-bay">
            {/* Vacuum Tubes */}
            {[0, 1, 2].map((index) => (
              <div key={index} className="tube">
                <div className="glass-envelope">
                  <div className="plate" />
                  <div className="heater" />
                  <div className="glow-aura" />
                </div>
              </div>
            ))}
          </div>

          {/* Faceplate */}
          <div className="faceplate">
            {/* Mounting Bolts */}
            <div className="bolt tl" />
            <div className="bolt tr" />
            <div className="bolt bl" />
            <div className="bolt br" />

            {/* VU Meters */}
            <div className="meters-wrapper">
              <div className="vu-meter">
                <div className="backlight" />
                <div className="vu-scale" />
                <div className="vu-text">L . CH</div>
                <div
                  className="needle"
                  style={{ transform: `rotate(${getNeedleRotation(leftChannelLevel)}deg)` }}
                />
              </div>
              <div className="vu-meter">
                <div className="backlight" />
                <div className="vu-scale" />
                <div className="vu-text">R . CH</div>
                <div
                  className="needle"
                  style={{ transform: `rotate(${getNeedleRotation(rightChannelLevel)}deg)` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="controls-deck">
              {/* Volume Knob */}
              <div className="knob-group">
                <div
                  className="knob"
                  onClick={() => handleVolumeChange((localVolume + 10) % 110)}
                  role="slider"
                  aria-label="Volume"
                  aria-valuenow={localVolume}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  style={{ transform: `rotate(${(localVolume / 100) * 270 - 135}deg)` }}
                />
                <div className="knob-label">Volume</div>
              </div>

              {/* Power Switch */}
              <div className="knob-group">
                <div className="switch-housing">
                  <label htmlFor="pwr" className="switch-lever" />
                </div>
                <div className="knob-label">Power</div>
              </div>

              {/* Active Light */}
              <div className="knob-group">
                <div className="jewel-light" />
                <div className="knob-label">Active</div>
              </div>

              {/* Tone Knob */}
              <div className="knob-group">
                <div
                  className="knob"
                  onClick={() => handleToneChange((localTone + 10) % 110)}
                  role="slider"
                  aria-label="Tone"
                  aria-valuenow={localTone}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  style={{ transform: `rotate(${(localTone / 100) * 270 - 135}deg)` }}
                />
                <div className="knob-label">Tone</div>
              </div>
            </div>

            {/* Brand Name */}
            <div className="brand">{brandName}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $isPowered: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .container {
    --wood-base: #3e2723;
    --wood-grain: #281510;
    --metal-face: #d8d8d8;
    --metal-shadow: #999;
    --glass-coating: rgba(200, 220, 255, 0.1);
    --filament-off: #4a3b3b;
    --filament-on: #ff8800;
    --glow-color: rgba(255, 160, 50, 0.6);
    --jewel-off: #400;
    --jewel-on: #ff0000;

    margin: 0;
    background-color: #050505;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Jura', sans-serif;
    overflow: hidden;
    background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000 100%);
  }

  .amp-unit {
    width: 380px;
    height: 500px;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 50px 100px rgba(0, 0, 0, 0.9),
      0 10px 20px rgba(0, 0, 0, 0.8);
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .inputs {
    display: none;
  }

  /* --- WOOD CASE --- */
  .wood-case {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wood-base);
    border-radius: 12px;
    z-index: 0;
    overflow: hidden;
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 2px,
        rgba(0, 0, 0, 0.2) 3px,
        transparent 6px
      ),
      repeating-radial-gradient(
        circle at 50% 50%,
        transparent 0,
        transparent 10px,
        rgba(0, 0, 0, 0.1) 12px
      ),
      linear-gradient(to right, #2a1810, #5d4037 10%, #3e2723 90%, #1a0f0a);
    box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8);
  }

  .wood-case::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.3) 0,
      rgba(0, 0, 0, 0.3) 2px,
      transparent 2px,
      transparent 40px
    );
    mix-blend-mode: multiply;
    opacity: 0.5;
  }

  /* --- TUBE BAY --- */
  .tube-bay {
    height: 240px;
    background: #080808;
    position: relative;
    margin: 15px 15px 0 15px;
    border-radius: 4px 4px 0 0;
    box-shadow: inset 0 0 40px #000;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 25px;
    gap: 25px;
    z-index: 2;
    overflow: hidden;
  }

  .tube-bay::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
    z-index: 0;
  }

  /* VACUUM TUBE DESIGN */
  .tube {
    width: 70px;
    height: 140px;
    position: relative;
    z-index: 5;
  }

  .glass-envelope {
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.15),
      var(--glass-coating) 40%,
      rgba(20, 20, 20, 0.4) 95%
    );
    border-radius: 35px 35px 5px 5px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;
    box-shadow:
      inset 0 0 15px rgba(0, 0, 0, 0.9),
      0 10px 20px rgba(0, 0, 0, 0.5);
  }

  .glass-envelope::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: radial-gradient(at 40% 20%, #888, #222 70%);
    opacity: 0.8;
    mask-image: linear-gradient(to bottom, black, transparent);
    -webkit-mask-image: linear-gradient(to bottom, black, transparent);
  }

  .plate {
    position: absolute;
    top: 25px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    background: linear-gradient(90deg, #222, #444, #222);
    border-radius: 4px;
    border: 1px solid #555;
    box-shadow: inset 0 0 5px #000;
  }

  .plate::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 30%;
    width: 40%;
    height: 60%;
    background: repeating-linear-gradient(0deg, #111 0, #111 2px, transparent 2px, transparent 6px);
  }

  .heater {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 60px;
    background-color: var(--filament-off);
    box-shadow: 0 0 0 var(--glow-color);
    transition:
      background-color 3s ease-in,
      box-shadow 3s ease-in;
    z-index: 10;
  }

  .heater::before {
    content: '';
    position: absolute;
    top: 0;
    left: -3px;
    width: 8px;
    height: 8px;
    background: inherit;
    border-radius: 50%;
    box-shadow: inherit;
  }

  .heater::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -3px;
    width: 8px;
    height: 8px;
    background: inherit;
    border-radius: 50%;
    box-shadow: inherit;
  }

  .glow-aura {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 100%;
    background: radial-gradient(circle, var(--glow-color) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 3s ease-in-out;
    mix-blend-mode: color-dodge;
    pointer-events: none;
  }

  /* --- BRUSHED METAL FACEPLATE --- */
  .faceplate {
    flex-grow: 1;
    margin: 0 15px 15px 15px;
    background: linear-gradient(180deg, #e0e0e0 0%, #b0b0b0 100%);
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      0 -2px 10px rgba(0, 0, 0, 0.5);
  }

  .faceplate::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 1px,
      rgba(0, 0, 0, 0.05) 2px
    );
    pointer-events: none;
  }

  /* Screws */
  .bolt {
    position: absolute;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, #eee, #888);
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    border: 1px solid #777;
  }

  .bolt::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 15%;
    width: 70%;
    height: 1px;
    background: #444;
  }

  .tl {
    top: 10px;
    left: 10px;
    transform: rotate(45deg);
  }

  .tr {
    top: 10px;
    right: 10px;
    transform: rotate(15deg);
  }

  .bl {
    bottom: 10px;
    left: 10px;
    transform: rotate(90deg);
  }

  .br {
    bottom: 10px;
    right: 10px;
    transform: rotate(30deg);
  }

  /* --- METERS --- */
  .meters-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
    position: relative;
  }

  .vu-meter {
    width: 100px;
    height: 80px;
    background: #fdf6e3;
    border: 2px solid #555;
    border-radius: 4px;
    position: relative;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .backlight {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, #fffacd 20%, transparent 80%);
    opacity: 0;
    transition: opacity 1s 1s;
    mix-blend-mode: multiply;
  }

  .vu-scale {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    border-top: 1px solid #333;
    border-radius: 50% 50% 0 0;
  }

  .vu-text {
    position: absolute;
    bottom: 25px;
    width: 100%;
    text-align: center;
    font-size: 0.6rem;
    color: #444;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .needle {
    position: absolute;
    bottom: 10px;
    left: 50%;
    width: 1px;
    height: 60px;
    background: #d00;
    transform-origin: bottom center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 5;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3));
  }

  .vu-meter::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
    pointer-events: none;
  }

  /* --- CONTROLS SECTION --- */
  .controls-deck {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    position: relative;
    z-index: 5;
  }

  .knob-group {
    text-align: center;
  }

  .knob-label {
    font-size: 0.7rem;
    color: #333;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .knob {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: conic-gradient(
      #999 0deg,
      #ccc 10deg,
      #999 20deg,
      #ccc 30deg,
      #999 40deg,
      #ccc 50deg,
      #999 60deg,
      #ccc 70deg,
      #999 80deg,
      #ccc 90deg,
      #999 100deg,
      #ccc 110deg,
      #999 120deg,
      #ccc 130deg,
      #999 140deg,
      #ccc 150deg,
      #999 160deg,
      #ccc 170deg,
      #999 180deg,
      #ccc 190deg,
      #999 200deg,
      #ccc 210deg,
      #999 220deg,
      #ccc 230deg,
      #999 240deg,
      #ccc 250deg,
      #999 260deg,
      #ccc 270deg,
      #999 280deg,
      #ccc 290deg,
      #999 300deg,
      #ccc 310deg,
      #999 320deg,
      #ccc 330deg,
      #999 340deg,
      #ccc 350deg
    );
    box-shadow:
      0 5px 10px rgba(0, 0, 0, 0.5),
      inset 0 0 5px rgba(0, 0, 0, 0.5);
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .knob::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background: radial-gradient(circle, #ddd, #aaa);
    border-radius: 50%;
    border: 1px solid #888;
  }

  .knob::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    width: 2px;
    height: 20px;
    background: #333;
    transform: translateX(-50%);
    z-index: 2;
  }

  .knob:hover {
    transform: rotate(20deg);
  }

  /* Heavy Switch */
  .switch-housing {
    width: 50px;
    height: 80px;
    background: #bbb;
    border: 1px solid #888;
    border-radius: 4px;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }

  .switch-lever {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 40px;
    background: linear-gradient(90deg, #ccc, #fff, #999);
    border-radius: 3px;
    transform: translate(-50%, -50%) rotateX(-45deg);
    transform-origin: center bottom;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    cursor: pointer;
  }

  /* Jewel Pilot Light */
  .jewel-light {
    width: 24px;
    height: 24px;
    background: var(--jewel-off);
    border-radius: 50%;
    border: 2px solid #888;
    position: relative;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    transition: background-color 0.2s;
    overflow: hidden;
  }

  .jewel-light::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%),
      linear-gradient(-45deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%);
  }

  .brand {
    text-align: center;
    margin-top: auto;
    padding-bottom: 10px;
    font-size: 1.2rem;
    color: #333;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-shadow: 0 1px 0 #fff;
  }

  /* --- POWER ON STATE --- */
  ${(props) =>
    props.$isPowered &&
    `
    .heater {
      background-color: #fff;
      box-shadow: 0 0 5px #fff, 0 0 10px var(--filament-on), 0 0 20px var(--filament-on);
    }

    .glow-aura {
      opacity: 0.8;
    }

    .switch-lever {
      transform: translate(-50%, -50%) rotateX(45deg);
      box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.4);
    }

    .jewel-light {
      background-color: var(--jewel-on);
      box-shadow: 0 0 15px var(--jewel-on);
    }

    .backlight {
      opacity: 1;
    }
  `}
`;

export default TubeAmplifier;
