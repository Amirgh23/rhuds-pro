import React from 'react';
import styled from 'styled-components';

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: string;
  colorOpacity?: string;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  color = '#00ffff',
  colorOpacity = '#00ffff1c',
  label,
  disabled = false,
  size = 'medium',
}) => {
  const [isChecked, setIsChecked] = React.useState(checked);

  const handleChange = () => {
    if (!disabled) {
      const newState = !isChecked;
      setIsChecked(newState);
      onChange?.(newState);
    }
  };

  return (
    <StyledWrapper $color={color} $colorOpacity={colorOpacity} $size={size} $disabled={disabled}>
      <div className="toggle-container">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="toggle-input"
        />
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
        {label && <label className="toggle-label">{label}</label>}
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $colorOpacity: string;
  $size: 'small' | 'medium' | 'large';
  $disabled: boolean;
}

const sizeConfig = {
  small: { trackWidth: '40px', trackHeight: '20px', thumbSize: '16px' },
  medium: { trackWidth: '56px', trackHeight: '28px', thumbSize: '24px' },
  large: { trackWidth: '72px', trackHeight: '36px', thumbSize: '32px' },
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  .toggle-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  }

  .toggle-input {
    display: none;
  }

  .toggle-track {
    position: relative;
    width: ${(props) => sizeConfig[props.$size].trackWidth};
    height: ${(props) => sizeConfig[props.$size].trackHeight};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    transition: all 0.3s ease;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  }

  .toggle-thumb {
    position: absolute;
    width: ${(props) => sizeConfig[props.$size].thumbSize};
    height: ${(props) => sizeConfig[props.$size].thumbSize};
    background: linear-gradient(135deg, ${(props) => props.$color}, ${(props) => props.$color}dd);
    border-radius: 50%;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    transition: all 0.3s cubic-bezier(0.37, 1.95, 0.66, 0.56);
    box-shadow: 0 0 10px ${(props) => props.$colorOpacity};
  }

  .toggle-input:checked ~ .toggle-track {
    background: ${(props) => props.$colorOpacity};
    border-color: ${(props) => props.$color};
    box-shadow: 0 0 15px ${(props) => props.$colorOpacity};
  }

  .toggle-input:checked ~ .toggle-track .toggle-thumb {
    left: calc(100% - ${(props) => sizeConfig[props.$size].thumbSize} - 2px);
    box-shadow: 0 0 20px ${(props) => props.$color};
  }

  .toggle-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    user-select: none;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  }
`;

export default ToggleSwitch;
