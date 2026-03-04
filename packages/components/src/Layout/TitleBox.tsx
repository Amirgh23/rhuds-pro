/**
 * TitleBox Component
 * Title box with number badge for HUD frames
 */

import React from 'react';
import styled from 'styled-components';
import { Text } from '../Text/Text';
import { Tooltip } from '../Utility/Tooltip';

export interface TitleBoxProps {
  title?: string;
  number?: number;
  tooltipText?: string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

const StyledTitleBox = styled.div<{ $color: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 10, 20, 0.9);
  border: 1px solid ${props => props.$color};
  border-radius: 4px;
  box-shadow: 
    0 0 10px ${props => props.$color}40,
    inset 0 0 10px ${props => props.$color}20;
  backdrop-filter: blur(10px);
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    gap: 0.4rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    gap: 0.3rem;
    font-size: 0.75rem;
    max-width: 10rem;
  }
`;

const NumberBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  background: ${props => props.$color}20;
  border: 1px solid ${props => props.$color};
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.$color};
  text-shadow: 0 0 10px ${props => props.$color};
  
  @media (max-width: 768px) {
    min-width: 1.75rem;
    height: 1.75rem;
    font-size: 0.9rem;
    padding: 0 0.4rem;
  }
  
  @media (max-width: 480px) {
    min-width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
    padding: 0 0.3rem;
  }
`;

export function TitleBox({
  title,
  number,
  tooltipText,
  className = '',
  style,
  color = '#00f6ff',
}: TitleBoxProps) {
  const content = (
    <StyledTitleBox className={className} $color={color} style={style}>
      {number !== undefined && (
        <NumberBadge $color={color}>
          {String(number).padStart(2, '0')}
        </NumberBadge>
      )}
      {title && (
        <Text 
          variant="body" 
          style={{ 
            color, 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.9rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Text>
      )}
    </StyledTitleBox>
  );

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText} position="bottom">
        {content}
      </Tooltip>
    );
  }

  return content;
}

export default TitleBox;
