import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface NeonRadioOption {
  value: string;
  label: string;
}

export interface NeonRadioProps {
  options: NeonRadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export const NeonRadio: React.FC<NeonRadioProps> = ({
  options,
  value,
  onChange,
  name = 'neon-radio',
  className,
}) => {
  const handleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <StyledWrapper className={className}>
      <form className="container">
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <input
              className="input-btn"
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
            />
            <label className="neon-btn" htmlFor={`${name}-${option.value}`}>
              <span className="span" />
              <span className="txt">{option.label}</span>
            </label>
          </React.Fragment>
        ))}
      </form>
    </StyledWrapper>
  );
};

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const colorchange = keyframes`
  0% {
    text-shadow: 0 0 8px rgba(41, 242, 223, 0.8), 0 0 12px rgba(27, 253, 156, 0.6);
  }
  50% {
    text-shadow: 0 0 15px rgba(41, 242, 223, 1), 0 0 20px rgba(27, 253, 156, 0.8);
  }
  100% {
    text-shadow: 0 0 8px rgba(41, 242, 223, 0.8), 0 0 12px rgba(27, 253, 156, 0.6);
  }
`;

const StyledWrapper = styled.div`
  .container {
    font-family: 'Orbitron', 'Courier New', monospace;
    font-style: italic;
    font-weight: bold;
    font-size: 1.2em;
    display: grid;
    gap: 2em;
    place-content: center;
    width: 400px;
  }

  .container input[type='radio'] {
    display: none;
  }

  .input-btn:is(:checked) + .neon-btn .span {
    inset: 2px;
    background-color: rgba(41, 242, 223, 0.2);
    background: repeating-linear-gradient(
        to bottom,
        transparent 0%,
        rgba(41, 242, 223, 0.3) 1px,
        rgba(41, 242, 223, 0.2) 3px,
        rgba(41, 242, 223, 0.15) 5px,
        rgba(41, 242, 223, 0.1) 4px,
        transparent 0.5%
      ),
      repeating-linear-gradient(
        to left,
        rgba(10, 14, 39, 0.95) 100%,
        rgba(10, 14, 39, 0.98) 100%
      );
    box-shadow: inset 0 40px 20px rgba(41, 242, 223, 0.1);
  }

  .input-btn:is(:checked) + .neon-btn .txt {
    text-shadow: 0 0 8px rgba(41, 242, 223, 0.8),
      0 0 12px rgba(27, 253, 156, 0.6);
    color: #ffffff;
    animation: ${colorchange} 0.3s ease;
  }

  .input-btn:is(:checked) + .neon-btn::before {
    animation-duration: 0.6s;
  }

  .input-btn:is(:checked) + .neon-btn::after {
    animation-duration: 0.6s;
  }

  .neon-btn {
    width: 300px;
    height: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em 5em;
    text-align: right;
    background: transparent;
    position: relative;
    overflow: hidden;
    transition: all 2s ease-in-out;
    clip-path: polygon(
      6% 0,
      93% 0,
      100% 8%,
      100% 86%,
      90% 89%,
      88% 100%,
      5% 100%,
      0% 85%
    );
  }

  .neon-btn .span {
    display: flex;
    clip-path: polygon(
      6% 0,
      93% 0,
      100% 8%,
      100% 86%,
      90% 89%,
      88% 100%,
      5% 100%,
      0% 85%
    );
    position: absolute;
    inset: 1px;
    background-color: #0a0e27;
    z-index: 1;
  }

  .neon-btn .txt {
    text-align: right;
    position: relative;
    z-index: 2;
    color: #ffffff;
    font-size: 1em;
    transition: all ease-in-out 2s linear;
    text-shadow: 0 0 3px rgba(41, 242, 223, 0.5);
  }

  .neon-btn::before {
    content: '';
    position: absolute;
    height: 300px;
    aspect-ratio: 1.5/1;
    box-shadow: -17px -19px 20px rgba(27, 253, 156, 0.5);
    background-image: conic-gradient(
      rgba(27, 253, 156, 0.8),
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      rgba(27, 253, 156, 0.8)
    );
    animation: ${rotate} 4s linear infinite -2s;
  }

  .neon-btn::after {
    content: '';
    position: absolute;
    height: 300px;
    aspect-ratio: 1.5/1;
    box-shadow: -17px -19px 10px rgba(41, 242, 223, 0.5);
    background-image: conic-gradient(
      rgba(41, 242, 223, 0.8),
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      rgba(41, 242, 223, 0.8)
    );
    animation: ${rotate} 4s linear infinite;
  }
`;

export default NeonRadio;
