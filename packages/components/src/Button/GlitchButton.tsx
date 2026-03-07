/**
 * GlitchButton Component
 * Retro glitch-style button with VT323 monospace font and glitch effects
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme, useBleeps } from '@rhuds/core';

export interface GlitchButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Button content */
  children?: React.ReactNode;
  
  /** Custom className */
  className?: string;
  
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;

  /** Disabled state */
  disabled?: boolean;
}

const StyledWrapper = styled.div<{ disabled?: boolean }>`
  [class*="btn-glitch-"] {
    display: inline-block;
    font-family: "VT323", monospace, 'Courier New', Courier;
    border: 2px solid #29F2DF;
    color: #29F2DF;
    background: rgba(41, 242, 223, 0.05);
    padding: 10px 13px;
    min-width: 175px;
    line-height: 1.5em;
    white-space: nowrap;
    text-transform: uppercase;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 15px;
    text-decoration: none;
    opacity: ${props => props.disabled ? 0.5 : 1};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    box-shadow: 0 0 10px rgba(41, 242, 223, 0.3),
                inset 0 0 10px rgba(41, 242, 223, 0.1);
    transition: all 0.1s ease;

    .text,
    .decoration {
      display: inline-block;
    }

    .decoration {
      display: inline-block;
      float: right;
    }

    &:hover,
    &:focus {
      animation-name: glitchButtonGlitch;
      animation-duration: 0.2s;
      background-color: rgba(41, 242, 223, 0.2);
      color: #29F2DF;
      border: 2px solid #29F2DF;
      box-shadow: 0 0 20px rgba(41, 242, 223, 0.6),
                  inset 0 0 20px rgba(41, 242, 223, 0.2);

      .text-decoration {
        animation-name: glitchButtonBlink;
        animation-duration: 0.1s;
        animation-iteration-count: infinite;
      }

      .decoration {
        animation-name: glitchButtonBlink;
        animation-duration: 0.1s;
        animation-iteration-count: infinite;
      }
    }

    &:active {
      background: rgba(41, 242, 223, 0.3);
      color: #29F2DF;
      box-shadow: 0 0 15px rgba(41, 242, 223, 0.8),
                  inset 0 0 15px rgba(41, 242, 223, 0.3);

      .text-decoration {
        animation-name: none;
      }

      .decoration {
        animation-name: none;
      }

      &:before,
      &:after {
        display: none;
      }
    }
  }

  @keyframes glitchButtonGlitch {
    25% {
      background-color: rgba(255, 0, 100, 0.3);
      border-color: #ff0064;
      color: #ff0064;
      transform: translateX(-10px);
      letter-spacing: 10px;
      box-shadow: 0 0 20px rgba(255, 0, 100, 0.6);
    }
    35% {
      background-color: rgba(0, 255, 100, 0.3);
      border-color: #00ff64;
      color: #00ff64;
      transform: translate(10px);
      box-shadow: 0 0 20px rgba(0, 255, 100, 0.6);
    }
    59% {
      opacity: 0;
    }
    60% {
      background-color: rgba(100, 100, 255, 0.3);
      border-color: #6464ff;
      color: #6464ff;
      transform: translate(-10px);
      filter: blur(5px);
      box-shadow: 0 0 20px rgba(100, 100, 255, 0.6);
    }
    100% {
      background-color: rgba(41, 242, 223, 0.2);
      border-color: #29F2DF;
      color: #29F2DF;
      filter: blur(0px);
      box-shadow: 0 0 20px rgba(41, 242, 223, 0.6);
    }
  }

  @keyframes glitchButtonBlink {
    50% {
      opacity: 0;
    }
  }

  @keyframes glitchButtonShrink {
    100% {
      width: 10%;
    }
  }
`;

/**
 * GlitchButton Component
 */
export const GlitchButton: React.FC<GlitchButtonProps> = ({
  children = '// Hover me',
  onClick,
  className,
  disabled = false,
  ...props
}) => {
  const { play } = useBleeps();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!disabled) {
      play?.('click');
      onClick?.(e);
    }
  };

  return (
    <StyledWrapper disabled={disabled} className={className}>
      <a className="btn-glitch-fill" onClick={handleClick} {...props}>
        <span className="text">{children}</span>
        <span className="text-decoration"> _</span>
        <span className="decoration">⇒</span>
      </a>
    </StyledWrapper>
  );
};

GlitchButton.displayName = 'GlitchButton';
