/**
 * HackerLoader Component
 * Hacker-themed progress bar with glitch effects and particles
 */

import React from 'react';
import styled, { keyframes, css } from 'styled-components';

export interface HackerLoaderProps {
  text?: string;
  progress?: number; // 0-100, if provided shows static progress instead of animation
  color?: string;
  className?: string;
}

// Keyframe animations with unique names
const hackerLoaderGlitchEffect = keyframes`
  0% { clip: rect(42px, 9999px, 44px, 0); }
  5% { clip: rect(12px, 9999px, 59px, 0); }
  10% { clip: rect(48px, 9999px, 29px, 0); }
  15% { clip: rect(42px, 9999px, 73px, 0); }
  20% { clip: rect(63px, 9999px, 27px, 0); }
  25% { clip: rect(34px, 9999px, 55px, 0); }
  30% { clip: rect(86px, 9999px, 73px, 0); }
  35% { clip: rect(20px, 9999px, 20px, 0); }
  40% { clip: rect(26px, 9999px, 60px, 0); }
  45% { clip: rect(25px, 9999px, 66px, 0); }
  50% { clip: rect(57px, 9999px, 98px, 0); }
  55% { clip: rect(5px, 9999px, 46px, 0); }
  60% { clip: rect(82px, 9999px, 31px, 0); }
  65% { clip: rect(54px, 9999px, 27px, 0); }
  70% { clip: rect(28px, 9999px, 99px, 0); }
  75% { clip: rect(45px, 9999px, 69px, 0); }
  80% { clip: rect(23px, 9999px, 85px, 0); }
  85% { clip: rect(54px, 9999px, 84px, 0); }
  90% { clip: rect(45px, 9999px, 47px, 0); }
  95% { clip: rect(37px, 9999px, 20px, 0); }
  100% { clip: rect(4px, 9999px, 91px, 0); }
`;

const hackerLoaderBarFill = keyframes`
  0%, 100% { width: 0; }
  50% { width: 100%; }
`;

const hackerLoaderBarGlitch = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 200% 0; }
`;

const hackerLoaderParticle = keyframes`
  0% {
    opacity: 0;
    transform: translate(0, 0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(2em, 2em);
  }
`;

const Container = styled.div<{ $color: string }>`
  position: relative;
  width: 24em;
  height: 6em;
  background-color: #0a0a0a;
  border: 0.2em solid ${props => props.$color};
  border-radius: 0.5em;
  padding: 1em;
  overflow: hidden;
  box-shadow: 0 0 1em ${props => props.$color}4D;
`;

const LoaderText = styled.div`
  text-align: center;
  margin-bottom: 1em;
`;

const TextGlitch = styled.span<{ $color: string; $text: string }>`
  color: ${props => props.$color};
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 1.5em;
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: '${props => props.$text}';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a0a0a;
    clip: rect(0, 0, 0, 0);
  }

  &::before {
    left: -0.1em;
    text-shadow: 0.1em 0 #ff00ff;
    animation: ${hackerLoaderGlitchEffect} 3s infinite linear alternate-reverse;
  }

  &::after {
    left: 0.1em;
    text-shadow: -0.1em 0 #1C7FA6;
    animation: ${hackerLoaderGlitchEffect} 2s infinite linear alternate-reverse;
  }
`;

const LoaderBar = styled.div<{ $color: string }>`
  width: 100%;
  height: 0.5em;
  background-color: ${props => props.$color}1A;
  border-radius: 0.25em;
  position: relative;
  overflow: hidden;
`;

const BarFill = styled.div<{ $color: string; $progress?: number; $animated: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.$progress !== undefined ? `${props.$progress}%` : '0'};
  height: 100%;
  background-color: ${props => props.$color};
  ${props => props.$animated && css`animation: ${hackerLoaderBarFill} 2s infinite ease-in-out;`}
`;

const BarGlitch = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(0, 255, 0, 0.2),
    transparent
  );
  background-size: 200% 200%;
  animation: ${hackerLoaderBarGlitch} 2s infinite linear;
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled.div<{ $color: string; $delay: number; $top: string; $left: string }>`
  position: absolute;
  width: 0.2em;
  height: 0.2em;
  background-color: ${props => props.$color};
  border-radius: 50%;
  opacity: 0;
  top: ${props => props.$top};
  left: ${props => props.$left};
  animation: ${hackerLoaderParticle} 2s infinite linear;
  animation-delay: ${props => props.$delay}s;
`;

const particlePositions = [
  { top: '10%', left: '10%', delay: 0 },
  { top: '30%', left: '60%', delay: 0.5 },
  { top: '70%', left: '30%', delay: 1 },
  { top: '90%', left: '90%', delay: 1.5 },
  { top: '50%', left: '50%', delay: 2 },
];

export function HackerLoader({
  text = 'LOADING',
  progress,
  color = '#29F2DF',
  className = '',
}: HackerLoaderProps) {
  const isAnimated = progress === undefined;

  return (
    <Container $color={color} className={className}>
      <LoaderText>
        <TextGlitch $color={color} $text={text} data-text={text}>
          {text}
        </TextGlitch>
      </LoaderText>
      <LoaderBar $color={color}>
        <BarFill $color={color} $progress={progress} $animated={isAnimated} />
        <BarGlitch />
      </LoaderBar>
      <Particles>
        {particlePositions.map((pos, index) => (
          <Particle
            key={index}
            $color={color}
            $delay={pos.delay}
            $top={pos.top}
            $left={pos.left}
          />
        ))}
      </Particles>
    </Container>
  );
}

export default HackerLoader;
