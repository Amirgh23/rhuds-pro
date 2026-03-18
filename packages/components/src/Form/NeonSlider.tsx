import React from 'react';
import styled from 'styled-components';

export interface NeonSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  colorOpacity?: string;
  label?: string;
  disabled?: boolean;
  showValue?: boolean;
}

const NeonSlider: React.FC<NeonSliderProps> = ({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = '#00ffff',
  colorOpacity = '#00ffff1c',
  label,
  disabled = false,
  showValue = true,
}) => {
  const [currentValue, setCurrentValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <StyledWrapper $color={color} $colorOpacity={colorOpacity} $disabled={disabled}>
      <div className="slider-container">
        {label && <label className="slider-label">{label}</label>}
        <div className="slider-wrapper">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            className="slider-input"
            style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
          />
          <div className="slider-track">
            <div className="slider-fill" style={{ width: `${percentage}%` }} />
          </div>
          <div className="slider-thumb" style={{ left: `${percentage}%` }} />
        </div>
        {showValue && <div className="slider-value">{currentValue}</div>}
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $colorOpacity: string;
  $disabled: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  }

  .slider-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .slider-wrapper {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .slider-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    z-index: 5;
  }

  .slider-track {
    position: absolute;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  .slider-fill {
    position: absolute;
    height: 100%;
    background: linear-gradient(90deg, ${(props) => props.$color}, ${(props) => props.$color}dd);
    border-radius: 2px;
    box-shadow: 0 0 10px ${(props) => props.$colorOpacity};
    transition: box-shadow 0.3s ease;
  }

  .slider-thumb {
    position: absolute;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, ${(props) => props.$color}, ${(props) => props.$color}dd);
    border: 2px solid ${(props) => props.$color};
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    box-shadow:
      0 0 15px ${(props) => props.$colorOpacity},
      inset 0 0 10px ${(props) => props.$colorOpacity};
    transition: all 0.2s ease;
  }

  .slider-input:hover:not(:disabled) ~ .slider-thumb {
    box-shadow:
      0 0 25px ${(props) => props.$color},
      inset 0 0 15px ${(props) => props.$colorOpacity};
    transform: translate(-50%, -50%) scale(1.1);
  }

  .slider-input:active:not(:disabled) ~ .slider-thumb {
    box-shadow:
      0 0 30px ${(props) => props.$color},
      inset 0 0 20px ${(props) => props.$colorOpacity};
    transform: translate(-50%, -50%) scale(1.15);
  }

  .slider-value {
    font-size: 0.85rem;
    color: ${(props) => props.$color};
    font-weight: 600;
    text-align: right;
    min-width: 40px;
    font-family: 'Courier New', monospace;
  }
`;

export default NeonSlider;
