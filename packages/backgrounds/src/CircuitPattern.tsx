/**
 * CircuitPattern Component
 * Dark circuit board background with grid lines and connection dots
 */

import React from 'react';
import styled from 'styled-components';

export interface CircuitPatternProps {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

const Wrapper = styled.div<{ $width: number; $height: number }>`
  min-height: ${props => props.$height}px;
  width: ${props => props.$width}px;
  position: relative;
  background-color: #0f0f0f;
`;

const Background = styled.div<{ $color: string; $opacity: number }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      ${props => props.$color} 19px,
      ${props => props.$color} 20px,
      transparent 20px,
      transparent 39px,
      ${props => props.$color} 39px,
      ${props => props.$color} 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      ${props => props.$color} 19px,
      ${props => props.$color} 20px,
      transparent 20px,
      transparent 39px,
      ${props => props.$color} 39px,
      ${props => props.$color} 40px
    ),
    radial-gradient(
      circle at 20px 20px,
      ${props => props.$color.replace(/[\d.]+\)$/, `${props.$opacity * 1.2})`)} 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 40px 40px,
      ${props => props.$color.replace(/[\d.]+\)$/, `${props.$opacity * 1.2})`)} 2px,
      transparent 2px
    );
  background-size: 40px 40px, 40px 40px, 40px 40px, 40px 40px;
`;

export function CircuitPattern({
  width = 600,
  height = 400,
  color = 'rgba(34, 197, 94, 0.15)',
  opacity = 1,
  className = '',
}: CircuitPatternProps) {
  return (
    <Wrapper $width={width} $height={height} className={className}>
      <Background $color={color} $opacity={opacity} />
    </Wrapper>
  );
}

export default CircuitPattern;
