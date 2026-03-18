import React from 'react';
import styled from 'styled-components';

export interface GridPatternButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  hueRotate?: number;
  disabled?: boolean;
  className?: string;
}

const GridPatternButton: React.FC<GridPatternButtonProps> = ({
  children = 'Start',
  onClick,
  color = '#2ed573',
  hueRotate = 0,
  disabled = false,
  className,
}) => {
  return (
    <StyledWrapper $color={color} $hueRotate={hueRotate} $disabled={disabled} className={className}>
      <button className="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  $color: string;
  $hueRotate: number;
  $disabled: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .button {
    --main-color: ${(props) => props.$color};
    --main-bg-color: ${(props) => {
      const hex = props.$color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.36)`;
    }};
    --pattern-color: ${(props) => {
      const hex = props.$color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.073)`;
    }};

    filter: hue-rotate(${(props) => props.$hueRotate}deg);
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    background:
      radial-gradient(circle, var(--main-bg-color) 0%, rgba(0, 0, 0, 0) 95%),
      linear-gradient(var(--pattern-color) 1px, transparent 1px),
      linear-gradient(to right, var(--pattern-color) 1px, transparent 1px);
    background-size:
      cover,
      15px 15px,
      15px 15px;
    background-position:
      center center,
      center center,
      center center;
    border-image: radial-gradient(circle, var(--main-color) 0%, rgba(0, 0, 0, 0) 100%) 1;
    border-width: 1px 0 1px 0;
    color: var(--main-color);
    padding: 1rem 3rem;
    font-weight: 700;
    font-size: 1.5rem;
    transition: all 0.2s ease-in-out;
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

    &:hover:not(:disabled) {
      background-size:
        cover,
        10px 10px,
        10px 10px;
    }

    &:active:not(:disabled) {
      filter: hue-rotate(${(props) => props.$hueRotate + 250}deg);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export default GridPatternButton;
