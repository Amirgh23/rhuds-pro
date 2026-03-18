import React, { useState } from 'react';
import styled from 'styled-components';

export interface CyberpunkRadioOption {
  value: string;
  label: string;
}

export interface CyberpunkRadioProps {
  options: CyberpunkRadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  color?: string;
  className?: string;
}

const CyberpunkRadio: React.FC<CyberpunkRadioProps> = ({
  options,
  value,
  onChange,
  color = '#00a6ff',
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value || options[0]?.value || '');

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 166, b: 255 };
  };

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper $color={color} $rgb={rgb} className={className}>
      <div className="fullscreen-container">
        <div className="radio-group-container">
          {options.map((option, index) => (
            <label key={option.value} className="radio-label">
              <input
                type="radio"
                name="cyberpunk-radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleChange(option.value)}
                className="radio-input"
              />
              <span className="radio-custom" />
              <span className="radio-text">{option.label}</span>
            </label>
          ))}
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
  .fullscreen-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 20px 0;
    box-sizing: border-box;
  }

  .radio-group-container {
    background-color: rgba(26, 27, 40, 0.7);
    padding: 20px 35px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.055);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    width: 90%;
    max-width: 280px;
    transition: all 0.3s ease;
  }

  .radio-label {
    display: flex;
    align-items: center;
    margin: 30px 0;
    cursor: pointer;
    position: relative;
    user-select: none;
  }

  .radio-input {
    display: none;
  }

  .radio-custom {
    width: 22px;
    height: 22px;
    background-color: transparent;
    border: 2px solid #5c5e79;
    border-radius: 50%;
    margin-right: 18px;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .radio-custom::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: ${(props) => props.$color};
    border-radius: 50%;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .radio-custom::after {
    content: '';
    position: absolute;
    width: 34px;
    height: 34px;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: ${(props) => props.$color};
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.4s ease;
  }

  .radio-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #c1c3d9;
    transition: color 0.3s ease;
  }

  .radio-label:hover .radio-input:not(:checked) + .radio-custom {
    transform: scale(1.1);
    border-color: #8a8daf;
  }

  .radio-label:hover .radio-text {
    color: #e2e4f4;
  }

  .radio-input:checked + .radio-custom {
    border-color: ${(props) => props.$color};
    transform: scale(0.9);
  }

  .radio-input:checked + .radio-custom::before {
    transform: scale(1);
  }

  .radio-input:checked + .radio-custom::after {
    opacity: 1;
    transform: scale(1.3);
    animation: orbit 2.5s infinite linear;
    box-shadow:
      0 0 30px ${(props) => props.$color},
      0 0 80px
        rgba(
          ${(props) => props.$rgb.r},
          ${(props) => props.$rgb.g},
          ${(props) => props.$rgb.b},
          0.2
        );
  }

  .radio-input:checked ~ .radio-text {
    color: #ffffff;
    font-weight: 700;
  }

  @keyframes orbit {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 400px) {
    .radio-group-container {
      padding: 15px 25px;
    }

    .radio-label {
      margin: 25px 0;
    }

    .radio-text {
      font-size: 1rem;
    }
  }
`;

export default CyberpunkRadio;
