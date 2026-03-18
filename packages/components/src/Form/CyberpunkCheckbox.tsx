import React from 'react';
import styled from 'styled-components';

export interface CyberpunkCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CyberpunkCheckbox: React.FC<CyberpunkCheckboxProps> = ({
  checked = false,
  onChange,
  color = '#ff00ff',
  label,
  disabled = false,
  className,
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
    <StyledWrapper $color={color} $disabled={disabled} className={className}>
      <div className="cyberpunk-checkbox-container">
        <label className="cyber-checkbox">
          <input
            type="checkbox"
            id="cyber-toggle"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
          />
          <span className="checkbox">
            <span className="core" />
            <span className="ring" />
            <span className="check-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </span>
          <div className="glow-layer" />
          <div className="pulse-layer" />
          <div className="glitch-layer" />
        </label>
        {label && <span className="label-text">{label}</span>}
      </div>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $disabled: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .cyberpunk-checkbox-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .cyber-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    user-select: none;
  }

  .cyber-checkbox input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox {
    position: relative;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #1a0033, #0a0f1f);
    border: 2px solid ${(props) => props.$color};
    border-radius: 8px;
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.5),
      inset -3px -3px 6px rgba(51, 25, 77, 0.2),
      0 0 10px
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, 0.3)`;
        }};
    transition: all 0.3s ease;
    transform: translateZ(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  }

  .check-icon {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .label-text {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.$color};
    text-shadow: 0 0 5px
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
      }};
    transition: all 0.3s ease;
  }

  .glow-layer {
    position: absolute;
    inset: -10px;
    border-radius: 12px;
    background: radial-gradient(
      circle,
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.2)`;
      }},
      transparent 70%
    );
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .glitch-layer {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: transparent;
    opacity: 0;
    z-index: 1;
  }

  /* Hover Effect */
  .cyber-checkbox:hover:not(:has(input:disabled)) .checkbox {
    transform: translateZ(15px) scale(1.05);
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.5),
      inset -3px -3px 6px rgba(51, 25, 77, 0.3),
      0 0 15px
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, 0.5)`;
        }};
  }

  .cyber-checkbox:hover:not(:has(input:disabled)) .label-text {
    color: ${(props) => {
      const hex = props.$color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const factor = 1.2;
      return `rgb(${Math.min(255, Math.floor(r * factor))}, ${Math.min(255, Math.floor(g * factor))}, ${Math.min(255, Math.floor(b * factor))})`;
    }};
    text-shadow: 0 0 8px
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      }};
  }

  .cyber-checkbox:hover:not(:has(input:disabled)) .glow-layer {
    opacity: 0.5;
  }

  /* Checked State */
  .cyber-checkbox input:checked + .checkbox {
    background: linear-gradient(135deg, ${(props) => props.$color}, #0a0f1f);
    border-color: ${(props) => props.$color};
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.5),
      inset -3px -3px 6px
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, 0.2)`;
        }},
      0 0 15px
        ${(props) => {
          const hex = props.$color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, 0.5)`;
        }};
    animation: glitch 0.5s ease forwards;
  }

  .cyber-checkbox input:checked + .checkbox .check-icon {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    animation: check-bounce 0.4s ease-out;
  }

  .cyber-checkbox input:checked ~ .label-text {
    color: ${(props) => props.$color};
    text-shadow: 0 0 8px
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      }};
  }

  .cyber-checkbox input:checked ~ .glow-layer {
    background: radial-gradient(
      circle,
      ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.2)`;
      }},
      transparent 70%
    );
    opacity: 1;
  }

  .cyber-checkbox input:checked ~ .glitch-layer {
    opacity: 1;
    animation: glitch-flash 0.5s ease forwards;
  }

  /* Animations */
  @keyframes glitch {
    0% {
      transform: translateZ(10px) skew(0deg);
    }
    20% {
      transform: translateZ(15px) skew(5deg);
    }
    40% {
      transform: translateZ(10px) skew(-3deg);
    }
    60% {
      transform: translateZ(15px) skew(2deg);
    }
    80% {
      transform: translateZ(10px) skew(-1deg);
    }
    100% {
      transform: translateZ(15px) skew(0deg);
    }
  }

  @keyframes glitch-flash {
    0%,
    100% {
      opacity: 0;
    }
    10% {
      opacity: 0.5;
      background: ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      }};
      transform: translate(2px, -1px);
    }
    30% {
      opacity: 0.3;
      background: ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      }};
      transform: translate(-1px, 2px);
    }
    50% {
      opacity: 0.4;
      background: ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      }};
      transform: translate(1px, -2px);
    }
    70% {
      opacity: 0.2;
      background: ${(props) => {
        const hex = props.$color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      }};
      transform: translate(-2px, 1px);
    }
  }

  @keyframes check-bounce {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  /* Idle Animation */
  .checkbox {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateZ(10px) translateY(0);
    }
    50% {
      transform: translateZ(12px) translateY(-3px);
    }
  }

  .cyber-checkbox:hover:not(:has(input:disabled)) .checkbox {
    animation: none;
  }
`;

export default CyberpunkCheckbox;
