/**
 * HudFrame Component
 * Complex HUD frame with neon lines and title box
 */

import React from 'react';
import styled from 'styled-components';
import NeonLine from './NeonLine';
import TitleBox from './TitleBox';

export interface HudFrameProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  header?: {
    title?: string;
    description?: string;
    number?: number;
  };
  color?: string;
}

const StyledFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  width: 100%;
  padding: 2rem 0;
  
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Line = styled(NeonLine)<{ $top?: string; $bottom?: string; $left?: string; $right?: string; $width?: string; $height?: string; $rotate?: string }>`
  ${props => props.$top && `top: ${props.$top};`}
  ${props => props.$bottom && `bottom: ${props.$bottom};`}
  ${props => props.$left && `left: ${props.$left};`}
  ${props => props.$right && `right: ${props.$right};`}
  ${props => props.$width && `width: ${props.$width};`}
  ${props => props.$height && `height: ${props.$height};`}
  ${props => props.$rotate && `transform: rotate(${props.$rotate});`}
`;

export function HudFrame({
  children,
  className = '',
  innerClassName = '',
  header = {},
  color = '#00f6ff',
}: HudFrameProps) {
  return (
    <StyledFrame className={className}>
      {/* Top right corner lines */}
      <Line $top="0" $right="10rem" $height="0.8rem" $width="9rem" color={color} shadow />
      <Line $top="0.6rem" $right="0" $height="0.2rem" $width="calc(100% - 6.25rem)" color={color} shadow />
      <Line $top="0" $right="0" $height="0.8rem" $width="4.375rem" color={color} shadow />
      <Line $top="1.4rem" $right="-3.5rem" $height="0.8rem" $width="4.375rem" $rotate="45deg" color={color} shadow />
      <Line $top="4.55rem" $right="-8.4375rem" $height="0.2rem" $width="9.375rem" $rotate="45deg" color={color} shadow />
      <Line $top="2.5rem" $width="73%" $right="0.28rem" $height="0.2rem" color={color} shadow />
      <Line $top="4.1875rem" $width="5rem" $height="0.2rem" $right="-3.9375rem" $rotate="45deg" color={color} shadow />
      
      {/* Top left corner lines */}
      <Line $top="1.66rem" $left="3.33rem" $height="0.8rem" $width="3.3rem" color={color} shadow />
      <Line $top="1.66rem" $left="5rem" $height="0.2rem" $width="6.6rem" color={color} shadow />
      <Line $top="1.418rem" $left="1.829rem" $width="0.8rem" $height="3.75rem" $rotate="45deg" color={color} shadow />
      
      {/* Left side lines */}
      <Line $top="4.4rem" $left="0.63rem" $width="0.8rem" $height="4rem" color={color} shadow />
      <Line $top="7.5rem" $left="0.625rem" $width="0.2rem" $height="5.625rem" color={color} shadow />
      <Line $bottom="3.125rem" $left="0.125rem" $width="0.8rem" $height="6.25rem" color={color} shadow />
      <Line $bottom="0" $left="0.7rem" $width="0.2rem" $height="7.5rem" color={color} shadow />
      
      {/* Bottom lines */}
      <Line $bottom="0" $right="0" $width="7.5rem" $height="0.8rem" color={color} shadow />
      <Line $bottom="0" $left="3.75rem" $width="calc(100% - 3.75rem)" $height="0.2rem" color={color} shadow />
      <Line $bottom="-0.125rem" $right="-1.125rem" $width="0.8rem" $height="3.75rem" $rotate="35deg" color={color} shadow />
      <Line $bottom="-0.25rem" $right="-2.375rem" $width="0.2rem" $height="7.5rem" $rotate="35deg" color={color} shadow />
      
      {/* Title Box */}
      {(header.title || header.number !== undefined) && (
        <TitleBox
          title={header.title}
          number={header.number}
          tooltipText={header.description}
          style={{ top: '1rem', right: '8rem', width: '14rem' }}
          color={color}
        />
      )}
      
      {/* Content */}
      <ContentWrapper className={innerClassName}>
        {children}
      </ContentWrapper>
    </StyledFrame>
  );
}

export default HudFrame;
