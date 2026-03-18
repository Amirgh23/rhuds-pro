import React, { useState } from 'react';
import styled from 'styled-components';

export interface FloatingLabelInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  color?: string;
  type?: string;
  className?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label = 'Label',
  placeholder = '',
  value = '',
  onChange,
  onFocus,
  onBlur,
  color = '#ac2eac',
  type = 'text',
  className,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <StyledWrapper
      className={className}
      $color={color}
      $isFocused={isFocused || inputValue.length > 0}
    >
      <div className="input-container">
        <input
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
        <label className="label">{label}</label>
        <div className="underline"></div>
        <div className="sideline"></div>
        <div className="upperline"></div>
        <div className="line"></div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string; $isFocused: boolean }>`
  .input-container {
    position: relative;
    margin: 50px auto;
    width: 190px;
  }

  .input-container input[type='text'],
  .input-container input[type='email'],
  .input-container input[type='password'],
  .input-container input[type='number'] {
    font-size: 20px;
    color: rgb(255, 255, 255);
    border: none;
    border-bottom: 2px solid #a5a2a2;
    outline: none;
    width: 100%;
    background-color: transparent;
  }

  .label {
    transition: all 0.3s ease;
    color: #d3d2d2;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .input-container input[type='text']:focus ~ .label,
  .input-container input[type='text']:valid ~ .label,
  .input-container input[type='email']:focus ~ .label,
  .input-container input[type='email']:valid ~ .label,
  .input-container input[type='password']:focus ~ .label,
  .input-container input[type='password']:valid ~ .label,
  .input-container input[type='number']:focus ~ .label,
  .input-container input[type='number']:valid ~ .label {
    top: -20px;
    transition: 0.3s;
    color: ${(props) => props.$color};
  }

  .input-container .underline {
    position: absolute;
    bottom: 4px;
    left: -7px;
    height: 2px;
    width: 110%;
    background-color: ${(props) => props.$color};
    transform: scaleX(0);
  }

  .input-container .sideline {
    position: relative;
    bottom: 15px;
    right: 18px;
    height: 2px;
    width: 18%;
    background-color: ${(props) => props.$color};
    transform: scaleX(0);
    rotate: 90deg;
  }

  .input-container .upperline {
    position: absolute;
    bottom: 30px;
    left: -8px;
    height: 2px;
    width: 110%;
    background-color: ${(props) => props.$color};
    transform: scaleX(0);
  }

  .input-container .line {
    position: relative;
    bottom: 17px;
    left: 178px;
    height: 2px;
    width: 18%;
    background-color: ${(props) => props.$color};
    transform: scaleX(0);
    rotate: 90deg;
  }

  .input-container input[type='text']:focus ~ .underline,
  .input-container input[type='text']:valid ~ .underline,
  .input-container input[type='email']:focus ~ .underline,
  .input-container input[type='email']:valid ~ .underline,
  .input-container input[type='password']:focus ~ .underline,
  .input-container input[type='password']:valid ~ .underline,
  .input-container input[type='number']:focus ~ .underline,
  .input-container input[type='number']:valid ~ .underline {
    transform: scaleX(1);
    transition: 1s;
  }

  .input-container input[type='text']:focus ~ .sideline,
  .input-container input[type='text']:valid ~ .sideline,
  .input-container input[type='email']:focus ~ .sideline,
  .input-container input[type='email']:valid ~ .sideline,
  .input-container input[type='password']:focus ~ .sideline,
  .input-container input[type='password']:valid ~ .sideline,
  .input-container input[type='number']:focus ~ .sideline,
  .input-container input[type='number']:valid ~ .sideline {
    transform: scaleX(1);
    transition: 1s;
  }

  .input-container input[type='text']:focus ~ .upperline,
  .input-container input[type='text']:valid ~ .upperline,
  .input-container input[type='email']:focus ~ .upperline,
  .input-container input[type='email']:valid ~ .upperline,
  .input-container input[type='password']:focus ~ .upperline,
  .input-container input[type='password']:valid ~ .upperline,
  .input-container input[type='number']:focus ~ .upperline,
  .input-container input[type='number']:valid ~ .upperline {
    transform: scaleX(1);
    transition: 1s;
  }

  .input-container input[type='text']:focus ~ .line,
  .input-container input[type='text']:valid ~ .line,
  .input-container input[type='email']:focus ~ .line,
  .input-container input[type='email']:valid ~ .line,
  .input-container input[type='password']:focus ~ .line,
  .input-container input[type='password']:valid ~ .line,
  .input-container input[type='number']:focus ~ .line,
  .input-container input[type='number']:valid ~ .line {
    transform: scaleX(1);
    transition: 1s;
  }
`;

export default FloatingLabelInput;
