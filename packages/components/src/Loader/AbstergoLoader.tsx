/**
 * AbstergoLoader Component
 * Animated triangular loader with synchronization text
 */

import React from 'react';
import styled from 'styled-components';

export interface AbstergoLoaderProps {
  text?: string;
  size?: number;
  className?: string;
}

const StyledWrapper = styled.div<{ $size: number }>`
  .ui-abstergo {
    --primary: #fff;
    --secondary: rgba(255, 255, 255, 0.3);
    --shadow-blur: 3px;
    --text-shadow-blur: 3px;
    --animation-duration: 2s;
    --size: ${props => props.$size};
  }

  .abstergo-loader * {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
  }

  .ui-abstergo {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    row-gap: 30px;
    scale: var(--size);
  }

  .ui-abstergo .ui-text {
    color: var(--primary);
    text-shadow: 0 0 var(--text-shadow-blur) var(--secondary);
    font-family: Menlo, sans-serif;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    -webkit-column-gap: 3px;
    -moz-column-gap: 3px;
    column-gap: 3px;
  }

  .ui-abstergo .ui-dot {
    content: "";
    display: block;
    width: 3px;
    height: 3px;
    -webkit-animation: abstergoLoaderDots var(--animation-duration) infinite linear;
    animation: abstergoLoaderDots var(--animation-duration) infinite linear;
    -webkit-animation-delay: .4s;
    animation-delay: .4s;
    background-color: var(--primary);
  }

  .ui-abstergo .ui-dot:nth-child(2) {
    -webkit-animation-delay: .8s;
    animation-delay: .8s;
  }

  .ui-abstergo .ui-dot:nth-child(3) {
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }

  .ui-abstergo .ui-dot+.ui-dot {
    margin-left: 3px;
  }

  .abstergo-loader {
    width: 103px;
    height: 90px;
    position: relative;
  }

  .abstergo-loader div {
    width: 50px;
    border-right: 12px solid transparent;
    border-left: 12px solid transparent;
    border-top: 21px solid var(--primary);
    position: absolute;
    -webkit-filter: drop-shadow(0 0 var(--shadow-blur) var(--secondary));
    filter: drop-shadow(0 0 var(--shadow-blur) var(--secondary));
  }

  .abstergo-loader div:nth-child(1) {
    top: 27px;
    left: 7px;
    rotate: -60deg;
    -webkit-animation: abstergoLoaderLine1 var(--animation-duration) linear infinite alternate;
    animation: abstergoLoaderLine1 var(--animation-duration) linear infinite alternate;
  }

  .abstergo-loader div:nth-child(2) {
    bottom: 2px;
    left: 0;
    rotate: 180deg;
    -webkit-animation: abstergoLoaderLine2 var(--animation-duration) linear infinite alternate;
    animation: abstergoLoaderLine2 var(--animation-duration) linear infinite alternate;
  }

  .abstergo-loader div:nth-child(3) {
    bottom: 16px;
    right: -9px;
    rotate: 60deg;
    -webkit-animation: abstergoLoaderLine3 var(--animation-duration) linear infinite alternate;
    animation: abstergoLoaderLine3 var(--animation-duration) linear infinite alternate;
  }

  .abstergo-loader:hover div:nth-child(1) {
    top: 21px;
    left: 14px;
    rotate: 60deg;
  }

  .abstergo-loader:hover div:nth-child(2) {
    bottom: 5px;
    left: -8px;
    rotate: 300deg;
  }

  .abstergo-loader:hover div:nth-child(3) {
    bottom: 7px;
    right: -11px;
    rotate: 180deg;
  }

  @-webkit-keyframes abstergoLoaderLine1 {
    0%,
    40% {
      top: 27px;
      left: 7px;
      rotate: -60deg;
    }
    60%,
    100% {
      top: 22px;
      left: 14px;
      rotate: 60deg;
    }
  }

  @keyframes abstergoLoaderLine1 {
    0%,
    40% {
      top: 27px;
      left: 7px;
      rotate: -60deg;
    }
    60%,
    100% {
      top: 22px;
      left: 14px;
      rotate: 60deg;
    }
  }

  @-webkit-keyframes abstergoLoaderLine2 {
    0%,
    40% {
      bottom: 2px;
      left: 0;
      rotate: 180deg;
    }
    60%,
    100% {
      bottom: 5px;
      left: -8px;
      rotate: 300deg;
    }
  }

  @keyframes abstergoLoaderLine2 {
    0%,
    40% {
      bottom: 2px;
      left: 0;
      rotate: 180deg;
    }
    60%,
    100% {
      bottom: 5px;
      left: -8px;
      rotate: 300deg;
    }
  }

  @-webkit-keyframes abstergoLoaderLine3 {
    0%,
    40% {
      bottom: 16px;
      right: -9px;
      rotate: 60deg;
    }
    60%,
    100% {
      bottom: 7px;
      right: -11px;
      rotate: 180deg;
    }
  }

  @keyframes abstergoLoaderLine3 {
    0%,
    40% {
      bottom: 16px;
      right: -9px;
      rotate: 60deg;
    }
    60%,
    100% {
      bottom: 7px;
      right: -11px;
      rotate: 180deg;
    }
  }

  @-webkit-keyframes abstergoLoaderDots {
    0% {
      background-color: var(--secondary);
    }
    30% {
      background-color: var(--primary);
    }
    70%,
    100% {
      background-color: var(--secondary);
    }
  }

  @keyframes abstergoLoaderDots {
    0% {
      background-color: var(--secondary);
    }
    30% {
      background-color: var(--primary);
    }
    70%,
    100% {
      background-color: var(--secondary);
    }
  }
`;

export function AbstergoLoader({
  text = 'Synchronization',
  size = 1,
  className = '',
}: AbstergoLoaderProps) {
  return (
    <StyledWrapper $size={size} className={className}>
      <div className="ui-abstergo">
        <div className="abstergo-loader">
          <div />
          <div />
          <div />
        </div>
        <div className="ui-text">
          {text}
          <div className="ui-dot" />
          <div className="ui-dot" />
          <div className="ui-dot" />
        </div>
      </div>
    </StyledWrapper>
  );
}

export default AbstergoLoader;
