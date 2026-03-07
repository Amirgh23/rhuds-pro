/**
 * HudButton Component
 * Futuristic HUD-style button with glowing effects
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme, useBleeps } from '@rhuds/core';

export interface HudButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  
  /** Custom className */
  className?: string;
  
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledWrapper = styled.div`
  button {
    --green: #29F2DF;
    font-size: 15px;
    padding: 0.7em 2.7em;
    letter-spacing: 0.06em;
    position: relative;
    font-family: inherit;
    border-radius: 0.6em;
    overflow: hidden;
    transition: all 0.3s;
    line-height: 1.4em;
    border: 2px solid var(--green);
    background: linear-gradient(
      to right,
      rgba(27, 253, 156, 0.1) 1%,
      transparent 40%,
      transparent 60%,
      rgba(27, 253, 156, 0.1) 100%
    );
    color: var(--green);
    box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4),
      0 0 9px 3px rgba(27, 253, 156, 0.1);
    cursor: pointer;
  }

  button:hover {
    color: #82ffc9;
    box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6),
      0 0 9px 3px rgba(27, 253, 156, 0.2);
  }

  button:before {
    content: '';
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform 0.4s ease-in-out;
    background: linear-gradient(
      to right,
      transparent 1%,
      rgba(27, 253, 156, 0.1) 40%,
      rgba(27, 253, 156, 0.1) 60%,
      transparent 100%
    );
  }

  button:hover:before {
    transform: translateX(15em);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:disabled:hover {
    color: var(--green);
    box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4),
      0 0 9px 3px rgba(27, 253, 156, 0.1);
  }

  button:disabled:before {
    transform: none;
  }
`;

/**
 * HudButton Component
 */
export const HudButton: React.FC<HudButtonProps> = ({
  children,
  onClick,
  className,
  ...props
}) => {
  const { play } = useBleeps();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled) {
      play?.('click');
      onClick?.(e);
    }
  };

  return (
    <StyledWrapper className={className}>
      <button onClick={handleClick} {...props}>
        {children}
      </button>
    </StyledWrapper>
  );
};

HudButton.displayName = 'HudButton';
