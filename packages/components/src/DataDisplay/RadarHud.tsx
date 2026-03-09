/**
 * RadarHud Component
 * Military/Tech radar display with rotating scanner and target dots
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface RadarHudProps {
  coordinates?: string;
  depth?: string;
  wind?: string;
  color?: string;
  size?: number;
  className?: string;
}

// Keyframe animations with unique names
const radarHudRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div<{ $size: number }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size + 100}px;
  background-color: rgba(41, 242, 223, 0.08);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #2fbb39;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid rgba(41, 242, 223, 0.2);
`;

const DataDisplay = styled.div<{ $color: string }>`
  margin-top: 5px;
  border: 2px solid ${props => props.$color};
  padding: 15px;
  border-radius: 5px;
  background: rgba(10, 18, 37, 0.5);
  position: relative;
  font-family: 'Orbitron', 'Fira Code', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-align: center;
  color: ${props => props.$color};

  &::after {
    background: rgba(10, 18, 37, 0.5);
    content: attr(data-wind);
    position: absolute;
    bottom: -35px;
    right: 5%;
    border: 2px solid ${props => props.$color};
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.7em;
  }

  &::before {
    content: attr(data-depth);
    position: absolute;
    bottom: -35px;
    left: 5%;
    border: 2px solid ${props => props.$color};
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.7em;
    background: rgba(10, 18, 37, 0.5);
  }
`;

const RadarCard = styled.div<{ $color: string; $size: number }>`
  width: ${props => props.$size - 80}px;
  height: ${props => props.$size - 80}px;
  background: rgba(10, 18, 37, 0.4);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.$color};
  overflow: hidden;
  margin-top: 30px;

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: ${props => props.$size - 80}px;
    left: 49%;
    background-color: ${props => props.$color};
    animation: ${radarHudRotate} 3s linear infinite;
    z-index: 6;
  }

  &::before {
    content: '';
    position: absolute;
    width: 0px;
    height: ${props => props.$size - 80}px;
    left: 49%;
    transform: rotate(-4deg);
    background-color: ${props => props.$color};
    animation: ${radarHudRotate} 3s linear infinite;
    box-shadow: 0 0 10px 10px ${props => props.$color}99;
    z-index: 6;
  }
`;

const Circle = styled.div<{ $color: string; $size: number }>`
  width: ${props => (props.$size - 80) / 2}px;
  height: ${props => (props.$size - 80) / 2}px;
  border: 2px solid ${props => props.$color};
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    width: ${props => (props.$size - 80) / 4}px;
    height: ${props => (props.$size - 80) / 4}px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid ${props => props.$color};
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: ${props => (props.$size - 80) * 0.75}px;
    height: ${props => (props.$size - 80) * 0.75}px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid ${props => props.$color};
    border-radius: 50%;
  }
`;

const Dot = styled.div<{ $color: string; $top: string; $left?: string; $right?: string; $delay: number }>`
  width: 4px;
  height: 4px;
  top: ${props => props.$top};
  ${props => props.$left && `left: ${props.$left};`}
  ${props => props.$right && `right: ${props.$right};`}
  background-color: ${props => props.$color};
  border-radius: 50%;
  position: absolute;
  animation: ${props => {
    const dotPulse = keyframes`
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 10px 5px ${props.$color}4D,
                    0 0 10px 10px ${props.$color}4D;
      }
      60% {
        transform: scale(0.95);
        box-shadow: 0 0 10px 5px ${props.$color}4D,
                    0 0 10px 10px ${props.$color}4D;
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 ${props.$color}B3,
                    0 0 0 0 ${props.$color}80,
                    0 0 0 0 ${props.$color}4D;
        opacity: 0;
      }
    `;
    return dotPulse;
  }} 1.5s ${props => props.$delay}s ease infinite;
`;

export function RadarHud({
  coordinates = "34° 36' 30\" S; 58° 22' 16\" O",
  depth = 'DEPT - 600',
  wind = 'WIND - 54.3',
  color = '#18D322',
  size = 280,
  className = '',
}: RadarHudProps) {
  return (
    <Container $size={size} className={className}>
      <DataDisplay $color={color} data-depth={depth} data-wind={wind}>
        {coordinates}
      </DataDisplay>
      <RadarCard $color={color} $size={size}>
        <Circle $color={color} $size={size} />
        <Dot $color={color} $top="30%" $left="50%" $delay={0} />
        <Dot $color={color} $top="80%" $right="30%" $delay={1.2} />
      </RadarCard>
    </Container>
  );
}

export default RadarHud;
