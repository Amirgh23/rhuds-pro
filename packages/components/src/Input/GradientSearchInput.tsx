import React, { useState } from 'react';
import styled from 'styled-components';

export interface GradientSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  color?: string;
  className?: string;
}

const GradientSearchInput: React.FC<GradientSearchInputProps> = ({
  placeholder = 'Search',
  value = '',
  onChange,
  onSearch,
  color = '#00F260',
  className,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(inputValue);
    }
  };

  // Convert hex color to RGB
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

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper className={className} $color={color} $rgb={rgb}>
      <div className="group">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          className="input"
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string; $rgb: { r: number; g: number; b: number } }>`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 190px;
  }

  .input {
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    width: 100%;
    padding-left: 2.5rem;
    outline: none;
    background: linear-gradient(
      180deg,
      rgb(56, 56, 56) 0%,
      rgb(36, 36, 36) 66%,
      rgb(41, 41, 41) 100%
    );
    color: #fff;
    transition: 0.3s ease;
    border: 2px solid;
    border-image: conic-gradient(
        ${(props) => props.$color},
        #0575e6,
        rgba(
          ${(props) => props.$rgb.r},
          ${(props) => props.$rgb.g},
          ${(props) => props.$rgb.b},
          0.5
        )
      )
      1;
  }

  .input::placeholder {
    color: #fff;
  }

  .input:focus::placeholder {
    color: #999;
  }

  .input:focus {
    box-shadow: 0 0 15px
      rgba(${(props) => props.$rgb.r}, ${(props) => props.$rgb.g}, ${(props) => props.$rgb.b}, 0.3);
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill: #fff;
    width: 1rem;
    height: 1rem;
    transition: 0.3s ease;
  }

  .group:hover .icon {
    fill: ${(props) => props.$color};
  }
`;

export default GradientSearchInput;
