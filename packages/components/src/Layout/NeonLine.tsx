/**
 * NeonLine Component
 * Decorative neon line for HUD frames with glow effect
 */

import React from 'react';
import styled from 'styled-components';

export interface NeonLineProps {
  className?: string;
  color?: string;
  shadow?: boolean;
}

const StyledLine = styled.div<{ $color: string; $shadow: boolean }>`
  position: absolute;
  background-color: ${props => props.$shadow ? props.$color : props.$color};
  pointer-events: none;
  
  ${props => props.$shadow && `
    box-shadow: 
      0 0 6px ${props.$color},
      0 0 12px ${props.$color},
      0 0 24px ${props.$color};
    opacity: 0.9;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: neonLineGlow 3s linear infinite;
  `}

  @keyframes neonLineGlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export function NeonLine({
  className = '',
  color = '#29F2DF',
  shadow = false,
}: NeonLineProps) {
  return (
    <StyledLine 
      className={className} 
      $color={color}
      $shadow={shadow}
    />
  );
}

export default NeonLine;
