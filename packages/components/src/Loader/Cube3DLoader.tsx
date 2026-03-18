import React from 'react';
import styled from 'styled-components';

export interface Cube3DLoaderProps {
  /** Custom className */
  className?: string;
}

export const Cube3DLoader: React.FC<Cube3DLoaderProps> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <div className="cube">
        <div className="topD" />
        <div>
          <span style={{ '--i': 0 } as React.CSSProperties} />
          <span style={{ '--i': 1 } as React.CSSProperties} />
          <span style={{ '--i': 2 } as React.CSSProperties} />
          <span style={{ '--i': 3 } as React.CSSProperties} />
        </div>
        <div className="cube2">
          <div>
            <span style={{ '--i': 0 } as React.CSSProperties} />
            <span style={{ '--i': 1 } as React.CSSProperties} />
            <span style={{ '--i': 2 } as React.CSSProperties} />
            <span style={{ '--i': 3 } as React.CSSProperties} />
          </div>
          <div className="cube3">
            <div className="top3" />
            <div>
              <span style={{ '--i': 0 } as React.CSSProperties} />
              <span style={{ '--i': 1 } as React.CSSProperties} />
              <span style={{ '--i': 2 } as React.CSSProperties} />
              <span style={{ '--i': 3 } as React.CSSProperties} />
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;

  .cube {
    position: relative;
    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
    transform: rotateX(-30deg);
    animation: animateD 8s linear infinite;
  }

  @keyframes animateD {
    0% {
      transform: rotateX(-15deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(-15deg) rotateY(-360deg);
    }
  }

  .cube div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .cube2 {
    position: relative;
    width: 150px;
    height: 150px;
    transform-style: preserve-3d;
    animation: animateD2 5s ease-out infinite alternate;
  }

  @keyframes animateD2 {
    0% {
      transform: rotateX(0deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(180deg) rotateY(-360deg);
    }
  }

  .cube2 div {
    position: absolute;
    top: 35px;
    left: 0;
    width: 65%;
    height: 65%;
    transform-style: preserve-3d;
  }

  .cube2 div span {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 65%;
    height: 65%;
    background: transparent;
    border: 2px solid #7dff99;
    transform: rotateY(calc(90deg * var(--i))) translateZ(62px);
  }

  .cube3 {
    position: absolute;
    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
    transform: rotateX(-30deg);
    animation: animateD3 1s ease-in-out infinite alternate;
  }

  @keyframes animateD3 {
    0% {
      transform: rotateX(-90deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(90deg) rotateY(45deg);
    }
  }

  .cube3 div {
    position: absolute;
    top: 70px;
    left: 70px;
    width: 15%;
    height: 15%;
    transform-style: preserve-3d;
  }

  .cube3 div span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #7dff99;
    transform: rotateY(calc(90deg * var(--i))) translateZ(14px);
    box-shadow: 0px 0px 7px #7dff99;
  }

  .top3 {
    position: absolute;
    top: 0;
    left: 0;
    background: #7dff99;
    transform: rotateX(90deg) translateZ(14px);
    box-shadow: 0px 0px 10px #7dff99;
  }
`;

export default Cube3DLoader;
