import React from 'react';
import styled from 'styled-components';

export interface NeonBorderButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  className?: string;
}

const NeonBorderButton: React.FC<NeonBorderButtonProps> = ({
  children = 'Button',
  onClick,
  color = '#ff0000',
  disabled = false,
  className,
}) => {
  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);

  return (
    <StyledWrapper className={className} $color={color} $rgb={rgb}>
      <button onClick={onClick} disabled={disabled}>
        <span>{children}</span>
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="left"></div>
        <div className="right"></div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string; $rgb: { r: number; g: number; b: number } }>`
  button {
    padding: 20px 60px;
    background-color: #000;
    border: none;
    font-size: 18px;
    position: relative;
    transition: 500ms;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  button span {
    color: gray;
    position: relative;
    transition: 500ms;
    transition-delay: 500ms;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }

  button:before {
    content: '';
    position: absolute;
    width: 0%;
    height: 0%;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    transition: 500ms;
    transition-delay: 500ms;
    background-color: ${(props) => props.$color};
    box-shadow:
      0 0 10px ${(props) => props.$color},
      0 0 30px ${(props) => props.$color},
      0 0 50px ${(props) => props.$color};
  }

  button div {
    transition: 500ms;
    position: absolute;
    background-color: ${(props) => props.$color};
    box-shadow:
      0 0 15px ${(props) => props.$color},
      0 0 30px ${(props) => props.$color},
      0 0 50px ${(props) => props.$color};
  }

  button .top {
    width: 15px;
    height: 2px;
    top: 0;
    left: 0;
  }

  button .bottom {
    width: 15px;
    height: 2px;
    bottom: 0;
    right: 0;
  }

  button .left {
    width: 2px;
    height: 15px;
    top: 0;
    left: 0;
  }

  button .right {
    width: 2px;
    height: 15px;
    bottom: 0;
    right: 0;
  }

  button:hover {
    color: #000;
  }

  button:hover span {
    color: #000;
  }

  button:hover:before {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  button:hover .top,
  button:hover .bottom {
    width: 100%;
  }

  button:hover .left,
  button:hover .right {
    height: 100%;
  }

  button:disabled {
    cursor: not-allowed;
  }

  button:disabled:hover span {
    color: gray;
  }

  button:disabled:hover:before {
    width: 0%;
    height: 0%;
    top: 50%;
    left: 50%;
    right: 50%;
    bottom: 50%;
  }

  button:disabled:hover .top,
  button:disabled:hover .bottom {
    width: 15px;
  }

  button:disabled:hover .left,
  button:disabled:hover .right {
    height: 15px;
  }
`;

export default NeonBorderButton;
