import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface GlitchFrameProps {
  children?: React.ReactNode;
  animated?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

export const GlitchFrame: React.FC<GlitchFrameProps> = ({
  children,
  animated = true,
  width = '100%',
  height = 'auto',
  className,
}) => {
  return (
    <StyledWrapper className={className} $width={width} $height={height} $animated={animated}>
      <div className="glitch-frame-container">
        <div className="glitch-frame-content">
          <div className="glitch-frame-inner">
            {children}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const backglitch = keyframes`
  0% {
    box-shadow: inset 0px 20px 20px 30px #0a0e27;
  }
  50% {
    box-shadow: inset 0px -20px 20px 30px #151932;
  }
  100% {
    box-shadow: inset 0px 20px 20px 30px #0a0e27;
  }
`;

const blinkShadowsFilter = keyframes`
  0% {
    filter: drop-shadow(46px 36px 28px rgba(41, 242, 223, 0.35))
      drop-shadow(-55px -40px 28px rgba(27, 253, 156, 0.3));
  }
  25% {
    filter: drop-shadow(46px -36px 24px rgba(41, 242, 223, 0.5))
      drop-shadow(-55px 40px 24px rgba(27, 253, 156, 0.45));
  }
  50% {
    filter: drop-shadow(46px 36px 30px rgba(41, 242, 223, 0.6))
      drop-shadow(-55px 40px 30px rgba(27, 253, 156, 0.35));
  }
  75% {
    filter: drop-shadow(20px -18px 25px rgba(41, 242, 223, 0.5))
      drop-shadow(-20px 20px 25px rgba(27, 253, 156, 0.4));
  }
  100% {
    filter: drop-shadow(46px 36px 28px rgba(41, 242, 223, 0.35))
      drop-shadow(-55px -40px 28px rgba(27, 253, 156, 0.3));
  }
`;

const StyledWrapper = styled.div<{ $width: string; $height: string; $animated: boolean }>`
  width: ${props => props.$width};
  height: ${props => props.$height};
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  justify-content: center;

  .glitch-frame-container {
    width: 100%;
    height: 100%;
    filter: ${props => props.$animated 
      ? 'drop-shadow(46px 36px 24px rgba(41, 242, 223, 0.4)) drop-shadow(-55px -40px 25px rgba(27, 253, 156, 0.3))'
      : 'drop-shadow(0 4px 12px rgba(41, 242, 223, 0.3))'
    };
    animation: ${props => props.$animated ? blinkShadowsFilter : 'none'} 8s ease-in infinite;
  }

  .glitch-frame-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    align-content: center;
    justify-items: center;
    align-items: center;
    text-align: center;
    padding: 1em;
  }

  .glitch-frame-content::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(40px);
    clip-path: polygon(
      26% 0,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    background: rgba(41, 242, 223, 0.5);
    transition: all 1s ease-in-out;
    pointer-events: none;
  }

  .glitch-frame-content::after {
    content: '';
    position: absolute;
    width: 98%;
    height: 98%;
    box-shadow: inset 0px 0px 20px 20px #0a0e27;
    background: repeating-linear-gradient(
        to bottom,
        transparent 0%,
        rgba(41, 242, 223, 0.15) 1px,
        rgb(0, 0, 0) 3px,
        #0a0e27 5px,
        #151932 4px,
        transparent 0.5%
      ),
      repeating-linear-gradient(
        to left,
        #0a0e27 100%,
        rgba(10, 14, 39, 0.99) 100%
      );
    clip-path: polygon(
      26% 0,
      31% 5%,
      61% 5%,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    animation: ${props => props.$animated ? backglitch : 'none'} 50ms linear infinite;
    pointer-events: none;
  }

  .glitch-frame-inner {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
`;

export default GlitchFrame;
