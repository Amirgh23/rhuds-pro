import React from 'react';
import styled from 'styled-components';

export interface BinaryWaveLoaderProps {
  primaryColor?: string;
  backgroundColor?: string;
  width?: string;
  height?: string;
}

export const BinaryWaveLoader: React.FC<BinaryWaveLoaderProps> = ({
  primaryColor = '#000',
  backgroundColor = '#ddd',
  width = '120px',
  height = '20px',
}) => {
  return (
    <StyledWrapper
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      width={width}
      height={height}
    >
      <div className="loader" />
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  primaryColor: string;
  backgroundColor: string;
  width: string;
  height: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .loader {
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background:
      linear-gradient(${(props) => props.primaryColor} 50%, #0000 0),
      linear-gradient(#0000 50%, ${(props) => props.primaryColor} 0),
      linear-gradient(${(props) => props.primaryColor} 50%, #0000 0),
      linear-gradient(#0000 50%, ${(props) => props.primaryColor} 0),
      linear-gradient(${(props) => props.primaryColor} 50%, #0000 0),
      linear-gradient(#0000 50%, ${(props) => props.primaryColor} 0)
        ${(props) => props.backgroundColor};
    background-size: calc(100% / 6 + 1px) 200%;
    background-repeat: no-repeat;
    animation: l12 2s infinite;
  }

  @keyframes l12 {
    0% {
      background-position:
        calc(0 * 100% / 5) 100%,
        calc(1 * 100% / 5) 0%,
        calc(2 * 100% / 5) 100%,
        calc(3 * 100% / 5) 0%,
        calc(4 * 100% / 5) 100%,
        calc(5 * 100% / 5) 0%;
    }
    16.67% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 0%,
        calc(2 * 100% / 5) 100%,
        calc(3 * 100% / 5) 0%,
        calc(4 * 100% / 5) 100%,
        calc(5 * 100% / 5) 0%;
    }
    33.33% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 100%,
        calc(2 * 100% / 5) 100%,
        calc(3 * 100% / 5) 0%,
        calc(4 * 100% / 5) 100%,
        calc(5 * 100% / 5) 0%;
    }
    50% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 100%,
        calc(2 * 100% / 5) 0%,
        calc(3 * 100% / 5) 0%,
        calc(4 * 100% / 5) 100%,
        calc(5 * 100% / 5) 0%;
    }
    66.67% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 100%,
        calc(2 * 100% / 5) 0%,
        calc(3 * 100% / 5) 100%,
        calc(4 * 100% / 5) 100%,
        calc(5 * 100% / 5) 0%;
    }
    83.33% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 100%,
        calc(2 * 100% / 5) 0%,
        calc(3 * 100% / 5) 100%,
        calc(4 * 100% / 5) 0%,
        calc(5 * 100% / 5) 0%;
    }
    100% {
      background-position:
        calc(0 * 100% / 5) 0%,
        calc(1 * 100% / 5) 100%,
        calc(2 * 100% / 5) 0%,
        calc(3 * 100% / 5) 100%,
        calc(4 * 100% / 5) 0%,
        calc(5 * 100% / 5) 100%;
    }
  }
`;
