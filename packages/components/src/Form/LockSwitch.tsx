import React, { useState } from 'react';
import styled from 'styled-components';

export interface LockSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onColor?: string;
  offColor?: string;
  disabled?: boolean;
  className?: string;
}

const LockSwitch: React.FC<LockSwitchProps> = ({
  checked = false,
  onChange,
  onColor = '#00ff88',
  offColor = '#ff0000',
  disabled = false,
  className,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    if (disabled) return;
    const newState = !isChecked;
    setIsChecked(newState);
    onChange?.(newState);
  };

  return (
    <StyledWrapper
      className={className}
      $onColor={onColor}
      $offColor={offColor}
      $isChecked={isChecked}
      $disabled={disabled}
    >
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          className="peer sr-only"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="switch-track" />
        <svg
          className="lock-icon lock-closed"
          height={100}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100"
          width={100}
          x={0}
          xmlns="http://www.w3.org/2000/svg"
          y={0}
        >
          <path d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z" />
        </svg>
        <svg
          className="lock-icon lock-open"
          height={100}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100"
          width={100}
          x={0}
          xmlns="http://www.w3.org/2000/svg"
          y={0}
        >
          <path
            d="M30,46V38a20,20,0,0,1,40,0v8a8,8,0,0,1,8,8V74a8,8,0,0,1-8,8H30a8,8,0,0,1-8-8V54A8,8,0,0,1,30,46Zm32-8v8H38V38a12,12,0,0,1,24,0Z"
            fillRule="evenodd"
          />
        </svg>
        <div className="switch-thumb" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{
  $onColor: string;
  $offColor: string;
  $isChecked: boolean;
  $disabled: boolean;
}>`
  label {
    position: relative;
    display: inline-flex;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    align-items: center;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .switch-track {
    border: 1px solid #666;
    box-shadow: ${(props) =>
      props.$isChecked
        ? `0 0 10px ${props.$onColor}, 0 0 30px ${props.$onColor}, inset 0 0 10px ${props.$onColor}`
        : `0 0 10px ${props.$offColor}, 0 0 30px ${props.$offColor}`};
    border-radius: 6px;
    display: flex;
    height: 24px;
    width: 48px;
    align-items: center;
    outline: none;
    background-color: ${(props) => (props.$isChecked ? props.$onColor : props.$offColor)};
    padding-left: ${(props) => (props.$isChecked ? '28px' : '4px')};
    text-white;
    transition: all 300ms;
    position: relative;
  }

  .lock-icon {
    position: absolute;
    left: 8px;
    stroke: #1a1a1a;
    width: 20px;
    height: 20px;
    transition: all 500ms;
  }

  .lock-closed {
    opacity: ${(props) => (props.$isChecked ? 0 : 1)};
  }

  .lock-open {
    opacity: ${(props) => (props.$isChecked ? 1 : 0)};
    left: 24px;
  }

  .switch-thumb {
    position: absolute;
    left: ${(props) => (props.$isChecked ? '28px' : '2px')};
    top: 2px;
    display: flex;
    height: 20px;
    width: 16px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 300ms;
  }

  input:checked ~ .switch-track {
    background-color: ${(props) => props.$onColor};
    padding-left: 28px;
  }

  input:checked ~ .switch-thumb {
    left: 28px;
  }

  input:focus ~ .switch-track {
    outline: none;
  }

  input:disabled {
    cursor: not-allowed;
  }
`;

export default LockSwitch;
